"""Document Forensic Analysis Subsystem (Phase 1 Baseline).

Planned capabilities for Phase 2:
- PDF Object Stream & Incremental Update Analysis
- Font Embedding Inconsistency & Kerning Discontinuities
- Generative Text / Synthetic Layout Detection
- Digital Signature & Revision History Integrity
"""

import time
from pathlib import Path

from app.schemas import (
    Modality,
    ModuleResult,
    ModuleStatus,
    RiskLevel,
)


def analyze_document(file_path: Path, filename: str) -> ModuleResult:
    """Performs Phase 1 baseline inspection on document artifacts (PDF)."""
    start_time = time.perf_counter()
    details = {
        "file_size_bytes": file_path.stat().st_size if file_path.exists() else 0,
        "format": "PDF",
    }

    elapsed_ms = (time.perf_counter() - start_time) * 1000.0

    return ModuleResult(
        module="document_forensics",
        modality=Modality.DOCUMENT,
        status=ModuleStatus.ANALYSIS_NOT_IMPLEMENTED,
        risk_level=RiskLevel.INCONCLUSIVE,
        model_confidence=None,
        findings=[],
        evidence=[],
        limitations=[
            "Phase 1 Foundation: PyMuPDF font object and stream parsing pending Phase 2.",
            "Generative PDF layout and incremental revision analysis will be enabled in Phase 2.",
        ],
        processing_time_ms=round(elapsed_ms, 2),
        details=details,
    )
