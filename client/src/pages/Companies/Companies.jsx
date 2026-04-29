import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TextField, InputAdornment, IconButton, Typography,
  Pagination, Skeleton, Avatar, Tooltip,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import { getCompanies, deleteCompany } from '../../api/companyApi';
import PageHeader from '../../components/UI/PageHeader';
import ConfirmDialog from '../../components/UI/ConfirmDialog';
import CompanyForm from './CompanyForm';
import toast from 'react-hot-toast';

const Companies = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editCompany, setEditCompany] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getCompanies({ search, page, limit: 10 });
      setCompanies(data.companies);
      setPagination(data.pagination);
    } catch { toast.error('Failed to load companies'); }
    finally { setLoading(false); }
  }, [search, page]);

  useEffect(() => { fetchCompanies(); }, [fetchCompanies]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteCompany(deleteId);
      toast.success('Company deleted');
      setDeleteId(null);
      fetchCompanies();
    } catch { toast.error('Failed to delete'); }
    finally { setDeleting(false); }
  };

  return (
    <Box>
      <PageHeader
        title="Companies"
        subtitle={`${pagination.total} total companies`}
        action={() => setFormOpen(true)}
        actionLabel="Add Company"
        actionIcon={AddRoundedIcon}
      />

      <Card sx={{ p: 2, mb: 2.5 }}>
        <TextField
          id="company-search"
          placeholder="Search by name or industry…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          size="small"
          fullWidth
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" sx={{ color: 'text.secondary' }} /></InputAdornment> }}
        />
      </Card>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Company</TableCell>
                <TableCell>Industry</TableCell>
                <TableCell>Website</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Email</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>{Array.from({ length: 6 }).map((_, j) => <TableCell key={j}><Skeleton /></TableCell>)}</TableRow>
                  ))
                : companies.length === 0
                ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                        <Typography color="text.secondary">No companies found</Typography>
                      </TableCell>
                    </TableRow>
                  )
                : companies.map((company) => (
                    <TableRow key={company._id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 34, height: 34, background: '#06b6d420', color: 'secondary.light' }}>
                            <BusinessRoundedIcon sx={{ fontSize: 18 }} />
                          </Avatar>
                          <Typography variant="body2" fontWeight={700}>{company.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell><Typography variant="body2" color="text.secondary">{company.industry || '—'}</Typography></TableCell>
                      <TableCell>
                        {company.website
                          ? <a href={company.website} target="_blank" rel="noreferrer" style={{ color: '#818cf8', fontSize: 13 }}>{company.website}</a>
                          : <Typography variant="body2" color="text.secondary">—</Typography>}
                      </TableCell>
                      <TableCell><Typography variant="body2" color="text.secondary">{company.phone || '—'}</Typography></TableCell>
                      <TableCell><Typography variant="body2" color="text.secondary">{company.email || '—'}</Typography></TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                          <Tooltip title="View">
                            <IconButton size="small" onClick={() => navigate(`/companies/${company._id}`)} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                              <VisibilityRoundedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => { setEditCompany(company); setFormOpen(true); }} sx={{ color: 'text.secondary', '&:hover': { color: 'warning.main' } }}>
                              <EditRoundedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => setDeleteId(company._id)} sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}>
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

      <CompanyForm open={formOpen} onClose={(r) => { setFormOpen(false); setEditCompany(null); if (r) fetchCompanies(); }} company={editCompany} />
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Delete Company" message="This will soft-delete the company. Associated leads remain intact." />
    </Box>
  );
};

export default Companies;
