import { useState, useEffect } from 'react';
import {
  Box, Grid, Typography, Card, CardContent, Avatar, Chip,
  Table, TableBody, TableCell, TableHead, TableRow, Skeleton, Divider,
} from '@mui/material';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';
import { getDashboard } from '../../api/dashboardApi';
import StatCard from '../../components/UI/StatCard';
import StatusChip from '../../components/UI/StatusChip';
import PageHeader from '../../components/UI/PageHeader';

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'];
const TASK_COLORS = ['#f59e0b', '#6366f1', '#10b981'];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = data
    ? [
        { title: 'Total Leads', value: data.stats.totalLeads, icon: PeopleAltRoundedIcon, color: '#6366f1', gradient: 'linear-gradient(90deg,#6366f1,#818cf8)' },
        { title: 'Qualified Leads', value: data.stats.qualifiedLeads, icon: StarRoundedIcon, color: '#10b981', gradient: 'linear-gradient(90deg,#10b981,#34d399)' },
        { title: 'Pending Tasks', value: data.stats.pendingTasks, icon: AssignmentRoundedIcon, color: '#f59e0b', gradient: 'linear-gradient(90deg,#f59e0b,#fbbf24)' },
        { title: 'Completed Tasks', value: data.stats.doneTasks, icon: CheckCircleRoundedIcon, color: '#06b6d4', gradient: 'linear-gradient(90deg,#06b6d4,#22d3ee)' },
        { title: 'Companies', value: data.stats.totalCompanies, icon: BusinessRoundedIcon, color: '#8b5cf6', gradient: 'linear-gradient(90deg,#8b5cf6,#a78bfa)' },
      ]
    : [];

  return (
    <Box>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your CRM pipeline and performance"
      />

      {/* Stat Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={i}>
                <Skeleton variant="rounded" height={120} sx={{ borderRadius: 3 }} />
              </Grid>
            ))
          : statCards.map((c) => (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={c.title}>
                <StatCard {...c} />
              </Grid>
            ))}
      </Grid>

      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        {/* Lead Status Pie */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Leads by Status</Typography>
              {loading ? (
                <Skeleton variant="circular" width={200} height={200} sx={{ mx: 'auto' }} />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={data.leadsByStatus} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={85} innerRadius={45} paddingAngle={3}>
                      {data.leadsByStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                      labelStyle={{ color: '#f1f5f9' }}
                    />
                    <Legend formatter={(v) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Task Status Bar Chart */}
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Tasks by Status</Typography>
              {loading ? (
                <Skeleton variant="rounded" height={200} />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={data.tasksByStatus} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="status" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {data.tasksByStatus.map((_, i) => <Cell key={i} fill={TASK_COLORS[i % TASK_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        {/* Recent Leads */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Recent Leads</Typography>
              <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.06)' }} />
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height={48} sx={{ mb: 1, borderRadius: 2 }} />)
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Company</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.recentLeads?.map((lead) => (
                      <TableRow key={lead._id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 28, height: 28, fontSize: 12, background: '#6366f120', color: 'primary.light' }}>
                              {lead.name.charAt(0)}
                            </Avatar>
                            <Typography variant="body2" fontWeight={600}>{lead.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">{lead.company?.name || '—'}</Typography>
                        </TableCell>
                        <TableCell><StatusChip value={lead.status} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Tasks */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Upcoming Tasks</Typography>
              <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.06)' }} />
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height={48} sx={{ mb: 1, borderRadius: 2 }} />)
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {data.upcomingTasks?.map((task) => (
                    <Box
                      key={task._id}
                      sx={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        p: 1.5, borderRadius: 2, background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight={600}>{task.title}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {task.assignedTo?.name || 'Unassigned'} · {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <StatusChip value={task.priority} />
                        <StatusChip value={task.status} />
                      </Box>
                    </Box>
                  ))}
                  {!data.upcomingTasks?.length && (
                    <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 3 }}>
                      No upcoming tasks 🎉
                    </Typography>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
