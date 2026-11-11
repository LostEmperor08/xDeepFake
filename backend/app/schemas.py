"""Forensic Schema Definitions for DEEPFAKE X.

Defines unified Pydantic models for multimodal evidence correlation,
module outputs, and explainable forensic reporting.
"""

from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class Modality(str, Enum):
    """Supported multimodal forensic categories."""

    IMAGE = "image"
    VIDEO = "video"
    AUDIO = "audio"
    DOCUMENT = "document"
    PROVENANCE = "provenance"
    CROSS_MODAL = "cross_modal"


class RiskLevel(str, Enum):
    """Categorical risk classifications."""

    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"
    INCONCLUSIVE = "inconclusive"


class ModuleStatus(str, Enum):
    """Execution state of individual forensic modules."""

    COMPLETED = "completed"
    ANALYSIS_NOT_IMPLEMENTED = "analysis_not_implemented"
    SKIPPED = "skipped"
    FAILED = "failed"


class Evidence(BaseModel):
    """Individual forensic artifact or statistical measurement."""

    id: str = Field(..., description="Unique evidence identifier")
    label: str = Field(..., description="Short descriptive label")
    description: str = Field(..., description="Technical forensic observation")
    modality: Modality = Field(..., description="Target media modality")
    confidence: Optional[float] = Field(
        None,
        ge=0.0,
        le=1.0,
        description="Uncalibrated raw model/detector metric (0.0 to 1.0)",
    )
    source_layer: str = Field(
        ...,
        description="Originating forensic layer (e.g. metadata_header, spatial_frequency, spectrogram)",
    )
    metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="Additional technical metrics or feature vectors",
    )


class Finding(BaseModel):
    """Synthesized forensic observation linking evidence to suspicious indicators."""

    id: str = Field(..., description="Unique finding identifier")
    title: str = Field(..., description="Concise title of the finding")
    description: str = Field(..., description="Detailed description of the anomaly")
    risk_level: RiskLevel = Field(..., description="Assessed threat level of this finding")
    category: str = Field(
        ...,
        description="Forensic category (e.g., Compression Anomaly, GAN Grid Artifact, Inconsistent Lighting)",
    )
    evidence_refs: List[str] = Field(
        default_factory=list,
        description="References to Evidence IDs supporting this finding",
    )
    explanation: str = Field(
        ...,
        description="Human-readable explainable rationale explaining why this indicates tampering or generation",
    )


class ModuleResult(BaseModel):
    """Consistent output schema implemented by all forensic analysis modules."""

    module: str = Field(..., description="Identifier of the forensic module")
    modality: Modality = Field(..., description="Analyzed media modality")
    status: ModuleStatus = Field(..., description="Module execution status")
    risk_level: RiskLevel = Field(..., description="Module-level risk assessment")
    model_confidence: Optional[float] = Field(
        None,
        ge=0.0,
        le=1.0,
        description="Separate raw detector metric, strictly isolated from holistic risk score",
    )
    findings: List[Finding] = Field(
        default_factory=list,
        description="Specific anomalies identified by this module",
    )
    evidence: List[Evidence] = Field(
        default_factory=list,
        description="Granular empirical data points discovered",
    )
    limitations: List[str] = Field(
        default_factory=list,
        description="Known technical blind spots or environmental caveats for this module",
    )
    processing_time_ms: float = Field(
        0.0,
        ge=0.0,
        description="Execution duration in milliseconds",
    )
    details: Dict[str, Any] = Field(
        default_factory=dict,
        description="Raw technical extraction data (metadata, headers, dimensions)",
    )


class FileInfo(BaseModel):
    """Metadata describing the uploaded media file."""

    filename: str = Field(..., description="Sanitized original filename")
    size_bytes: int = Field(..., description="File size in bytes")
    mime_type: str = Field(..., description="Verified MIME content-type")
    sha256: str = Field(..., description="Cryptographic SHA-256 digest")
    modality: Modality = Field(..., description="Resolved media modality")
    extension: str = Field(..., description="Sanitized file extension")


class OverallScore(BaseModel):
    """Holistic forensic assessment balancing multi-modal evidence."""

    risk_score: float = Field(
        ...,
        ge=0.0,
        le=100.0,
        description="Calibrated holistic risk score from 0 (authentic) to 100 (synthetic/manipulated)",
    )
    risk_level: RiskLevel = Field(..., description="Aggregate categorical risk classification")
    authenticity_assessment: str = Field(
        ...,
        description="Human-interpretable verdict (e.g., Likely Authentic, Suspicious, High Confidence Synthetic)",
    )
    summary: str = Field(..., description="Executive forensic summary paragraph")
    confidence_breakdown: Dict[str, float] = Field(
        default_factory=dict,
        description="Raw model metrics per subsystem (kept separate from probability claims)",
    )


class AnalysisReport(BaseModel):
    """Complete explainable forensic analysis report."""

    report_id: str = Field(..., description="Unique UUID for this forensic report")
    file_info: FileInfo = Field(..., description="Details of the inspected artifact")
    created_at: datetime = Field(..., description="Timestamp of submission")
    completed_at: datetime = Field(..., description="Timestamp of analysis completion")
    overall: OverallScore = Field(..., description="Holistic risk evaluation")
    modules: Dict[str, ModuleResult] = Field(
        ...,
        description="Individual results mapped by module identifier",
    )
    cross_modal_correlation: Optional[Dict[str, Any]] = Field(
        None,
        description="Inter-modality correlation insights (e.g., audio-visual sync, metadata-pixel match)",
    )
    disclaimer: str = Field(
        default=(
            "Forensic indications represent statistical anomaly analyses and structural metadata verification. "
            "They should not be used as sole legal evidence without independent expert evaluation."
        ),
        description="Mandatory forensic disclaimer",
    )


class UploadResponse(BaseModel):
    """Response returned upon file upload and analysis dispatch."""

    job_id: str = Field(..., description="Unique tracking ID for the inspection job")
    status: str = Field(..., description="Job processing state (e.g., completed, pending)")
    message: str = Field(..., description="Informational message regarding the operation")
    file_info: FileInfo = Field(..., description="Verified file metadata")
    report: Optional[AnalysisReport] = Field(
        None,
        description="Immediate synchronous analysis report when available",
    )


class HealthResponse(BaseModel):
    """System health check payload."""

    status: str = Field(default="healthy")
    uptime_seconds: float = Field(..., description="Server uptime in seconds")
    app_name: str
    version: str
    environment: str
    active_modules: List[str]
