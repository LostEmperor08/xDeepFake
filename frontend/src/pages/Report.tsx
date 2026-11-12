import React, { useState } from "react";
import { ForensicReport } from "../types/report";
import { ReportSummary } from "../components/ReportSummary";
import { ImageEvidence } from "../components/ImageEvidence";
import { VideoTimeline } from "../components/VideoTimeline";
import { AudioEvidence } from "../components/AudioEvidence";
import { DocumentEvidence } from "../components/DocumentEvidence";
import { CrossModalEvidence } from "../components/CrossModalEvidence";
import { LimitationsCard } from "../components/LimitationsCard";

interface ReportProps {
  report: ForensicReport;
  onNewAnalysis: () => void;
}

export const Report: React.FC<ReportProps> = ({ report, onNewAnalysis }) => {
  const [activeTab, setActiveTab] = useState<"overview" | "image" | "video" | "audio" | "document" | "cross_modal">("overview");

  const downloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `forensic-dossier-${report.job_id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-zinc-800 no-print">
        <button
          type="button"
          onClick={onNewAnalysis}
          className="text-xs font-mono text-zinc-400 hover:text-white flex items-center space-x-1.5 transition bg-[#11131a] border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded"
        >
          <span>←</span>
          <span>Initiate New Investigation</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={downloadJson}
            className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-mono transition border border-zinc-700/60 flex items-center space-x-1.5"
            title="Download full machine-readable JSON dossier"
          >
            <span>💾</span>
            <span>Download JSON Dossier</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-medium transition shadow-sm flex items-center space-x-1.5"
            title="Print or Save PDF report"
          >
            <span>🖨️</span>
            <span>Print / PDF Report</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 space-x-2 overflow-x-auto no-print">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2.5 text-xs font-mono border-b-2 transition whitespace-nowrap ${
            activeTab === "overview"
              ? "border-blue-500 text-blue-400 font-semibold"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Triage Overview
        </button>

        {report.modules.image && (
          <button
            type="button"
            onClick={() => setActiveTab("image")}
            className={`px-4 py-2.5 text-xs font-mono border-b-2 transition whitespace-nowrap ${
              activeTab === "image"
                ? "border-blue-500 text-blue-400 font-semibold"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            🖼️ Image Forensics
          </button>
        )}

        {report.modules.video && (
          <button
            type="button"
            onClick={() => setActiveTab("video")}
            className={`px-4 py-2.5 text-xs font-mono border-b-2 transition whitespace-nowrap ${
              activeTab === "video"
                ? "border-blue-500 text-blue-400 font-semibold"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            🎬 Video Timeline
          </button>
        )}

        {report.modules.audio && (
          <button
            type="button"
            onClick={() => setActiveTab("audio")}
            className={`px-4 py-2.5 text-xs font-mono border-b-2 transition whitespace-nowrap ${
              activeTab === "audio"
                ? "border-blue-500 text-blue-400 font-semibold"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            🎵 Voice & Audio
          </button>
        )}

        {report.modules.document && (
          <button
            type="button"
            onClick={() => setActiveTab("document")}
            className={`px-4 py-2.5 text-xs font-mono border-b-2 transition whitespace-nowrap ${
              activeTab === "document"
                ? "border-blue-500 text-blue-400 font-semibold"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            📄 PDF Authenticity
          </button>
        )}

        {report.modules.cross_modal && (
          <button
            type="button"
            onClick={() => setActiveTab("cross_modal")}
            className={`px-4 py-2.5 text-xs font-mono border-b-2 transition whitespace-nowrap ${
              activeTab === "cross_modal"
                ? "border-blue-500 text-blue-400 font-semibold"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            🔗 Cross-Modal Verification
          </button>
        )}
      </div>

      {/* Tab Panels */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <ReportSummary report={report} />

          {/* Glances into Active Modalities */}
          <div className="space-y-6">
            {report.modules.image && <ImageEvidence moduleResult={report.modules.image} />}
            {report.modules.video && <VideoTimeline moduleResult={report.modules.video} />}
            {report.modules.audio && <AudioEvidence moduleResult={report.modules.audio} />}
            {report.modules.document && <DocumentEvidence moduleResult={report.modules.document} />}
            {report.modules.cross_modal && <CrossModalEvidence moduleResult={report.modules.cross_modal} />}
          </div>

          <LimitationsCard limitations={report.limitations} />
        </div>
      )}

      {activeTab === "image" && (
        <div className="space-y-6">
          <ImageEvidence moduleResult={report.modules.image} />
          <LimitationsCard limitations={report.limitations} />
        </div>
      )}

      {activeTab === "video" && (
        <div className="space-y-6">
          <VideoTimeline moduleResult={report.modules.video} />
          <LimitationsCard limitations={report.limitations} />
        </div>
      )}

      {activeTab === "audio" && (
        <div className="space-y-6">
          <AudioEvidence moduleResult={report.modules.audio} />
          <LimitationsCard limitations={report.limitations} />
        </div>
      )}

      {activeTab === "document" && (
        <div className="space-y-6">
          <DocumentEvidence moduleResult={report.modules.document} />
          <LimitationsCard limitations={report.limitations} />
        </div>
      )}

      {activeTab === "cross_modal" && (
        <div className="space-y-6">
          <CrossModalEvidence moduleResult={report.modules.cross_modal} />
          <LimitationsCard limitations={report.limitations} />
        </div>
      )}
    </div>
  );
};
