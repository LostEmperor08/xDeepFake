import React from 'react';
import type { RiskLevel } from '../types/forensic';
import { getRiskColor } from '../utils/formatters';
import { ShieldAlert, ShieldCheck, AlertTriangle, HelpCircle } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  size = 'md',
  showIcon = true,
}) => {
  const styles = getRiskColor(level);

  const getIcon = () => {
    switch (level) {
      case 'critical':
      case 'high':
        return <ShieldAlert className="w-3.5 h-3.5" />;
      case 'medium':
        return <AlertTriangle className="w-3.5 h-3.5" />;
      case 'low':
        return <ShieldCheck className="w-3.5 h-3.5" />;
      case 'inconclusive':
      default:
        return <HelpCircle className="w-3.5 h-3.5" />;
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border uppercase tracking-wider ${styles.badge} ${sizeClasses[size]}`}
    >
      {showIcon && getIcon()}
      <span>{level}</span>
    </span>
  );
};
