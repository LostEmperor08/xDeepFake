# DEEPFAKE X — REST API Specification

**Version**: `0.1.0`  
**Base URL**: `http://localhost:8000` (configurable via `HOST` / `PORT`)  
**Interactive Docs**: `http://localhost:8000/docs` (Swagger UI) | `http://localhost:8000/redoc` (ReDoc)

---

## 1. System Endpoints

### 1.1 Root Information
Retrieves service operational state and metadata.

- **Method**: `GET`
- **Path**: `/`
- **Response**: `200 OK`
```json
{
  "name": "DEEPFAKE X Forensic API",
  "version": "0.1.0",
  "status": "operational",
  "phase": "Phase 1 - Repository Foundation & Architecture",
  "docs_url": "/docs",
  "health_url": "/health"
}
```

---

### 1.2 Health Check
Provides system uptime, environment, and registered forensic subsystems.

- **Method**: `GET`
- **Path**: `/health`
- **Response**: `200 OK`
```json
{
  "status": "healthy",
  "uptime_seconds": 128.45,
  "app_name": "DEEPFAKE X Forensic API",
  "version": "0.1.0",
  "environment": "development",
  "active_modules": [
    "image_forensics (stub)",
    "video_forensics (stub)",
    "audio_forensics (stub)",
    "document_forensics (stub)",
    "provenance_forensics (stub)",
    "cross_modal_correlation (stub)"
  ]
}
```

---

### 1.3 List Forensic Modules
Lists all registered inspection subsystems and their phase readiness.

- **Method**: `GET`
- **Path**: `/api/v1/modules`
- **Response**: `200 OK`
```json
{
  "modules": [
    {
      "id": "image_forensics",
      "modality": "image",
      "phase": "Phase 1 Baseline",
      "status": "analysis_not_implemented",
      "description": "Raster header, spatial frequency, and pixel anomaly detector"
    },
    {
      "id": "document_forensics",
      "modality": "document",
      "phase": "Phase 1 Baseline",
      "status": "analysis_not_implemented",
      "description": "PDF object stream, font structure, and revision integrity"
    },
    {
      "id": "video_forensics",
      "modality": "video",
      "phase": "Phase 1 Baseline",
      "status": "analysis_not_implemented",
      "description": "Temporal stability, landmark continuity, and container analysis"
    },
    {
      "id": "audio_forensics",
      "modality": "audio",
      "phase": "Phase 1 Baseline",
      "status": "analysis_not_implemented",
      "description": "Vocoder spectral footprint, LFCC, and voice clone identification"
    },
    {
      "id": "provenance_forensics",
      "modality": "provenance",
      "phase": "Phase 1 Baseline",
      "status": "analysis_not_implemented",
      "description": "C2PA / Content Credentials and EXIF/XMP provenance parser"
    },
    {
      "id": "cross_modal_correlation",
      "modality": "cross_modal",
      "phase": "Phase 1 Baseline",
      "status": "analysis_not_implemented",
      "description": "Audio-visual lip sync and multi-modal coherence verification"
    }
  ]
}
```

---

## 2. Ingestion & Forensic Analysis Endpoints

### 2.1 Upload and Analyze Media Artifact
Uploads an image, video, audio, or PDF file for automated forensic inspection.

- **Method**: `POST`
- **Path**: `/api/v1/analyze`
- **Content-Type**: `multipart/form-data`
- **Parameters**:
  - `file` (binary, required): The target artifact file.
- **Validation Rules**:
  - Max upload size: 50MB (configurable via `MAX_UPLOAD_SIZE_MB`).
  - Allowed extensions: `jpg`, `jpeg`, `png`, `webp`, `mp4`, `avi`, `mov`, `mkv`, `wav`, `mp3`, `flac`, `pdf`.
  - Binary magic byte validation: initial bytes must match declared file type container.

#### Example Request (`curl`)
```bash
curl -X POST "http://localhost:8000/api/v1/analyze" \
  -H "accept: application/json" \
  -F "file=@sample_image.png;type=image/png"
```

