"""Tests for Media Upload and Analysis API Endpoints."""

import io
import pytest
from httpx import ASGITransport, AsyncClient
from PIL import Image
from app.main import app


def create_minimal_png_bytes() -> bytes:
    """Generates a valid 10x10 PNG in memory for testing."""
    img = Image.new("RGB", (10, 10), color="red")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def create_minimal_jpeg_bytes() -> bytes:
    """Generates a valid 10x10 JPEG in memory for testing."""
    img = Image.new("RGB", (10, 10), color="blue")
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()


@pytest.mark.asyncio
async def test_upload_valid_png():
    png_bytes = create_minimal_png_bytes()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        files = {"file": ("test_artifact.png", png_bytes, "image/png")}
        response = await client.post("/api/v1/analyze", files=files)
        assert response.status_code == 200
        data = response.json()

        assert "job_id" in data
        assert data["status"] == "completed"
        assert data["file_info"]["filename"] == "test_artifact.png"
        assert data["file_info"]["modality"] == "image"
        assert len(data["file_info"]["sha256"]) == 64

        report = data["report"]
        assert report is not None
        assert "overall" in report
        assert report["overall"]["risk_level"] == "inconclusive"
        assert "modules" in report
        assert "image_forensics" in report["modules"]
        # Verify module explicitly states analysis_not_implemented
        img_module = report["modules"]["image_forensics"]
        assert img_module["status"] == "analysis_not_implemented"
        assert img_module["limitations"] is not None


@pytest.mark.asyncio
async def test_upload_invalid_extension():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        files = {"file": ("malicious_payload.exe", b"MZ\x90\x00", "application/x-msdownload")}
        response = await client.post("/api/v1/analyze", files=files)
        assert response.status_code == 400
        assert "not supported" in response.json()["error"]["message"]


@pytest.mark.asyncio
async def test_upload_spoofed_extension():
    # Claiming PNG but delivering plain text header
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        files = {"file": ("spoofed.png", b"Plain text masquerading as PNG", "image/png")}
        response = await client.post("/api/v1/analyze", files=files)
        assert response.status_code == 415
        assert "signature mismatch" in response.json()["error"]["message"].lower()
