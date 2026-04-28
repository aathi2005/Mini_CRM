import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box
} from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

const ConfirmDialog = ({ open, onClose, onConfirm, title, message, confirmLabel = 'Delete', loading = false }) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle sx={{ pb: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 42, height: 42, borderRadius: '50%',
            background: 'rgba(239,68,68,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <WarningAmberRoundedIcon sx={{ color: 'error.main', fontSize: 22 }} />
        </Box>
        <Typography variant="h6" fontWeight={700}>{title}</Typography>
      </Box>
    </DialogTitle>
    <DialogContent>
      <Typography variant="body2" color="text.secondary">{message}</Typography>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
      <Button onClick={onClose} variant="outlined" color="inherit" disabled={loading}>Cancel</Button>
      <Button onClick={onConfirm} variant="contained" color="error" disabled={loading}>
        {loading ? 'Deleting…' : confirmLabel}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
