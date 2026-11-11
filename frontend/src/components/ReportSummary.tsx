import React, { useState } from "react";
import { ForensicReport } from "../types/report";

interface ReportSummaryProps {
  report: ForensicReport;
}

export const ReportSummary: React.FC<ReportSummaryProps> = ({ report }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const {
    overall_risk_score,
    overall_confidence,
    overall_assessment,
    files,
    key_findings,
    job_id,
    created_at,
    is_mock
  } = report;

  const getRiskTheme = (score: number) => {
    if (score >= 70) {
      return {
        bg: "bg-rose-500/10",
        border: "border-rose-500/30",
        text: "text-rose-400",
        badge: "bg-rose-500/20 text-rose-300 border-rose-500/40",
        label: "Elevated Forensic Anomaly Risk"
      };
    }
    if (score >= 40) {
      return {
        bg: "bg-amber-500/10",
        border: "border-amber-500/30",
        text: "text-amber-400",
        badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
        label: "Moderate Forensic Anomaly Risk"
      };
    }
    return {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      text: "text-emerald-400",
      badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      label: "Low Forensic Anomaly Risk"
    };
  };

  const riskTheme = getRiskTheme(overall_risk_score);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const copySummaryToClipboard = async () => {
    const text = [
      `DEEPFAKE X - FORENSIC DOSSIER SUMMARY`,
      `Job Reference: ${job_id}`,
      `Generated: ${new Date(created_at).toLocaleString()}`,
      `Assessment: ${overall_assessment}`,
      `Triage Risk Score: ${overall_risk_score}/100 (${riskTheme.label})`,
      `Evidence Confidence: ${overall_confidence.toUpperCase()}`,
      `Files Analyzed: ${files.map((f) => f.filename).join(", ")}`,
      ``,
      `Key Findings:`,
      ...key_findings.map((f, i) => `  ${i + 1}. ${f}`),
      ``,
      is_mock ? `[Data Origin: Sample Mock Dataset for Hackathon Demonstration]` : `[Data Origin: Live FastAPI Forensics Pipeline]`
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback if clipboard API is blocked
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="bg-[#11131a] border border-[#232736] rounded-xl p-6 shadow-xl space-y-6">
      {/* Prominent Mock Data Banner when applicable */}
      {is_mock && (
        <div className="bg-amber-950/30 border border-amber-600/40 rounded-lg p-3 text-xs font-mono text-amber-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-amber-400 font-bold">⚠️ DEMONSTRATION DATASET:</span>
            <span>
              This report is generated from staged sample assets for offline evaluation and live judging demo.
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300">
            Mock Mode Active
          </span>
        </div>
      )}

      {/* Top Banner: Dossier Metadata */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-zinc-800 gap-3">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">
            Triage Dossier
          </span>
          <span className="text-xs font-mono text-zinc-300 bg-[#0c0e14] border border-zinc-800 px-2 py-0.5 rounded">
            {job_id}
          </span>
          {is_mock ? (
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/80">
              Demo Fixture
            </span>
          ) : (
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/80">
              Live Verified
            </span>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={copySummaryToClipboard}
            className="text-xs font-mono text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 bg-[#0a0c12] px-3 py-1 rounded transition flex items-center space-x-1.5"
            title="Copy formatted summary to clipboard"
          >
            <span>{copied ? "✓" : "📋"}</span>
            <span>{copied ? "Copied to Clipboard!" : "Copy Summary"}</span>
          </button>
          <div className="text-xs font-mono text-zinc-500 hidden sm:block">
            {new Date(created_at).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Primary Triage Metric Card */}
      <div className={`rounded-xl border ${riskTheme.border} ${riskTheme.bg} p-6`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Risk Score */}
          <div className="flex items-center space-x-4 border-b md:border-b-0 md:border-r border-zinc-800/80 pb-4 md:pb-0 md:pr-4">
            <div className={`text-5xl font-mono font-bold ${riskTheme.text}`}>
              {overall_risk_score}
              <span className="text-xl font-normal text-zinc-500">/100</span>
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block font-semibold">
                Triage Risk Indicator
              </span>
              <p className="text-[11px] text-zinc-400 mt-0.5 leading-tight">
                {riskTheme.label}
              </p>
            </div>
          </div>

          {/* Confidence Meter */}
          <div className="flex items-center space-x-4 border-b md:border-b-0 md:border-r border-zinc-800/80 pb-4 md:pb-0 md:pr-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-1 font-semibold">
                Evidence Confidence
              </span>
              <span
                className={`inline-block px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase border ${
                  overall_confidence === "high"
                    ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                    : overall_confidence === "medium"
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : "bg-zinc-700 text-zinc-300 border-zinc-600"
                }`}
              >
                {overall_confidence} Confidence
              </span>
              <p className="text-[11px] text-zinc-500 mt-1 leading-tight">
                Reflects cross-modal corroboration depth
              </p>
            </div>
          </div>

          {/* Assessment Title */}
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-1 font-semibold">
              Triage Assessment
            </span>
            <p className="text-sm font-semibold text-zinc-100">
              {overall_assessment}
            </p>
          </div>
        </div>
      </div>

      {/* Target Files Fingerprint Drawer */}
      <div className="bg-[#0a0c12] border border-zinc-800 rounded-lg p-4 font-mono text-xs">
        <div className="flex justify-between items-center mb-3">
          <h4 className="uppercase text-zinc-400 tracking-wide font-semibold text-[11px]">
            Target Media Fingerprints ({files.length})
          </h4>
          <span className="text-[11px] text-zinc-500">SHA-256 Byte Verification</span>
        </div>
        <div className="space-y-2">
          {files.map((file, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#11131a] border border-zinc-800/80 p-2.5 rounded gap-2"
            >
              <div className="flex items-center space-x-2 truncate">
                <span className="text-blue-400">
                  {file.media_type === "image"
                    ? "🖼️"
                    : file.media_type === "video"
                    ? "🎬"
                    : file.media_type === "audio"
                    ? "🎵"
                    : "📄"}
                </span>
                <span className="font-semibold text-zinc-200">{file.filename}</span>
                <span className="text-zinc-500">({formatBytes(file.file_size_bytes)})</span>
              </div>
              <div className="text-[11px] text-zinc-400 truncate sm:max-w-md">
                SHA-256: <span className="text-zinc-300">{file.sha256}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Findings Bulletins */}
      {key_findings && key_findings.length > 0 && (
        <div className="space-y-2 font-mono text-xs">
          <h4 className="uppercase text-zinc-400 tracking-wide font-semibold text-[11px]">
            Key Evidentiary Findings
          </h4>
          <div className="bg-[#0a0c12] border border-zinc-800 rounded-lg p-4 space-y-2">
            {key_findings.map((finding, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-zinc-300">
                <span className="text-amber-400 select-none mt-0.5">▸</span>
                <span className="leading-relaxed">{finding}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
