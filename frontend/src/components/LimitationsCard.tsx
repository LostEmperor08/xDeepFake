import React from "react";

interface LimitationsCardProps {
  limitations: string[];
}

export const LimitationsCard: React.FC<LimitationsCardProps> = ({ limitations }) => {
  return (
    <div className="bg-[#11131a] border border-[#232736] rounded-xl p-6 shadow-xl space-y-4 font-mono text-xs">
      <div className="flex items-center space-x-2 border-b border-zinc-800 pb-3">
        <span className="text-zinc-400">⚖️</span>
        <h4 className="font-semibold text-zinc-300 tracking-wide uppercase text-[11px]">
          Forensic Limitations & Responsible AI Disclosure
        </h4>
      </div>

      <div className="space-y-2 text-zinc-400">
        <p className="text-zinc-300 font-medium">
          DEEPFAKE X is an investigative triage assistant designed to aid human review. It does not provide legal certificates of authenticity or incontrovertible proof of fraud.
        </p>
        <ul className="space-y-1.5 list-disc list-inside text-zinc-400 pt-1">
          {limitations.map((lim, idx) => (
            <li key={idx} className="leading-relaxed">
              {lim}
            </li>
          ))}
          <li className="leading-relaxed">
            Absence of a C2PA Content Credential manifest is neutral; social networks routinely strip metadata.
          </li>
          <li className="leading-relaxed">
            High triage risk indicates an elevated likelihood of artificial or edited patterns, requiring human investigator verification.
          </li>
        </ul>
      </div>

      <div className="pt-2 border-t border-zinc-800/60 text-[11px] text-zinc-500">
        Adheres to PS02 Responsible Disclosure Standards • Ephemeral RAM Processing Pipeline
      </div>
    </div>
  );
};
