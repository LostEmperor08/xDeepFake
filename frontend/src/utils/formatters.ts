/**
 * Formatting and Style Helper Utilities.
 */

import type { Modality, RiskLevel } from '../types/forensic';

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  } catch {
    return isoString;
  }
}

export function getRiskColor(level: RiskLevel): {
  bg: string;
  text: string;
  border: string;
  badge: string;
  glow: string;
} {
  switch (level) {
    case 'critical':
      return {
        bg: 'bg-rose-950/40',
        text: 'text-rose-400',
        border: 'border-rose-500/50',
        badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        glow: 'shadow-rose-500/20',
      };
    case 'high':
      return {
        bg: 'bg-orange-950/40',
        text: 'text-orange-400',
        border: 'border-orange-500/50',
        badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
        glow: 'shadow-orange-500/20',
      };
    case 'medium':
      return {
        bg: 'bg-amber-950/40',
        text: 'text-amber-400',
        border: 'border-amber-500/50',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        glow: 'shadow-amber-500/20',
      };
    case 'low':
      return {
        bg: 'bg-emerald-950/40',
        text: 'text-emerald-400',
        border: 'border-emerald-500/50',
        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        glow: 'shadow-emerald-500/20',
      };
    case 'inconclusive':
    default:
      return {
        bg: 'bg-slate-900/60',
        text: 'text-slate-400',
        border: 'border-slate-700/60',
        badge: 'bg-slate-800 text-slate-300 border-slate-700',
        glow: 'shadow-slate-500/10',
      };
  }
}

export function getModalityLabel(modality: Modality): string {
  switch (modality) {
    case 'image':
      return 'Image Forensics';
    case 'video':
      return 'Video Forensics';
    case 'audio':
      return 'Audio Forensics';
    case 'document':
      return 'Document (PDF)';
    case 'provenance':
      return 'Provenance & C2PA';
    case 'cross_modal':
      return 'Cross-Modal Correlation';
    default:
      return modality;
  }
}
