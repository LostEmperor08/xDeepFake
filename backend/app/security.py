"""Security, File Ingestion, and Forensic Validation Module.

Enforces:
- File size thresholds
- Extension white-listing
- Binary magic byte validation (preventing extension spoofing)
- Safe temporary filesystem isolation with UUID names
- Path traversal prevention
- Streaming SHA-256 cryptographic hashing
"""

import hashlib
import os
import re
from pathlib import Path
from typing import Tuple
import uuid
from fastapi import HTTPException, UploadFile, status

from app.config import get_settings
from app.schemas import FileInfo, Modality

# File signature magic headers
MAGIC_SIGNATURES = {
    # Images
    "jpeg": [(0, b"\xff\xd8\xff")],
    "jpg": [(0, b"\xff\xd8\xff")],
    "png": [(0, b"\x89PNG\r\n\x1a\n")],
    "webp": [(0, b"RIFF"), (8, b"WEBP")],
    # Documents
    "pdf": [(0, b"%PDF-")],
    # Audio
    "wav": [(0, b"RIFF"), (8, b"WAVE")],
    "flac": [(0, b"fLaC")],
    "mp3": [(0, b"ID3"), (0, b"\xff\xfb"), (0, b"\xff\xf3"), (0, b"\xff\xf2")],
    # Video
    "mp4": [(4, b"ftyp")],
    "mov": [(4, b"ftyp"), (4, b"moov"), (4, b"wide")],
    "avi": [(0, b"RIFF"), (8, b"AVI ")],
    "mkv": [(0, b"\x1a\x45\xdf\xa3")],
}

# Modality classification by extension
EXTENSION_TO_MODALITY = {
    "jpg": Modality.IMAGE,
    "jpeg": Modality.IMAGE,
    "png": Modality.IMAGE,
    "webp": Modality.IMAGE,
    "mp4": Modality.VIDEO,
    "avi": Modality.VIDEO,
    "mov": Modality.VIDEO,
    "mkv": Modality.VIDEO,
    "wav": Modality.AUDIO,
    "mp3": Modality.AUDIO,
    "flac": Modality.AUDIO,
    "pdf": Modality.DOCUMENT,
}

# MIME type mapping
EXTENSION_TO_MIME = {
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    "png": "image/png",
    "webp": "image/webp",
    "mp4": "video/mp4",
    "avi": "video/x-msvideo",
    "mov": "video/quicktime",
    "mkv": "video/x-matroska",
    "wav": "audio/wav",
    "mp3": "audio/mpeg",
    "flac": "audio/flac",
    "pdf": "application/pdf",
}


def sanitize_filename(filename: str) -> str:
    """Strips path traversal attempts and hazardous characters."""
    base = os.path.basename(filename)
    sanitized = re.sub(r"[^a-zA-Z0-9_.-]", "_", base)
    return sanitized or "unnamed_artifact"


def verify_magic_bytes(header: bytes, extension: str) -> bool:
    """Verifies that initial file bytes match the claimed format signature.

    Returns True if valid or if format does not have a strict magic requirement.
    """
    ext = extension.lower()
    signatures = MAGIC_SIGNATURES.get(ext)
    if not signatures:
        return True

    # Check for single-match (like mp3 where any of the alternatives match)
    if ext == "mp3":
        return any(
            len(header) >= offset + len(sig) and header[offset : offset + len(sig)] == sig
            for offset, sig in signatures
        )

    # For container formats with multiple required checks (e.g., RIFF + WEBP)
    # Group check: if all rules for a signature pattern match
    return all(
        len(header) >= offset + len(sig) and header[offset : offset + len(sig)] == sig
        for offset, sig in signatures
    )


async def validate_and_save_upload(
    upload_file: UploadFile,
) -> Tuple[FileInfo, Path]:
    """Validates an incoming uploaded file for size, format, and magic bytes.

    Saves the file to a secure temporary location and returns validated FileInfo
    and the filesystem Path.
    """
    settings = get_settings()

    if not upload_file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File upload missing filename.",
        )

    raw_filename = sanitize_filename(upload_file.filename)
    ext = raw_filename.split(".")[-1].lower() if "." in raw_filename else ""

    if not ext or ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"File extension '{ext}' is not supported. "
                f"Supported formats: {sorted(list(settings.ALLOWED_EXTENSIONS))}"
            ),
        )

    # Prepare secure storage directory
    upload_dir = settings.UPLOAD_DIR
    upload_dir.mkdir(parents=True, exist_ok=True)

    unique_id = str(uuid.uuid4())
    secure_filename = f"{unique_id}.{ext}"
    destination_path = upload_dir / secure_filename

    hasher = hashlib.sha256()
    total_bytes = 0
    max_bytes = settings.max_upload_size_bytes

    # Read chunks safely
    chunk_size = 64 * 1024  # 64KB
    first_chunk = True

    try:
        with open(destination_path, "wb") as f_out:
            while True:
                chunk = await upload_file.read(chunk_size)
                if not chunk:
                    break

                # Inspect magic bytes on the initial chunk
                if first_chunk:
                    if not verify_magic_bytes(chunk[:32], ext):
                        raise HTTPException(
                            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                            detail=(
                                f"File signature mismatch for claimed extension '.{ext}'. "
                                "Header bytes do not match expected container format."
                            ),
                        )
                    first_chunk = False

                total_bytes += len(chunk)
                if total_bytes > max_bytes:
                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail=(
                            f"File exceeds maximum allowed upload size of {settings.MAX_UPLOAD_SIZE_MB}MB."
                        ),
                    )

                hasher.update(chunk)
                f_out.write(chunk)

    except HTTPException:
        # Clean up partial temporary file if validation failed
        if destination_path.exists():
            destination_path.unlink(missing_ok=True)
        raise
    except Exception as exc:
        if destination_path.exists():
            destination_path.unlink(missing_ok=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred during file ingestion: {str(exc)}",
        )

    if total_bytes == 0:
        if destination_path.exists():
            destination_path.unlink(missing_ok=True)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty (0 bytes).",
        )

    sha256_digest = hasher.hexdigest()
    modality = EXTENSION_TO_MODALITY.get(ext, Modality.IMAGE)
    mime_type = EXTENSION_TO_MIME.get(ext, upload_file.content_type or "application/octet-stream")

    file_info = FileInfo(
        filename=raw_filename,
        size_bytes=total_bytes,
        mime_type=mime_type,
        sha256=sha256_digest,
        modality=modality,
        extension=ext,
    )

    return file_info, destination_path
