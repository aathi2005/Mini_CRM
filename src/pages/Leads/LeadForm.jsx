import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Box, Grid, Typography,
} from '@mui/material';
import { createLead, updateLead } from '../../api/leadApi';
import { getCompanies } from '../../api/companyApi';
import { getUsers } from '../../api/authApi';
import toast from 'react-hot-toast';

const STATUSES = ['New', 'Contacted', 'Qualified', 'Lost'];
const SOURCES = ['Website', 'Referral', 'Cold Call', 'Social Media', 'Other'];

const defaultForm = { name: '', email: '', phone: '', status: 'New', source: 'Other', company: '', assignedTo: '', notes: '' };

const LeadForm = ({ open, onClose, lead }) => {
  const [form, setForm] = useState(defaultForm);
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(lead
        ? { name: lead.name, email: lead.email || '', phone: lead.phone || '', status: lead.status, source: lead.source, company: lead.company?._id || '', assignedTo: lead.assignedTo?._id || '', notes: lead.notes || '' }
        : defaultForm
      );
      getCompanies({ limit: 100 }).then((r) => setCompanies(r.data.companies)).catch(() => {});
      getUsers().then((r) => setUsers(r.data.users)).catch(() => {});
    }
  }, [open, lead]);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, company: form.company || null, assignedTo: form.assignedTo || null };
      if (lead) {
        await updateLead(lead._id, payload);
        toast.success('Lead updated');
      } else {
        await createLead(payload);
        toast.success('Lead created');
      }
      onClose(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight={700}>{lead ? 'Edit Lead' : 'Add New Lead'}</Typography>
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField id="lead-name" name="name" label="Full Name *" value={form.name} onChange={handleChange} required fullWidth size="small" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField id="lead-email" name="email" label="Email" type="email" value={form.email} onChange={handleChange} fullWidth size="small" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField id="lead-phone" name="phone" label="Phone" value={form.phone} onChange={handleChange} fullWidth size="small" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField id="lead-status" name="status" label="Status" select value={form.status} onChange={handleChange} fullWidth size="small">
                {STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField id="lead-source" name="source" label="Source" select value={form.source} onChange={handleChange} fullWidth size="small">
                {SOURCES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField id="lead-company" name="company" label="Company" select value={form.company} onChange={handleChange} fullWidth size="small">
                <MenuItem value="">None</MenuItem>
                {companies.map((c) => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField id="lead-assigned" name="assignedTo" label="Assigned To" select value={form.assignedTo} onChange={handleChange} fullWidth size="small">
                <MenuItem value="">Unassigned</MenuItem>
                {users.map((u) => <MenuItem key={u._id} value={u._id}>{u.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField id="lead-notes" name="notes" label="Notes" value={form.notes} onChange={handleChange} fullWidth size="small" multiline rows={3} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => onClose(false)} variant="outlined" color="inherit">Cancel</Button>
          <Button id="lead-save" type="submit" variant="contained" disabled={loading}>
            {loading ? 'Saving…' : lead ? 'Update Lead' : 'Create Lead'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default LeadForm;
