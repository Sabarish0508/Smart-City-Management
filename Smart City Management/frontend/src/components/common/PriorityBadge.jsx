import React from 'react';
import { AlertOctagon, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';

const priorityConfig = {
  CRITICAL: {
    label: 'Critical Hazard',
    className: 'priority-critical',
    icon: AlertOctagon,
  },
  HIGH: {
    label: 'High Priority',
    className: 'priority-high',
    icon: AlertTriangle,
  },
  MEDIUM: {
    label: 'Medium Priority',
    className: 'priority-medium',
    icon: ArrowUp,
  },
  LOW: {
    label: 'Low Priority',
    className: 'priority-low',
    icon: ArrowDown,
  },
};

export default function PriorityBadge({ priority }) {
  const config = priorityConfig[priority] || priorityConfig.MEDIUM;
  const IconComponent = config.icon;

  return (
    <span className={`badge ${config.className}`}>
      <IconComponent size={12} />
      {config.label}
    </span>
  );
}
