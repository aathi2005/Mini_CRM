import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Box, Grid, Typography,
} from '@mui/material';
import { createTask, updateTask } from '../../api/taskApi';
import { getLeads } from '../../api/leadApi';
import { getUsers } from '../../api/authApi';
import toast from 'react-hot-toast';

const STATUSES = ['Pending', 'In Progress', 'Done'];
const PRIORITIES = ['Low', 'Medium', 'High'];
const defaultForm = { title: '', description: '', dueDate: '', status: 'Pending', priority: 'Medium', assignedTo: '', lead: '' };

const TaskForm = ({ open, onClose, task }) => {
  const [form, setForm] = useState(defaultForm);
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(task
        ? {
            title: task.title,
            description: task.description || '',
            dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
            status: task.status,
            priority: task.priority,
            assignedTo: task.assignedTo?._id || '',
            lead: task.lead?._id || '',
          }
        : defaultForm
      );
      getLeads({ limit: 100 }).then((r) => setLeads(r.data.leads)).catch(() => {});
      getUsers().then((r) => setUsers(r.data.users)).catch(() => {});
    }
  }, [open, task]);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        assignedTo: form.assignedTo || null,
        lead: form.lead || null,
        dueDate: form.dueDate || null,
      };
      if (task) {
        await updateTask(task._id, payload);
        toast.success('Task updated');
      } else {
        await createTask(payload);
        toast.success('Task created');
      }
      onClose(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight={700}>{task ? 'Edit Task' : 'Add New Task'}</Typography>
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField id="task-title" name="title" label="Task Title *" value={form.title} onChange={handleChange} required fullWidth size="small" />
            </Grid>
            <Grid item xs={12}>
              <TextField id="task-desc" name="description" label="Description" value={form.description} onChange={handleChange} fullWidth size="small" multiline rows={2} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField id="task-status" name="status" label="Status" select value={form.status} onChange={handleChange} fullWidth size="small">
                {STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField id="task-priority" name="priority" label="Priority" select value={form.priority} onChange={handleChange} fullWidth size="small">
                {PRIORITIES.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField id="task-due" name="dueDate" label="Due Date" type="date" value={form.dueDate} onChange={handleChange} fullWidth size="small" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField id="task-assigned" name="assignedTo" label="Assign To" select value={form.assignedTo} onChange={handleChange} fullWidth size="small">
                <MenuItem value="">Unassigned</MenuItem>
                {users.map((u) => <MenuItem key={u._id} value={u._id}>{u.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField id="task-lead" name="lead" label="Link to Lead" select value={form.lead} onChange={handleChange} fullWidth size="small">
                <MenuItem value="">No Lead</MenuItem>
                {leads.map((l) => <MenuItem key={l._id} value={l._id}>{l.name}</MenuItem>)}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => onClose(false)} variant="outlined" color="inherit">Cancel</Button>
          <Button id="task-save" type="submit" variant="contained" disabled={loading}>
            {loading ? 'Saving…' : task ? 'Update Task' : 'Create Task'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default TaskForm;
