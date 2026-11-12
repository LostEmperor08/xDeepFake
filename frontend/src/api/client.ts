import { ForensicReport, JobStatusResponse } from "../types/report";
import { MOCK_FORENSIC_REPORT } from "./mockReport";

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:8000";

export class ApiClient {
  private static useMockMode: boolean = true; // Default to true so offline demo is immediate, but user can toggle

  public static setMockMode(enabled: boolean) {
    this.useMockMode = enabled;
  }

  public static isMockMode(): boolean {
    return this.useMockMode;
  }

  public static getBaseUrl(): string {
    return API_BASE_URL;
  }

  /**
   * Health check to ping backend FastAPI service
   */
  public static async checkHealth(): Promise<{ status: string; ok: boolean; message?: string }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: "GET",
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        return { status: "unhealthy", ok: false, message: `HTTP ${response.status}` };
      }
      const data = await response.json().catch(() => ({}));
      return { status: data.status || "healthy", ok: true };
    } catch (err: any) {
      return {
        status: "unreachable",
        ok: false,
        message: err.name === "AbortError" ? "Connection timed out" : "Backend unreachable"
      };
    }
  }

  /**
   * Upload file or case bundle for analysis
   * Aligned with POST /api/v1/analyze and GET /api/v1/jobs/{job_id}
   */
  public static async analyzeFiles(
    files: File[],
    bundleLabel?: string,
    onProgress?: (stage: string) => void,
    onJobCreated?: (jobId: string) => void
  ): Promise<ForensicReport> {
    if (this.useMockMode) {
      // High-fidelity staged demonstration simulation
      onProgress?.("Validating File Headers & Hashes...");
      await new Promise((r) => setTimeout(r, 600));

      const mockJobId = `demo-${Date.now().toString(36)}`;
      onJobCreated?.(mockJobId);

      onProgress?.("Extracting Metadata & EXIF / Stream Descriptors...");
      await new Promise((r) => setTimeout(r, 700));

      onProgress?.("Running Forensic Algorithms (ELA / Mel-Spectrogram / PyMuPDF)...");
      await new Promise((r) => setTimeout(r, 800));

      onProgress?.("Executing Pretrained AI Classifiers...");
      await new Promise((r) => setTimeout(r, 800));

      onProgress?.("Synthesizing Multimodal Evidence & Risk Matrix...");
      await new Promise((r) => setTimeout(r, 500));

      // Clone mock with active files information
      const report: ForensicReport = {
        ...MOCK_FORENSIC_REPORT,
        is_mock: true,
        job_id: mockJobId,
        created_at: new Date().toISOString(),
        files: files.map((f) => ({
          filename: f.name,
          media_type: f.type.startsWith("image")
            ? "image"
            : f.type.startsWith("video")
            ? "video"
            : f.type.startsWith("audio")
            ? "audio"
            : "document",
          file_size_bytes: f.size,
          sha256: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
        }))
      };
      return report;
    }

    // Live multipart upload to FastAPI backend
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    if (bundleLabel) {
      formData.append("bundle_label", bundleLabel);
    }

    onProgress?.("Uploading media payload to FastAPI backend...");
    let uploadRes: Response;
    try {
      uploadRes = await fetch(`${API_BASE_URL}/api/v1/analyze`, {
        method: "POST",
        body: formData
      });
    } catch (networkErr: any) {
      throw new Error(
        `Backend Connection Failed: Unable to connect to FastAPI at ${API_BASE_URL}. Ensure the backend is running ('uvicorn app.main:app --reload') or enable Offline Demo Mode.`
      );
    }

    if (!uploadRes.ok) {
      if (uploadRes.status === 413) {
        throw new Error("Payload Too Large (HTTP 413): File size exceeds the backend upload limit.");
      }
      if (uploadRes.status === 415) {
        throw new Error("Unsupported Media Type (HTTP 415): Format rejected by backend parser.");
      }
      if (uploadRes.status === 422) {
        throw new Error("Unprocessable Media (HTTP 422): Corrupt or invalid file stream.");
      }
      const err = await uploadRes.json().catch(() => ({}));
      throw new Error(err.detail || `Upload failed with HTTP status ${uploadRes.status}`);
    }

    let jobJson: any;
    try {
      jobJson = await uploadRes.json();
    } catch {
      throw new Error("Invalid API Response: Backend did not return valid JSON for job creation.");
    }

    if (!jobJson || !jobJson.job_id) {
      throw new Error("Invalid API Response: Backend response missing required 'job_id' field.");
    }

    const jobId = jobJson.job_id;
    onJobCreated?.(jobId);

    // Poll job status until completed or failed
    return this.pollJob(jobId, onProgress);
  }

  private static async pollJob(
    jobId: string,
    onProgress?: (stage: string) => void
  ): Promise<ForensicReport> {
    const maxRetries = 60; // 60 attempts * 1.2s ≈ 72s max timeout
    let consecutiveNetworkErrors = 0;

    for (let i = 0; i < maxRetries; i++) {
      await new Promise((r) => setTimeout(r, 1200));

      let res: Response;
      try {
        res = await fetch(`${API_BASE_URL}/api/v1/jobs/${jobId}`);
        consecutiveNetworkErrors = 0;
      } catch (pollErr) {
        consecutiveNetworkErrors++;
        if (consecutiveNetworkErrors >= 3) {
          throw new Error(`Lost connection to backend while polling status of job ${jobId}.`);
        }
        continue;
      }

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error(`Job '${jobId}' was not found on the backend.`);
        }
        continue;
      }

      let jobData: JobStatusResponse;
      try {
        jobData = await res.json();
      } catch {
        throw new Error("Invalid API Response: Corrupt JSON while polling job status.");
      }

      if (jobData.stage) {
        onProgress?.(jobData.stage);
      }

      if (jobData.status === "completed" || jobData.status === "partial") {
        const reportRes = await fetch(`${API_BASE_URL}/api/v1/reports/${jobId}`);
        if (!reportRes.ok) {
          throw new Error(`Failed to retrieve finalized report (HTTP ${reportRes.status})`);
        }
        const reportJson = await reportRes.json().catch(() => null);
        if (!reportJson) {
          throw new Error("Invalid API Response: Final report JSON could not be parsed.");
        }
        return {
          ...reportJson,
          is_mock: false
        };
      }

      if (jobData.status === "failed") {
        throw new Error(jobData.error || "Analysis pipeline failed on backend.");
      }
    }

    throw new Error(`Analysis job '${jobId}' timed out on backend (exceeded 70s limit).`);
  }
}
