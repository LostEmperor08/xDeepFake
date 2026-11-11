"""DEEPFAKE X - Forensic API Gateway.

FastAPI Application providing multimodal media ingestion, forensic module routing,
and explainable verification reports.
"""

import logging
import sys
import time
from contextlib import asynccontextmanager
from typing import Dict
from fastapi import FastAPI, File, HTTPException, Request, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import get_settings
from app.jobs import job_registry
from app.modules.audio import analyze_audio
from app.modules.cross_modal import analyze_cross_modal
from app.modules.document import analyze_document
from app.modules.image import analyze_image
from app.modules.provenance import analyze_provenance
from app.modules.video import analyze_video
from app.report import generate_forensic_report
from app.schemas import (
    HealthResponse,
    Modality,
    ModuleResult,
    UploadResponse,
)
from app.security import validate_and_save_upload

# Configure logging
settings = get_settings()
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("deepfake_x")

SERVER_START_TIME = time.time()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle events for application startup and shutdown."""
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION} [{settings.APP_ENV}]")
    settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    yield
    logger.info("Shutting down DEEPFAKE X Forensic API")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "Multimodal synthetic media forensics and authenticity verification platform. "
        "Examines images, video, audio, and documents for explainable forensic analysis."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def request_timing_middleware(request: Request, call_next):
    """Tracks latency and logs incoming requests."""
    start_time = time.perf_counter()
    response = await call_next(request)
    duration_ms = (time.perf_counter() - start_time) * 1000.0
    response.headers["X-Response-Time-Ms"] = f"{duration_ms:.2f}"
    return response


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Structured handler for standard HTTP exceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "status_code": exc.status_code,
                "message": exc.detail,
                "path": request.url.path,
            }
        },
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    """Catch-all handler ensuring structured errors for unanticipated faults."""
    logger.exception(f"Unhandled error processing request to {request.url.path}: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "status_code": 500,
                "message": "An internal server error occurred during forensic processing.",
                "path": request.url.path,
            }
        },
    )


@app.get("/", summary="Root System Information")
async def root() -> Dict[str, str]:
    """Provides high-level system information and API status."""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "operational",
        "phase": "Phase 1 - Repository Foundation & Architecture",
        "docs_url": "/docs",
        "health_url": "/health",
    }


@app.get("/health", response_model=HealthResponse, summary="Health Check")
async def health() -> HealthResponse:
    """Returns runtime health metrics, server uptime, and active module status."""
    uptime = time.time() - SERVER_START_TIME
    active_modules = [
        "image_forensics (stub)",
        "video_forensics (stub)",
        "audio_forensics (stub)",
        "document_forensics (stub)",
        "provenance_forensics (stub)",
        "cross_modal_correlation (stub)",
    ]
    return HealthResponse(
        status="healthy",
        uptime_seconds=round(uptime, 2),
        app_name=settings.APP_NAME,
        version=settings.APP_VERSION,
        environment=settings.APP_ENV,
        active_modules=active_modules,
    )


@app.get("/api/v1/modules", summary="List Registered Forensic Modules")
async def list_modules():
    """Lists registered forensic subsystems and their implementation state."""
    return {
        "modules": [
            {
                "id": "image_forensics",
                "modality": "image",
                "phase": "Phase 1 Baseline",
                "status": "analysis_not_implemented",
                "description": "Raster header, spatial frequency, and pixel anomaly detector",
            },
            {
                "id": "document_forensics",
                "modality": "document",
                "phase": "Phase 1 Baseline",
                "status": "analysis_not_implemented",
                "description": "PDF object stream, font structure, and revision integrity",
            },
            {
                "id": "video_forensics",
                "modality": "video",
                "phase": "Phase 1 Baseline",
                "status": "analysis_not_implemented",
                "description": "Temporal stability, landmark continuity, and container analysis",
            },
            {
                "id": "audio_forensics",
                "modality": "audio",
                "phase": "Phase 1 Baseline",
                "status": "analysis_not_implemented",
                "description": "Vocoder spectral footprint, LFCC, and voice clone identification",
            },
            {
                "id": "provenance_forensics",
                "modality": "provenance",
                "phase": "Phase 1 Baseline",
                "status": "analysis_not_implemented",
                "description": "C2PA / Content Credentials and EXIF/XMP provenance parser",
            },
            {
                "id": "cross_modal_correlation",
                "modality": "cross_modal",
                "phase": "Phase 1 Baseline",
                "status": "analysis_not_implemented",
                "description": "Audio-visual lip sync and multi-modal coherence verification",
            },
        ]
    }


@app.post(
    "/api/v1/analyze",
    response_model=UploadResponse,
    status_code=status.HTTP_200_OK,
    summary="Upload Media for Multimodal Forensic Analysis",
)
async def analyze_media(
    file: UploadFile = File(..., description="Media file to analyze (Image, Video, Audio, or PDF)")
):
    """Validates file upload, creates a tracked forensic job, executes module pipeline,

    and returns a structured forensic report.

    Modules in Phase 1 return an explicit 'analysis_not_implemented' status.
    Temporary files are securely removed after processing.
    """
    logger.info(f"Received media analysis request for file: '{file.filename}'")

    file_info, temp_path = await validate_and_save_upload(file)
    logger.info(
        f"File validated: {file_info.filename} ({file_info.modality.value}, {file_info.size_bytes} bytes, sha256: {file_info.sha256[:12]}...)"
    )

    job_record = job_registry.create_job(file_info)

    try:
        module_results: Dict[str, ModuleResult] = {}

        # Route to appropriate primary modality module
        if file_info.modality == Modality.IMAGE:
            module_results["image_forensics"] = analyze_image(temp_path, file_info.filename)
        elif file_info.modality == Modality.DOCUMENT:
            module_results["document_forensics"] = analyze_document(temp_path, file_info.filename)
        elif file_info.modality == Modality.VIDEO:
            module_results["video_forensics"] = analyze_video(temp_path, file_info.filename)
        elif file_info.modality == Modality.AUDIO:
            module_results["audio_forensics"] = analyze_audio(temp_path, file_info.filename)

        # Execute shared provenance and cross-modal subsystems
        module_results["provenance_forensics"] = analyze_provenance(temp_path, file_info.filename)
        module_results["cross_modal_correlation"] = analyze_cross_modal(temp_path, file_info.filename)

        # Synthesize final report
        report = generate_forensic_report(
            file_info=file_info,
            module_results=module_results,
            created_at=job_record.created_at,
        )

        job_registry.complete_job(job_record.job_id, report)
        logger.info(f"Analysis complete for job {job_record.job_id}. Report ID: {report.report_id}")

        return UploadResponse(
            job_id=job_record.job_id,
            status="completed",
            message="Forensic ingest and baseline structural analysis completed successfully.",
            file_info=file_info,
            report=report,
        )

    except Exception as exc:
        job_registry.fail_job(job_record.job_id, str(exc))
        logger.exception(f"Error during analysis pipeline for job {job_record.job_id}: {exc}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis pipeline error: {str(exc)}",
        )
    finally:
        # Secure cleanup of temporary file
        if temp_path.exists():
            try:
                temp_path.unlink(missing_ok=True)
                logger.debug(f"Temporary file cleaned up: {temp_path}")
            except Exception as clean_err:
                logger.warning(f"Failed to delete temporary file {temp_path}: {clean_err}")


@app.get("/api/v1/jobs/{job_id}", summary="Query Job Status")
async def get_job_status(job_id: str):
    """Retrieves the status or completed report of an analysis job."""
    job = job_registry.get_job(job_id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job ID '{job_id}' not found.",
        )
    return job
