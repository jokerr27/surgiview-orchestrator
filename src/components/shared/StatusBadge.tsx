import { cn } from '@/lib/utils';

type Status = 'not-started' | 'setting-up' | 'ready' | 'in-progress' | 'available' | 'in-use' | 'cleaning' | 'low' | 'medium' | 'high';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  'not-started': { label: 'Not Started', className: 'status-badge status-not-started' },
  'setting-up': { label: 'Setting Up', className: 'status-badge status-setting-up' },
  'ready': { label: 'Ready', className: 'status-badge status-ready' },
  'in-progress': { label: 'In Progress', className: 'status-badge status-in-progress' },
  'available': { label: 'Available', className: 'status-badge status-ready' },
  'in-use': { label: 'In Use', className: 'status-badge status-in-progress' },
  'cleaning': { label: 'Cleaning', className: 'status-badge status-setting-up' },
  'low': { label: 'Low', className: 'status-badge status-ready' },
  'medium': { label: 'Medium', className: 'status-badge status-setting-up' },
  'high': { label: 'High', className: 'status-badge bg-destructive/15 text-destructive' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span className={cn(config.className, className)}>
      {config.label}
    </span>
  );
}
