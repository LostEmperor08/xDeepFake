import React, { useState, useEffect, useCallback } from "react";
import { ApiClient } from "../api/client";

interface NavbarProps {
  onReset: () => void;
  mockMode: boolean;
  onToggleMockMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onReset, mockMode, onToggleMockMode }) => {
  const [backendStatus, setBackendStatus] = useState<"checking" | "online" | "offline">("checking");
  const [backendErrorDetail, setBackendErrorDetail] = useState<string>("");
  const [showLimitsModal, setShowLimitsModal] = useState<boolean>(false);

  const checkConnectivity = useCallback(async () => {
    setBackendStatus("checking");
    const res = await ApiClient.checkHealth();
    if (res.ok) {
      setBackendStatus("online");
      setBackendErrorDetail("");
    } else {
      setBackendStatus("offline");
      setBackendErrorDetail(res.message || "Cannot reach server");
    }
  }, []);

  useEffect(() => {
    checkConnectivity();
    const interval = setInterval(checkConnectivity, 15000); // Periodic check every 15s
    return () => clearInterval(interval);
  }, [checkConnectivity]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showLimitsModal) {
        setShowLimitsModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showLimitsModal]);

  return (
    <>
      <header className="border-b border-[#232736] bg-[#0c0e14]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Identity */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={onReset}
            title="Return to Dashboard / New Case"
          >
            <div className="w-8 h-8 rounded bg-blue-600/20 border border-blue-500/40 flex items-center justify-center font-mono font-bold text-blue-400 text-sm group-hover:border-blue-400 transition">
              DFX
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white tracking-wider text-sm group-hover:text-blue-300 transition">
                  DEEPFAKE X
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                  PS02 Triage
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                Multimodal Synthetic Media Forensics
              </p>
            </div>
          </div>

          {/* Controls & Status Bar */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Supported Demo Limits Button */}
            <button
              type="button"
              onClick={() => setShowLimitsModal(true)}
              className="text-xs text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 bg-[#11131a] px-3 py-1.5 rounded transition font-mono flex items-center space-x-1.5"
            >
              <span>📋</span>
              <span className="hidden sm:inline">Limits & Scope</span>
              <span className="sm:hidden">Limits</span>
            </button>

            {/* Mock / Live Switcher */}
            <div className="flex items-center space-x-2 border border-[#232736] bg-[#11131a] px-3 py-1.5 rounded text-xs font-mono">
              <span className="text-zinc-400 text-[11px]">Mock Mode:</span>
              <button
                type="button"
                role="switch"
                aria-checked={mockMode}
                onClick={() => {
                  const next = !mockMode;
                  onToggleMockMode(next);
                  ApiClient.setMockMode(next);
                }}
                className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                  mockMode ? "bg-amber-500" : "bg-zinc-700"
                }`}
                title={mockMode ? "Click to switch to Live Backend" : "Click to switch to Offline Demo Mode"}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition duration-200 ease-in-out mt-0.5 ${
                    mockMode ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            {/* Backend Connectivity Status Pill */}
            <div
              className="flex items-center space-x-2 border border-[#232736] bg-[#11131a] px-3 py-1.5 rounded font-mono text-xs cursor-pointer hover:border-zinc-700 transition"
              onClick={checkConnectivity}
              title={
                backendStatus === "offline" && backendErrorDetail
                  ? `API Offline: ${backendErrorDetail} (Click to refresh)`
                  : `API: ${ApiClient.getBaseUrl()} (Click to refresh)`
              }
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  mockMode
                    ? "bg-amber-400"
                    : backendStatus === "online"
                    ? "bg-emerald-400 animate-pulse"
                    : backendStatus === "checking"
                    ? "bg-blue-400 animate-ping"
                    : "bg-rose-500"
                }`}
              />
              <span className="text-zinc-300 text-[11px]">
                {mockMode
                  ? "Offline Demo Mode"
                  : backendStatus === "online"
                  ? "FastAPI Online"
                  : backendStatus === "checking"
                  ? "Checking API..."
                  : "API Offline"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Demo Limits Modal */}
      {showLimitsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => setShowLimitsModal(false)}
        >
          <div
            className="bg-[#11131a] border border-[#232736] rounded-xl max-w-lg w-full p-6 text-sm shadow-2xl relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal content
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center space-x-2">
                <span className="text-blue-400 font-mono text-base">🛡️</span>
                <h3 className="font-semibold text-white tracking-wide">
                  PS02 Scope & Hackathon Bounds
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLimitsModal(false)}
                className="text-zinc-400 hover:text-white font-mono text-lg p-1"
                aria-label="Close dialog"
              >
                &times;
              </button>
            </div>

            <div className="mt-4 space-y-3 font-mono text-xs text-zinc-300">
              <div className="flex justify-between items-center border-b border-zinc-800/60 pb-2">
                <span className="text-zinc-400 flex items-center space-x-1.5">
                  <span>🖼️</span> <span>Image Media:</span>
                </span>
                <span className="text-white font-semibold">JPG, PNG, WEBP (Max 15 MB)</span>
              </div>
              <div className="flex justify-between items-center border-b border-zinc-800/60 pb-2">
                <span className="text-zinc-400 flex items-center space-x-1.5">
                  <span>🎵</span> <span>Audio Recordings:</span>
                </span>
                <span className="text-white font-semibold">WAV, MP3 (Max 60s, mono 16kHz)</span>
              </div>
              <div className="flex justify-between items-center border-b border-zinc-800/60 pb-2">
                <span className="text-zinc-400 flex items-center space-x-1.5">
                  <span>🎬</span> <span>Video Media:</span>
                </span>
                <span className="text-white font-semibold">MP4, MOV (Max 15s, up to 720p)</span>
              </div>
              <div className="flex justify-between items-center border-b border-zinc-800/60 pb-2">
                <span className="text-zinc-400 flex items-center space-x-1.5">
                  <span>📄</span> <span>Documents (PDF):</span>
                </span>
                <span className="text-white font-semibold">Max 20 MB / 10 pages</span>
              </div>
              <div className="flex justify-between items-center pb-1">
                <span className="text-zinc-400 flex items-center space-x-1.5">
                  <span>📦</span> <span>Case Bundle:</span>
                </span>
                <span className="text-white font-semibold">Up to 5 related files (Cross-Modal)</span>
              </div>
            </div>

            <div className="mt-5 p-3 rounded bg-[#0a0c12] border border-zinc-800/80 text-[11px] text-zinc-400 leading-relaxed font-mono">
              <span className="text-amber-400 font-bold block mb-1">Forensic Triage Protocol:</span>
              Absence of EXIF metadata or C2PA provenance manifest is treated as neutral, not definitive proof of tampering. All uploads are processed ephemerally in RAM and wiped after analysis.
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowLimitsModal(false)}
                className="px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono transition"
              >
                Understood & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
