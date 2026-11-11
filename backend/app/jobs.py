"""Asynchronous Job and Task State Registry."""

from datetime import datetime, timezone
from typing import Dict, Optional
import uuid
from pydantic import BaseModel

from app.schemas import AnalysisReport, FileInfo


class JobRecord(BaseModel):
    """Tracking record for a media analysis job."""

    job_id: str
    status: str  # queued, processing, completed, failed
    created_at: datetime
    updated_at: datetime
    file_info: FileInfo
    report: Optional[AnalysisReport] = None
    error: Optional[str] = None


class JobRegistry:
    """Thread-safe in-memory registry for analysis jobs."""

    def __init__(self) -> None:
        self._jobs: Dict[str, JobRecord] = {}

    def create_job(self, file_info: FileInfo) -> JobRecord:
        job_id = f"job_{uuid.uuid4().hex[:12]}"
        now = datetime.now(timezone.utc)
        record = JobRecord(
            job_id=job_id,
            status="processing",
            created_at=now,
            updated_at=now,
            file_info=file_info,
        )
        self._jobs[job_id] = record
        return record

    def get_job(self, job_id: str) -> Optional[JobRecord]:
        return self._jobs.get(job_id)

    def complete_job(self, job_id: str, report: AnalysisReport) -> None:
        if job_id in self._jobs:
            self._jobs[job_id].status = "completed"
            self._jobs[job_id].report = report
            self._jobs[job_id].updated_at = datetime.now(timezone.utc)

    def fail_job(self, job_id: str, error_message: str) -> None:
        if job_id in self._jobs:
            self._jobs[job_id].status = "failed"
            self._jobs[job_id].error = error_message
            self._jobs[job_id].updated_at = datetime.now(timezone.utc)


# Global singleton instance
job_registry = JobRegistry()
