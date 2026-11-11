/**
 * Central API Client for DEEPFAKE X Frontend.
 * Reads backend endpoint strictly from VITE_API_URL.
 */

import axios from 'axios';
import type {
  AnalysisReport,
  HealthResponse,
  ModuleSummary,
  UploadResponse,
} from '../types/forensic';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60s for forensic uploads
  headers: {
    'Accept': 'application/json',
  },
});

export const api = {
  /**
   * System health check
   */
  async getHealth(): Promise<HealthResponse> {
    const response = await apiClient.get<HealthResponse>('/health');
    return response.data;
  },

  /**
   * Service root info
   */
  async getRoot(): Promise<Record<string, string>> {
    const response = await apiClient.get<Record<string, string>>('/');
    return response.data;
  },

  /**
   * List registered modules and phase status
   */
  async getModules(): Promise<ModuleSummary[]> {
    const response = await apiClient.get<{ modules: ModuleSummary[] }>('/api/v1/modules');
    return response.data.modules;
  },

  /**
   * Upload media file for multimodal forensic analysis
   */
  async analyzeMedia(
    file: File,
    onUploadProgress?: (progressEvent: { loaded: number; total?: number }) => void
  ): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<UploadResponse>('/api/v1/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });

    return response.data;
  },

  /**
   * Query status or completed report by Job ID
   */
  async getJob(jobId: string): Promise<{ job_id: string; status: string; report?: AnalysisReport }> {
    const response = await apiClient.get(`/api/v1/jobs/${jobId}`);
    return response.data;
  },
};
