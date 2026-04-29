import { useState, useEffect, useCallback } from 'react';
import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TextField, MenuItem, IconButton, Typography, Tooltip,
  Pagination, Skeleton, Avatar, Select, FormControl, InputLabel,
} from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import { getTasks, updateTask, deleteTask } from '../../api/taskApi';
import StatusChip from '../../components/UI/StatusChip';
import PageHeader from '../../components/UI/PageHeader';
import ConfirmDialog from '../../components/UI/ConfirmDialog';
import TaskForm from './TaskForm';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const STATUSES = ['', 'Pending', 'In Progress', 'Done'];
const PRIORITIES = ['', 'Low', 'Medium', 'High'];

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getTasks({ status, priority, page, limit: 10 });
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch { toast.error('Failed to load tasks'); }
    finally { setLoading(false); }
  }, [status, priority, page]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleStatusChange = async (taskId, assignedTo, newStatus) => {
    const isAssigned = assignedTo?._id === user?._id;
    const isAdmin = user?.role === 'admin';
    if (!isAssigned && !isAdmin) {
      toast.error('Only the assigned user or admin can change task status');
      return;
    }
    try {
      await updateTask(taskId, { status: newStatus });
      toast.success('Status updated');
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteTask(deleteId);
      toast.success('Task deleted');
      setDeleteId(null);
      fetchTasks();
    } catch { toast.error('Failed to delete'); }
    finally { setDeleting(false); }
  };

  return (
    <Box>
      <PageHeader
        title="Tasks"
        subtitle={`${pagination.total} total tasks`}
        action={() => setFormOpen(true)}
        actionLabel="Add Task"
        actionIcon={AddRoundedIcon}
      />

      <Card sx={{ p: 2, mb: 2.5 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField id="task-status-filter" select label="Status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} size="small" sx={{ minWidth: 150 }}>
            {STATUSES.map((s) => <MenuItem key={s} value={s}>{s || 'All Statuses'}</MenuItem>)}
          </TextField>
          <TextField id="task-priority-filter" select label="Priority" value={priority} onChange={(e) => { setPriority(e.target.value); setPage(1); }} size="small" sx={{ minWidth: 150 }}>
            {PRIORITIES.map((p) => <MenuItem key={p} value={p}>{p || 'All Priorities'}</MenuItem>)}
          </TextField>
        </Box>
      </Card>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Task</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Linked Lead</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>{Array.from({ length: 7 }).map((_, j) => <TableCell key={j}><Skeleton /></TableCell>)}</TableRow>
                  ))
                : tasks.length === 0
                ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <Typography color="text.secondary">No tasks found</Typography>
                      </TableCell>
                    </TableRow>
                  )
                : tasks.map((task) => {
                  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Done';
                  return (
                    <TableRow key={task._id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={700}>{task.title}</Typography>
                        {task.description && <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 200, display: 'block' }}>{task.description}</Typography>}
                      </TableCell>
                      <TableCell>
                        <FormControl size="small" sx={{ minWidth: 130 }}>
                          <Select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task._id, task.assignedTo, e.target.value)}
                            sx={{ fontSize: '0.8rem' }}
                          >
                            {['Pending', 'In Progress', 'Done'].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell><StatusChip value={task.priority} /></TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CalendarTodayRoundedIcon sx={{ fontSize: 13, color: isOverdue ? 'error.main' : 'text.secondary' }} />
                          <Typography variant="caption" color={isOverdue ? 'error.main' : 'text.secondary'} fontWeight={isOverdue ? 700 : 400}>
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell><Typography variant="body2" color="text.secondary">{task.lead?.name || '—'}</Typography></TableCell>
                      <TableCell>
                        {task.assignedTo ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 26, height: 26, fontSize: 11, background: '#6366f120', color: 'primary.light' }}>
                              {task.assignedTo.name.charAt(0)}
                            </Avatar>
                            <Typography variant="body2" color="text.secondary">{task.assignedTo.name}</Typography>
                          </Box>
                        ) : <Typography variant="body2" color="text.secondary">—</Typography>}
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => { setEditTask(task); setFormOpen(true); }} sx={{ color: 'text.secondary', '&:hover': { color: 'warning.main' } }}>
                              <EditRoundedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => setDeleteId(task._id)} sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}>
                              <DeleteRoundedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        {pagination.pages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <Pagination count={pagination.pages} page={page} onChange={(_, v) => setPage(v)} color="primary" />
          </Box>
        )}
      </Card>

      <TaskForm open={formOpen} onClose={(r) => { setFormOpen(false); setEditTask(null); if (r) fetchTasks(); }} task={editTask} />
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} loading={deleting} title="Delete Task" message="This will soft-delete the task." />
    </Box>
  );
};

export default Tasks;
