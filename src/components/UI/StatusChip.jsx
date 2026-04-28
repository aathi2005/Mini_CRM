import { Chip } from '@mui/material';

const statusConfig = {
  // Lead statuses
  New:        { color: 'info',    label: 'New' },
  Contacted:  { color: 'warning', label: 'Contacted' },
  Qualified:  { color: 'success', label: 'Qualified' },
  Lost:       { color: 'error',   label: 'Lost' },
  // Task statuses
  Pending:      { color: 'warning', label: 'Pending' },
  'In Progress':{ color: 'info',    label: 'In Progress' },
  Done:         { color: 'success', label: 'Done' },
  // Priority
  Low:    { color: 'default', label: 'Low' },
  Medium: { color: 'warning', label: 'Medium' },
  High:   { color: 'error',   label: 'High' },
};

const StatusChip = ({ value, size = 'small' }) => {
  const cfg = statusConfig[value] || { color: 'default', label: value };
  return (
    <Chip
      label={cfg.label}
      color={cfg.color}
      size={size}
      sx={{ fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.03em' }}
    />
  );
};

export default StatusChip;
