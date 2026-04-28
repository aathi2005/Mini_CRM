import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TextField, MenuItem, InputAdornment, IconButton, Typography,
  Pagination, Skeleton, Avatar, Tooltip, Button,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { getLeads, deleteLead } from '../../api/leadApi';
import StatusChip from '../../components/UI/StatusChip';
import PageHeader from '../../components/UI/PageHeader';
import ConfirmDialog from '../../components/UI/ConfirmDialog';
import LeadForm from './LeadForm';
import toast from 'react-hot-toast';

const STATUSES = ['', 'New', 'Contacted', 'Qualified', 'Lost'];
const SOURCES = ['', 'Website', 'Referral', 'Cold Call', 'Social Media', 'Other'];

const Leads = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [source, setSource] = useState('');
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getLeads({ search, status, source, page, limit: 10 });
      setLeads(data.leads);
      setPagination(data.pagination);
    } catch (e) {
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, [search, status, source, page]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteLead(deleteId);
      toast.success('Lead deleted');
      setDeleteId(null);
      fetchLeads();
    } catch { toast.error('Failed to delete'); }
    finally { setDeleting(false); }
  };

  const handleFormClose = (refresh) => {
    setFormOpen(false);
    setEditLead(null);
    if (refresh) fetchLeads();
  };

  return (
    <Box>
      <PageHeader
        title="Leads"
        subtitle={`${pagination.total} total leads`}
        action={() => setFormOpen(true)}
        actionLabel="Add Lead"
        actionIcon={AddRoundedIcon}
      />

      {/* Filters */}
      <Card sx={{ p: 2, mb: 2.5 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            id="leads-search"
            placeholder="Search name, email, phone…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            size="small"
            sx={{ flex: 1, minWidth: 220 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" sx={{ color: 'text.secondary' }} /></InputAdornment> }}
          />
          <TextField id="leads-status-filter" select label="Status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} size="small" sx={{ minWidth: 140 }}>
            {STATUSES.map((s) => <MenuItem key={s} value={s}>{s || 'All Statuses'}</MenuItem>)}
          </TextField>
          <TextField id="leads-source-filter" select label="Source" value={source} onChange={(e) => { setSource(e.target.value); setPage(1); }} size="small" sx={{ minWidth: 150 }}>
            {SOURCES.map((s) => <MenuItem key={s} value={s}>{s || 'All Sources'}</MenuItem>)}
          </TextField>
        </Box>
      </Card>

      {/* Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Lead</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 7 }).map((_, j) => <TableCell key={j}><Skeleton /></TableCell>)}
                    </TableRow>
                  ))
                : leads.length === 0
                ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <Typography color="text.secondary">No leads found</Typography>
                      </TableCell>
                    </TableRow>
                  )
                : leads.map((lead) => (
                    <TableRow key={lead._id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 34, height: 34, fontSize: 13, background: '#6366f120', color: 'primary.light' }}>
                            {lead.name.charAt(0)}
                          </Avatar>
                          <Typography variant="body2" fontWeight={700}>{lead.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" display="block" color="text.secondary">{lead.email || '—'}</Typography>
                        <Typography variant="caption" display="block" color="text.secondary">{lead.phone || '—'}</Typography>
                      </TableCell>
                      <TableCell><StatusChip value={lead.status} /></TableCell>
                      <TableCell><Typography variant="body2" color="text.secondary">{lead.source}</Typography></TableCell>
                      <TableCell><Typography variant="body2" color="text.secondary">{lead.company?.name || '—'}</Typography></TableCell>
                      <TableCell><Typography variant="body2" color="text.secondary">{lead.assignedTo?.name || '—'}</Typography></TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                          <Tooltip title="View">
                            <IconButton size="small" onClick={() => navigate(`/leads/${lead._id}`)} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                              <VisibilityRoundedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => { setEditLead(lead); setFormOpen(true); }} sx={{ color: 'text.secondary', '&:hover': { color: 'warning.main' } }}>
                              <EditRoundedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => setDeleteId(lead._id)} sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}>
                              <DeleteRoundedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>

        {pagination.pages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <Pagination count={pagination.pages} page={page} onChange={(_, v) => setPage(v)} color="primary" />
          </Box>
        )}
      </Card>

      <LeadForm open={formOpen} onClose={handleFormClose} lead={editLead} />
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Lead"
        message="This action will soft-delete the lead. It won't appear in lists but remains in the database."
      />
    </Box>
  );
};

export default Leads;
