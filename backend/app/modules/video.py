"""Video Forensic Analysis Subsystem (Phase 1 Baseline).

Planned capabilities for Phase 2:
- Frame-level facial landmark tracking and temporal jitter detection
- Optical flow discontinuity and face-swap boundary analysis
- FFmpeg container atom and codec compression parameter extraction
- Audio-video sync discrepancy (AV-LipSync correlation)
"""

import time
from pathlib import Path

from app.schemas import (
    Modality,
    ModuleResult,
    ModuleStatus,
    RiskLevel,
)


def analyze_video(file_path: Path, filename: str) -> ModuleResult:
    """Performs Phase 1 baseline inspection on video artifacts."""
    start_time = time.perf_counter()
    details = {
        "file_size_bytes": file_path.stat().st_size if file_path.exists() else 0,
        "format": file_path.suffix.lstrip(".").upper(),
    }

    elapsed_ms = (time.perf_counter() - start_time) * 1000.0

    return ModuleResult(
        module="video_forensics",
        modality=Modality.VIDEO,
        status=ModuleStatus.ANALYSIS_NOT_IMPLEMENTED,
        risk_level=RiskLevel.INCONCLUSIVE,
        model_confidence=None,
        findings=[],
        evidence=[],
        limitations=[
            "Phase 1 Foundation: OpenCV/FFmpeg frame extraction pending Phase 2.",
            "Temporal face-warping and lip-sync models are scheduled for subsequent milestones.",
        ],
        processing_time_ms=round(elapsed_ms, 2),
        details=details,
    )
