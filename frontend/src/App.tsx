import React, { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Dashboard } from "./pages/Dashboard";
import { Report } from "./pages/Report";
import { ForensicReport } from "./types/report";
import { ApiClient } from "./api/client";
import { MOCK_FORENSIC_REPORT } from "./api/mockReport";

export const App: React.FC = () => {
  const [report, setReport] = useState<ForensicReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentStage, setCurrentStage] = useState<string>("");
  const [jobId, setJobId] = useState<string | undefined>(undefined);
  const [mockMode, setMockMode] = useState<boolean>(true); // Default true for immediate offline demo capability
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Staged request cache for clean retry functionality
  const [lastPayload, setLastPayload] = useState<{
    files: File[];
    isBundle: boolean;
    bundleLabel?: string;
  } | null>(null);

  const handleAnalyze = async (files: File[], isBundle: boolean, bundleLabel?: string) => {
    setIsLoading(true);
    setCurrentStage("Initializing Forensic Triage Pipeline...");
    setJobId(undefined);
    setErrorMessage(null);
    setLastPayload({ files, isBundle, bundleLabel });

    try {
      const generatedReport = await ApiClient.analyzeFiles(
        files,
        bundleLabel,
        (stage) => setCurrentStage(stage),
        (id) => setJobId(id)
      );
      setReport(generatedReport);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred during forensic evaluation.");
    } finally {
      setIsLoading(false);
      setCurrentStage("");
    }
  };

  const handleRetry = () => {
    if (lastPayload && lastPayload.files.length > 0) {
      handleAnalyze(lastPayload.files, lastPayload.isBundle, lastPayload.bundleLabel);
    } else {
      setErrorMessage(null);
    }
  };

  const handleEnableMockAndRetry = () => {
    setMockMode(true);
    ApiClient.setMockMode(true);
    if (lastPayload && lastPayload.files.length > 0) {
      handleAnalyze(lastPayload.files, lastPayload.isBundle, lastPayload.bundleLabel);
    } else {
      handleLoadSampleDemo();
    }
  };

  const handleCancelJob = () => {
    setIsLoading(false);
    setCurrentStage("");
    setJobId(undefined);
    setErrorMessage("Job cancelled by investigator.");
  };

  const handleLoadSampleDemo = () => {
    setIsLoading(true);
    setErrorMessage(null);
    setCurrentStage("Loading Staged Cross-Modal Multi-Signal Case...");
    setTimeout(() => {
      setReport(MOCK_FORENSIC_REPORT);
      setIsLoading(false);
      setCurrentStage("");
    }, 500);
  };

  const handleReset = () => {
    setReport(null);
    setIsLoading(false);
    setCurrentStage("");
    setJobId(undefined);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col font-sans">
      <Navbar
        onReset={handleReset}
        mockMode={mockMode}
        onToggleMockMode={(val) => {
          setMockMode(val);
          ApiClient.setMockMode(val);
        }}
      />

      <main className="flex-1">
        {report ? (
          <Report report={report} onNewAnalysis={handleReset} />
        ) : (
          <Dashboard
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            currentStage={currentStage}
            jobId={jobId}
            onCancelJob={handleCancelJob}
            onLoadSampleDemo={handleLoadSampleDemo}
            errorMessage={errorMessage}
            onRetry={handleRetry}
            onDismissError={() => setErrorMessage(null)}
            onEnableMockAndRetry={handleEnableMockAndRetry}
          />
        )}
      </main>

      {/* Minimalist Forensic Footer */}
      <footer className="border-t border-[#232736] py-4 bg-[#0a0c12] text-center text-xs font-mono text-zinc-500 no-print">
        DEEPFAKE X • PS02 Multimodal Synthetic Media Forensics & Authenticity Verification • Team 3 ISE
      </footer>
    </div>
  );
};