#### Example Response (`200 OK`)
```json
{
  "job_id": "job_a1b2c3d4e5f6",
  "status": "completed",
  "message": "Forensic ingest and baseline structural analysis completed successfully.",
  "file_info": {
    "filename": "sample_image.png",
    "size_bytes": 14208,
    "mime_type": "image/png",
    "sha256": "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
    "modality": "image",
    "extension": "png"
  },
  "report": {
    "report_id": "rep_9e8d7c6b5a4f3e2d",
    "file_info": {
      "filename": "sample_image.png",
      "size_bytes": 14208,
      "mime_type": "image/png",
      "sha256": "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
      "modality": "image",
      "extension": "png"
    },
    "created_at": "2026-11-11T15:30:00Z",
    "completed_at": "2026-11-11T15:30:01Z",
    "overall": {
      "risk_score": 0.0,
      "risk_level": "inconclusive",
      "authenticity_assessment": "Baseline Ingestion — Analysis Modules Pending Implementation",
      "summary": "Phase 1 Foundation: File successfully ingested, cryptographically verified, and format-validated. Active forensic inspection models are marked as 'analysis_not_implemented'. No synthetic anomalies or authenticity claims are asserted.",
      "confidence_breakdown": {}
    },
    "modules": {
      "image_forensics": {
        "module": "image_forensics",
        "modality": "image",
        "status": "analysis_not_implemented",
        "risk_level": "inconclusive",
        "model_confidence": null,
        "findings": [],
        "evidence": [
          {
            "id": "ev_img_dims_1731339000",
            "label": "Structural Resolution",
            "description": "Image parsed with dimensions 800x600 (RGB)",
            "modality": "image",
            "confidence": 1.0,
            "source_layer": "raster_header",
            "metadata": {
              "dimensions": { "width": 800, "height": 600 },
              "format": "PNG",
              "mode": "RGB"
            }
          }
        ],
        "limitations": [
          "Phase 1 Foundation: Deep neural detector (FSD/Diffusion) is pending integration.",
          "Spatial frequency FFT and Error Level Analysis (ELA) will be enabled in Phase 2."
        ],
        "processing_time_ms": 1.45,
        "details": {
          "dimensions": { "width": 800, "height": 600 },
          "format": "PNG",
          "mode": "RGB",
          "has_transparency": false
        }
      },
      "provenance_forensics": {
        "module": "provenance_forensics",
        "modality": "provenance",
        "status": "analysis_not_implemented",
        "risk_level": "inconclusive",
        "model_confidence": null,
        "findings": [],
        "evidence": [],
        "limitations": [
          "Phase 1 Foundation: C2PA/CAI cryptographic manifest parser pending Phase 2."
        ],
        "processing_time_ms": 0.12,
        "details": {}
      },
      "cross_modal_correlation": {
        "module": "cross_modal_correlation",
        "modality": "cross_modal",
        "status": "analysis_not_implemented",
        "risk_level": "inconclusive",
        "model_confidence": null,
        "findings": [],
        "evidence": [],
        "limitations": [
          "Phase 1 Foundation: Cross-modal AV-Sync and multimodal correlation scheduled for Phase 2."
        ],
        "processing_time_ms": 0.08,
        "details": {}
      }
    },
    "cross_modal_correlation": null,
    "disclaimer": "Forensic indications represent statistical anomaly analyses and structural metadata verification. They should not be used as sole legal evidence without independent expert evaluation."
  }
}
```

---

### 2.2 Query Job Status
Checks the state or retrieves the completed report of an existing analysis task.

- **Method**: `GET`
- **Path**: `/api/v1/jobs/{job_id}`
- **Response**: `200 OK` or `404 Not Found`

---

## 3. Error Codes & Handling

All API errors return a consistent JSON payload:

```json
{
  "error": {
    "status_code": 415,
    "message": "File signature mismatch for claimed extension '.png'. Header bytes do not match expected container format.",
    "path": "/api/v1/analyze"
  }
}
```

| HTTP Status | Description | Typical Cause |
|---|---|---|
| `400 Bad Request` | Malformed request or unwhitelisted extension | File extension not permitted or empty payload |
| `413 Entity Too Large` | Payload exceeds size threshold | File size exceeds `MAX_UPLOAD_SIZE_MB` (50MB) |
| `415 Unsupported Media Type` | Magic byte signature mismatch | Executable or text file renamed to `.png` or `.jpg` |
| `404 Not Found` | Resource not located | Non-existent `job_id` |
| `500 Server Error` | Internal processing error | Unexpected exception during parsing |
