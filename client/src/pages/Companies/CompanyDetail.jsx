import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, Grid, Divider,
  IconButton, Skeleton, Avatar, Table, TableBody,
  TableCell, TableHead, TableRow, Button, Chip,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import { getCompany } from '../../api/companyApi';
import StatusChip from '../../components/UI/StatusChip';
import CompanyForm from './CompanyForm';

const InfoRow = ({ icon: Icon, label, value, link }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
    <Icon sx={{ color: 'secondary.light', fontSize: 18 }} />
    <Box>
      <Typography variant="caption" color="text.secondary" display="block">{label}</Typography>
      {link && value
        ? <a href={value} target="_blank" rel="noreferrer" style={{ color: '#818cf8', fontSize: 13 }}>{value}</a>
        : <Typography variant="body2" fontWeight={600}>{value || '—'}</Typography>}
    </Box>
  </Box>
);

const CompanyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await getCompany(id);
      setCompany(data.company);
      setLeads(data.leads);
    } catch { navigate('/companies'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [id]);

  if (loading) return <Box><Skeleton height={60} sx={{ mb: 2 }} /><Grid container spacing={2.5}><Grid item xs={12} md={5}><Skeleton variant="rounded" height={280} /></Grid><Grid item xs={12} md={7}><Skeleton variant="rounded" height={280} /></Grid></Grid></Box>;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate('/companies')} sx={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
          <ArrowBackRoundedIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" fontWeight={800} sx={{ background: 'linear-gradient(135deg,#f1f5f9,#22d3ee)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {company.name}
          </Typography>
          {company.industry && <Chip label={company.industry} size="small" sx={{ mt: 0.5, fontWeight: 600 }} />}
        </Box>
        <Button variant="outlined" startIcon={<EditRoundedIcon />} onClick={() => setEditOpen(true)}>Edit</Button>
      </Box>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ width: 56, height: 56, background: 'linear-gradient(135deg,#06b6d4,#0891b2)' }}>
                  {company.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={700}>{company.name}</Typography>
                  <Typography variant="body2" color="text.secondary">Company Details</Typography>
                </Box>
              </Box>
              <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.06)' }} />
              <InfoRow icon={LanguageRoundedIcon} label="Website" value={company.website} link />
              <InfoRow icon={PhoneRoundedIcon} label="Phone" value={company.phone} />
              <InfoRow icon={EmailRoundedIcon} label="Email" value={company.email} />
              <InfoRow icon={LocationOnRoundedIcon} label="Address" value={company.address} />
              {company.notes && (
                <Box sx={{ mt: 2, p: 2, borderRadius: 2, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Typography variant="caption" color="text.secondary" display="block" gutterBottom>Notes</Typography>
                  <Typography variant="body2">{company.notes}</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Associated Leads ({leads.length})</Typography>
              <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.06)' }} />
              {leads.length === 0
                ? <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>No leads for this company</Typography>
                : (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Source</TableCell>
                        <TableCell>Assigned</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {leads.map((lead) => (
                        <TableRow key={lead._id} sx={{ cursor: 'pointer' }} onClick={() => navigate(`/leads/${lead._id}`)}>
                          <TableCell><Typography variant="body2" fontWeight={600}>{lead.name}</Typography></TableCell>
                          <TableCell><StatusChip value={lead.status} /></TableCell>
                          <TableCell><Typography variant="body2" color="text.secondary">{lead.source}</Typography></TableCell>
                          <TableCell><Typography variant="body2" color="text.secondary">{lead.assignedTo?.name || '—'}</Typography></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <CompanyForm open={editOpen} onClose={(r) => { setEditOpen(false); if (r) fetchData(); }} company={company} />
    </Box>
  );
};

export default CompanyDetail;
