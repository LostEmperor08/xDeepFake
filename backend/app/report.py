"""Forensic Report Generation Module."""

from datetime import datetime, timezone
import uuid
from typing import Dict, Optional, Any
from pathlib import Path

from app.schemas import (
    AnalysisReport,
    FileInfo,
    ModuleResult,
)
from app.scoring import calculate_overall_score


def generate_forensic_report(
    file_info: FileInfo,
    module_results: Dict[str, ModuleResult],
    cross_modal: Optional[Dict[str, Any]] = None,
    created_at: Optional[datetime] = None,
) -> AnalysisReport:
    """Generates a complete, structured explainable forensic report."""
    now = datetime.now(timezone.utc)
    submission_time = created_at or now

    overall = calculate_overall_score(module_results)

    report = AnalysisReport(
        report_id=f"rep_{uuid.uuid4().hex[:16]}",
        file_info=file_info,
        created_at=submission_time,
        completed_at=now,
        overall=overall,
        modules=module_results,
        cross_modal_correlation=cross_modal,
        disclaimer=(
            "Forensic indications represent statistical anomaly analyses and structural metadata verification. "
            "They should not be used as sole legal evidence without independent expert evaluation."
        ),
    )
    return report
