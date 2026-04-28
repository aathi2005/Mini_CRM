import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, Grid, Chip, Divider,
  Button, Skeleton, Avatar, Table, TableBody, TableCell,
  TableHead, TableRow, IconButton, Tooltip,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { getLead } from '../../api/leadApi';
import { getTasks } from '../../api/taskApi';
import StatusChip from '../../components/UI/StatusChip';
import LeadForm from './LeadForm';

const InfoRow = ({ icon: Icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
    <Icon sx={{ color: 'primary.light', fontSize: 18 }} />
    <Box>
      <Typography variant="caption" color="text.secondary" display="block">{label}</Typography>
      <Typography variant="body2" fontWeight={600}>{value || '—'}</Typography>
    </Box>
  </Box>
);

const LeadDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadRes, taskRes] = await Promise.all([getLead(id), getTasks({ lead: id, limit: 20 })]);
      setLead(leadRes.data.lead);
      setTasks(taskRes.data.tasks);
    } catch { navigate('/leads'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [id]);

  if (loading) return (
    <Box>
      <Skeleton height={60} sx={{ mb: 1 }} />
      <Grid container spacing={2.5}><Grid item xs={12} md={5}><Skeleton variant="rounded" height={280} /></Grid><Grid item xs={12} md={7}><Skeleton variant="rounded" height={280} /></Grid></Grid>
    </Box>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate('/leads')} sx={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
          <ArrowBackRoundedIcon />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" fontWeight={800} sx={{ background: 'linear-gradient(135deg,#f1f5f9,#818cf8)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {lead.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
            <StatusChip value={lead.status} />
            <StatusChip value={lead.source} />
          </Box>
        </Box>
        <Button variant="outlined" startIcon={<EditRoundedIcon />} onClick={() => setEditOpen(true)}>Edit</Button>
      </Box>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ width: 56, height: 56, fontSize: 22, background: 'linear-gradient(135deg,#6366f1,#4f46e5)' }}>
                  {lead.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={700}>{lead.name}</Typography>
                  <Typography variant="body2" color="text.secondary">Lead Details</Typography>
                </Box>
              </Box>
              <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.06)' }} />
              <InfoRow icon={EmailRoundedIcon} label="Email" value={lead.email} />
              <InfoRow icon={PhoneRoundedIcon} label="Phone" value={lead.phone} />
              <InfoRow icon={BusinessRoundedIcon} label="Company" value={lead.company?.name} />
              <InfoRow icon={PersonRoundedIcon} label="Assigned To" value={lead.assignedTo?.name} />
              {lead.notes && (
                <Box sx={{ mt: 2, p: 2, borderRadius: 2, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Typography variant="caption" color="text.secondary" display="block" gutterBottom>Notes</Typography>
                  <Typography variant="body2">{lead.notes}</Typography>
                </Box>
              )}
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Created: {new Date(lead.createdAt).toLocaleDateString()} by {lead.createdBy?.name}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Linked Tasks ({tasks.length})</Typography>
              <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.06)' }} />
              {tasks.length === 0 ? (
                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>No tasks linked to this lead</Typography>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Assigned</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tasks.map((task) => (
                      <TableRow key={task._id}>
                        <TableCell><Typography variant="body2" fontWeight={600}>{task.title}</Typography></TableCell>
                        <TableCell><StatusChip value={task.status} /></TableCell>
                        <TableCell><StatusChip value={task.priority} /></TableCell>
                        <TableCell><Typography variant="caption" color="text.secondary">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}</Typography></TableCell>
                        <TableCell><Typography variant="caption" color="text.secondary">{task.assignedTo?.name || '—'}</Typography></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <LeadForm open={editOpen} onClose={(refresh) => { setEditOpen(false); if (refresh) fetchData(); }} lead={lead} />
    </Box>
  );
};

export default LeadDetail;
