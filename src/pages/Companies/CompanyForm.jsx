import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Grid, Typography,
} from '@mui/material';
import { createCompany, updateCompany } from '../../api/companyApi';
import toast from 'react-hot-toast';

const defaultForm = { name: '', industry: '', website: '', phone: '', email: '', address: '', notes: '' };

const CompanyForm = ({ open, onClose, company }) => {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(company
        ? { name: company.name, industry: company.industry || '', website: company.website || '', phone: company.phone || '', email: company.email || '', address: company.address || '', notes: company.notes || '' }
        : defaultForm
      );
    }
  }, [open, company]);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (company) {
        await updateCompany(company._id, form);
        toast.success('Company updated');
      } else {
        await createCompany(form);
        toast.success('Company created');
      }
      onClose(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save company');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight={700}>{company ? 'Edit Company' : 'Add New Company'}</Typography>
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField id="company-name" name="name" label="Company Name *" value={form.name} onChange={handleChange} required fullWidth size="small" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField id="company-industry" name="industry" label="Industry" value={form.industry} onChange={handleChange} fullWidth size="small" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField id="company-website" name="website" label="Website URL" value={form.website} onChange={handleChange} fullWidth size="small" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField id="company-phone" name="phone" label="Phone" value={form.phone} onChange={handleChange} fullWidth size="small" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField id="company-email" name="email" label="Email" type="email" value={form.email} onChange={handleChange} fullWidth size="small" />
            </Grid>
            <Grid item xs={12}>
              <TextField id="company-address" name="address" label="Address" value={form.address} onChange={handleChange} fullWidth size="small" />
            </Grid>
            <Grid item xs={12}>
              <TextField id="company-notes" name="notes" label="Notes" value={form.notes} onChange={handleChange} fullWidth size="small" multiline rows={3} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => onClose(false)} variant="outlined" color="inherit">Cancel</Button>
          <Button id="company-save" type="submit" variant="contained" disabled={loading}>
            {loading ? 'Saving…' : company ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CompanyForm;
