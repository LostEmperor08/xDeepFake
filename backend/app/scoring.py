"""Forensic Scoring and Evidence Synthesis Engine.

Key Architectural Principle:
Raw model detector confidence scores are isolated from holistic risk scoring.
Uncalibrated neural network output is NOT presented as a calibrated statistical probability.
"""

from typing import Dict
from app.schemas import (
    ModuleResult,
    ModuleStatus,
    OverallScore,
    RiskLevel,
)


def calculate_overall_score(modules: Dict[str, ModuleResult]) -> OverallScore:
    """Aggregates findings and evidence across all forensic modules.

    In Phase 1, when modules return `analysis_not_implemented`, returns an honest
    inconclusive baseline status without fabricating synthetic alerts.
    """
    confidence_breakdown: Dict[str, float] = {}

    implemented_count = 0
    highest_risk = RiskLevel.LOW
    total_findings = 0

    risk_hierarchy = {
        RiskLevel.LOW: 1,
        RiskLevel.MEDIUM: 2,
        RiskLevel.HIGH: 3,
        RiskLevel.CRITICAL: 4,
        RiskLevel.INCONCLUSIVE: 0,
    }

    for mod_name, res in modules.items():
        if res.model_confidence is not None:
            confidence_breakdown[mod_name] = res.model_confidence

        if res.status == ModuleStatus.COMPLETED:
            implemented_count += 1
            total_findings += len(res.findings)
            if risk_hierarchy.get(res.risk_level, 0) > risk_hierarchy.get(highest_risk, 0):
                highest_risk = res.risk_level

    # Phase 1: All active forensic AI modules are foundational stubs
    if implemented_count == 0:
        return OverallScore(
            risk_score=0.0,
            risk_level=RiskLevel.INCONCLUSIVE,
            authenticity_assessment="Baseline Ingestion — Analysis Modules Pending Implementation",
            summary=(
                "Phase 1 Foundation: File successfully ingested, cryptographically verified, and format-validated. "
                "Active forensic inspection models are marked as 'analysis_not_implemented'. No synthetic anomalies "
                "or authenticity claims are asserted."
            ),
            confidence_breakdown=confidence_breakdown,
        )

    # When modules are implemented in Phase 2:
    base_score = 0.0
    if highest_risk == RiskLevel.CRITICAL:
        base_score = 90.0
    elif highest_risk == RiskLevel.HIGH:
        base_score = 75.0
    elif highest_risk == RiskLevel.MEDIUM:
        base_score = 45.0
    elif highest_risk == RiskLevel.LOW:
        base_score = 10.0

    return OverallScore(
        risk_score=min(100.0, base_score + (total_findings * 5.0)),
        risk_level=highest_risk,
        authenticity_assessment=f"Assessed Threat Level: {highest_risk.value.upper()}",
        summary=f"Automated forensic analysis identified {total_findings} distinct indicators across active modules.",
        confidence_breakdown=confidence_breakdown,
    )
