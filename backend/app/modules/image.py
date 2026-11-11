"""Image Forensic Analysis Subsystem (Phase 1 Baseline).

Planned capabilities for Phase 2:
- Frequency Domain Analysis (FFT / DCT high-frequency residual anomalies)
- Error Level Analysis (ELA compression quantization steps)
- Noise Inconsistency & PRNU Camera Sensor Fingerprinting
- Facial Landmark Distortion & Blending Boundary Verification
- Deep Diffusion / GAN Detector integration
"""

import time
from pathlib import Path
from PIL import Image

from app.schemas import (
    Evidence,
    Finding,
    Modality,
    ModuleResult,
    ModuleStatus,
    RiskLevel,
)


def analyze_image(file_path: Path, filename: str) -> ModuleResult:
    """Performs Phase 1 baseline structure inspection on image artifacts.

    Returns an explicit 'analysis_not_implemented' status for advanced ML models
    while providing foundational structural attributes.
    """
    start_time = time.perf_counter()
    details = {}
    evidence_list = []
    findings = []

    try:
        with Image.open(file_path) as img:
            details = {
                "dimensions": {"width": img.width, "height": img.height},
                "format": img.format,
                "mode": img.mode,
                "has_transparency": "A" in img.mode,
            }
            evidence_list.append(
                Evidence(
                    id=f"ev_img_dims_{int(time.time())}",
                    label="Structural Resolution",
                    description=f"Image parsed with dimensions {img.width}x{img.height} ({img.mode})",
                    modality=Modality.IMAGE,
                    confidence=1.0,
                    source_layer="raster_header",
                    metadata=details,
                )
            )
    except Exception as exc:
        details["parse_warning"] = str(exc)

    elapsed_ms = (time.perf_counter() - start_time) * 1000.0

    return ModuleResult(
        module="image_forensics",
        modality=Modality.IMAGE,
        status=ModuleStatus.ANALYSIS_NOT_IMPLEMENTED,
        risk_level=RiskLevel.INCONCLUSIVE,
        model_confidence=None,
        findings=findings,
        evidence=evidence_list,
        limitations=[
            "Phase 1 Foundation: Deep neural detector (FSD/Diffusion) is pending integration.",
            "Spatial frequency FFT and Error Level Analysis (ELA) will be enabled in Phase 2.",
        ],
        processing_time_ms=round(elapsed_ms, 2),
        details=details,
    )
