import React from 'react';
import { 
  Send, 
  Clock, 
  UserCheck, 
  Activity, 
  CheckCircle2, 
  Archive, 
  PauseCircle, 
  RotateCcw 
} from 'lucide-react';

const statusConfig = {
  SUBMITTED: {
    label: 'Submitted',
    className: 'badge-submitted',
    icon: Send,
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    className: 'badge-review',
    icon: Clock,
  },
  ASSIGNED: {
    label: 'Assigned',
    className: 'badge-assigned',
    icon: UserCheck,
  },
  IN_PROGRESS: {
    label: 'In Progress',
    className: 'badge-progress',
    icon: Activity,
  },
  ON_HOLD: {
    label: 'On Hold',
    className: 'badge-hold',
    icon: PauseCircle,
  },
  RESOLVED: {
    label: 'Resolved',
    className: 'badge-resolved',
    icon: CheckCircle2,
  },
  CLOSED: {
    label: 'Closed',
    className: 'badge-closed',
    icon: Archive,
  },
  REOPENED: {
    label: 'Reopened',
    className: 'badge-progress',
    icon: RotateCcw,
  },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || {
    label: status || 'Unknown',
    className: 'badge-closed',
    icon: Clock,
  };

  const IconComponent = config.icon;

  return (
    <span className={`badge ${config.className}`}>
      <IconComponent size={12} />
      {config.label}
    </span>
  );
}
