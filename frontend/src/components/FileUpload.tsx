import React, { useState, useRef, useCallback } from "react";

interface FileUploadProps {
  onAnalyze: (files: File[], isBundle: boolean, bundleLabel?: string) => void;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onAnalyze, disabled }) => {
  const [isBundle, setIsBundle] = useState<boolean>(false);
  const [bundleLabel, setBundleLabel] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_IMAGE_BYTES = 15 * 1024 * 1024; // 15MB
  const MAX_PDF_BYTES = 20 * 1024 * 1024;   // 20MB
  const MAX_MEDIA_BYTES = 50 * 1024 * 1024; // 50MB for video/audio container
  const MAX_BUNDLE_COUNT = 5;

  const SUPPORTED_EXTENSIONS = [
    "jpg", "jpeg", "png", "webp",
    "mp4", "mov",
    "wav", "mp3",
    "pdf"
  ];

  const getFileExtension = (name: string): string => {
    return name.slice((name.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
  };

  const getMediaCategory = (file: File): "image" | "video" | "audio" | "document" | "unknown" => {
    const ext = getFileExtension(file.name);
    if (["jpg", "jpeg", "png", "webp"].includes(ext) || file.type.startsWith("image/")) return "image";
    if (["mp4", "mov"].includes(ext) || file.type.startsWith("video/")) return "video";
    if (["wav", "mp3"].includes(ext) || file.type.startsWith("audio/")) return "audio";
    if (ext === "pdf" || file.type === "application/pdf") return "document";
    return "unknown";
  };

  const validateFiles = useCallback((incomingFiles: File[]): { valid: File[]; errors: string[] } => {
    const errors: string[] = [];
    const valid: File[] = [];

    for (const file of incomingFiles) {
      const ext = getFileExtension(file.name);
      const category = getMediaCategory(file);

      // Format validation
      if (!SUPPORTED_EXTENSIONS.includes(ext) && category === "unknown") {
        errors.push(`'${file.name}' has unsupported format .${ext || "unknown"}. Supported: JPG, PNG, WEBP, MP4, WAV, MP3, PDF.`);
        continue;
      }

      // Size validation
      if (category === "image" && file.size > MAX_IMAGE_BYTES) {
        errors.push(`Image '${file.name}' exceeds the 15 MB hackathon limit (${(file.size / (1024 * 1024)).toFixed(1)} MB).`);
        continue;
      }
      if (category === "document" && file.size > MAX_PDF_BYTES) {
        errors.push(`PDF '${file.name}' exceeds the 20 MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB).`);
        continue;
      }
      if ((category === "video" || category === "audio") && file.size > MAX_MEDIA_BYTES) {
        errors.push(`Media file '${file.name}' exceeds the maximum allowed upload size.`);
        continue;
      }

      valid.push(file);
    }

    return { valid, errors };
  }, []);

  const handleAddFiles = (incoming: FileList | File[]) => {
    setValidationErrors([]);
    const incomingArr = Array.from(incoming);

    if (incomingArr.length === 0) return;

    if (!isBundle) {
      // Single file mode: take only the first valid file
      const { valid, errors } = validateFiles([incomingArr[0]]);
      if (errors.length > 0) {
        setValidationErrors(errors);
      }
      if (valid.length > 0) {
        setSelectedFiles(valid);
      }
      return;
    }

    // Bundle mode: merge while avoiding exact duplicates
    const { valid, errors } = validateFiles(incomingArr);
    const existingNames = new Set(selectedFiles.map((f) => f.name));
    const newUnique = valid.filter((f) => !existingNames.has(f.name));

    const combined = [...selectedFiles, ...newUnique];
    if (combined.length > MAX_BUNDLE_COUNT) {
      errors.push(`Case bundle limit exceeded. Maximum of ${MAX_BUNDLE_COUNT} files allowed. Kept first ${MAX_BUNDLE_COUNT}.`);
      setSelectedFiles(combined.slice(0, MAX_BUNDLE_COUNT));
    } else {
      setSelectedFiles(combined);
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleAddFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (idx: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
    setValidationErrors([]);
  };

  const clearAllFiles = () => {
    setSelectedFiles([]);
    setValidationErrors([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      setValidationErrors(["Please select or drag-and-drop at least one media file to analyze."]);
      return;
    }
    onAnalyze(selectedFiles, isBundle, bundleLabel.trim() || undefined);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <div className="bg-[#11131a] border border-[#232736] rounded-xl p-6 shadow-xl max-w-3xl mx-auto">
      {/* Mode Selection Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-zinc-800 pb-4 mb-6 gap-3">
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => {
              setIsBundle(false);
              setSelectedFiles((prev) => prev.slice(0, 1));
              setValidationErrors([]);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
              !isBundle
                ? "bg-blue-600 text-white font-medium shadow-md shadow-blue-600/30"
                : "bg-zinc-800/80 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Single Media Investigation
          </button>
          <button
            type="button"
            onClick={() => {
              setIsBundle(true);
              setValidationErrors([]);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
              isBundle
                ? "bg-blue-600 text-white font-medium shadow-md shadow-blue-600/30"
                : "bg-zinc-800/80 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Related Case Bundle (Cross-Modal)
          </button>
        </div>
        <span className="text-[11px] font-mono text-zinc-400 bg-[#0a0c12] px-2.5 py-1 rounded border border-zinc-800">
          {isBundle ? `Bundle Mode (Up to ${MAX_BUNDLE_COUNT} files)` : "Single Target Mode"}
        </span>
      </div>

      {/* Case Label Input for Bundle Mode */}
      {isBundle && (
        <div className="mb-5 bg-[#0a0c12] border border-zinc-800/80 p-3.5 rounded-lg">
          <label className="block text-xs font-mono text-zinc-300 mb-1 font-semibold">
            Case Identifier / Label (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Case-2026-Incident-B or Suspect-Voice-Video-Crosscheck"
            value={bundleLabel}
            onChange={(e) => setBundleLabel(e.target.value)}
            disabled={disabled}
            className="w-full bg-[#11131a] border border-zinc-700/80 rounded px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 font-mono transition"
          />
        </div>
      )}

      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
          isDragging
            ? "border-blue-500 bg-blue-500/10"
            : "border-zinc-700/70 hover:border-zinc-500 bg-[#0c0e14]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={isBundle}
          accept=".jpg,.jpeg,.png,.webp,.mp4,.mov,.wav,.mp3,.pdf,image/jpeg,image/png,image/webp,video/mp4,video/quicktime,audio/wav,audio/mpeg,application/pdf"
          onChange={(e) => {
            if (e.target.files) handleAddFiles(e.target.files);
          }}
          className="hidden"
          disabled={disabled}
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-zinc-800/90 border border-zinc-700 flex items-center justify-center text-xl">
            📁
          </div>

          <div>
            <p className="text-sm font-medium text-zinc-200">
              Drag & drop media files here, or
            </p>
            <div className="mt-2.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-xs font-mono text-zinc-100 hover:text-white transition shadow-sm"
              >
                Browse Files
              </button>
            </div>
            <p className="text-xs text-zinc-500 mt-2 font-mono">
              Accepted: JPG, PNG, WEBP, MP4, MOV, WAV, MP3, PDF
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center pt-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60">
              🖼️ Img ≤ 15MB
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60">
              🎵 Aud ≤ 60s
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60">
              🎬 Vid ≤ 15s/720p
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60">
              📄 PDF ≤ 20MB / 10p
            </span>
          </div>
        </div>
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="mt-6 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-zinc-400 mb-2">
            <span className="font-semibold text-zinc-300">
              Staged Payload ({selectedFiles.length}{isBundle ? `/${MAX_BUNDLE_COUNT}` : ""})
            </span>
            <button
              type="button"
              onClick={clearAllFiles}
              className="text-zinc-500 hover:text-rose-400 text-xs transition"
            >
              Clear All Files
            </button>
          </div>

          <div className="space-y-1.5">
            {selectedFiles.map((f, idx) => {
              const cat = getMediaCategory(f);
              const ext = getFileExtension(f.name);
              return (
                <div
                  key={`${f.name}-${idx}`}
                  className="flex items-center justify-between bg-[#0a0c12] border border-zinc-800 px-3.5 py-2.5 rounded-lg text-xs"
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className="text-base">
                      {cat === "image" ? "🖼️" : cat === "video" ? "🎬" : cat === "audio" ? "🎵" : "📄"}
                    </span>
                    <span className="font-mono text-zinc-200 truncate">{f.name}</span>
                    <span className="text-[11px] font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                      {ext}
                    </span>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      ({formatBytes(f.size)})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    title="Remove file"
                    className="text-zinc-500 hover:text-rose-400 px-2 py-1 font-mono text-sm transition"
                  >
                    &times;
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Validation Error Notices */}
      {validationErrors.length > 0 && (
        <div className="mt-5 p-3.5 rounded-lg bg-rose-950/40 border border-rose-800/70 text-rose-300 text-xs font-mono space-y-1">
          <div className="flex items-center space-x-1.5 font-bold">
            <span>⚠️</span>
            <span>Upload Validation Notice:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-rose-200/90 pl-1">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Submission Footer */}
      <div className="mt-6 pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-[11px] text-zinc-500 font-mono flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
          <span>Ephemeral in-memory forensics. Original bytes verified for cryptographic hashing.</span>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled || selectedFiles.length === 0}
          className={`w-full sm:w-auto px-6 py-2.5 rounded-lg text-xs font-mono font-medium tracking-wide transition flex items-center justify-center space-x-2 ${
            disabled || selectedFiles.length === 0
              ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 active:scale-95"
          }`}
        >
          <span>Initiate Forensic Analysis</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};
