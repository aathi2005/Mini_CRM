import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  InputAdornment, IconButton, Alert, MenuItem,
} from '@mui/material';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import { register } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'agent' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await register(form);
      loginUser(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        background: 'radial-gradient(ellipse at top left, #1e1b4b 0%, #0f0f1a 50%, #0c1a2e 100%)',
      }}
    >
      <Box sx={{ position: 'fixed', top: '10%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(99,102,241,0.06)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <Card sx={{ width: '100%', maxWidth: 440, position: 'relative' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 56, height: 56, borderRadius: '14px',
                background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                mx: 'auto', mb: 2,
                boxShadow: '0 8px 32px rgba(6,182,212,0.4)',
              }}
            >
              <PersonAddRoundedIcon sx={{ color: '#fff', fontSize: 28 }} />
            </Box>
            <Typography variant="h5" fontWeight={800} gutterBottom>Create account</Typography>
            <Typography variant="body2" color="text.secondary">Join Mini CRM to manage your pipeline</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField id="reg-name" name="name" label="Full name" value={form.name} onChange={handleChange} required fullWidth />
            <TextField id="reg-email" name="email" label="Email address" type="email" value={form.email} onChange={handleChange} required fullWidth />
            <TextField
              id="reg-password"
              name="password"
              label="Password"
              type={showPass ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              required
              fullWidth
              helperText="Minimum 6 characters"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPass((p) => !p)} edge="end" size="small">
                      {showPass ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField id="reg-role" name="role" label="Role" select value={form.role} onChange={handleChange} fullWidth>
              <MenuItem value="agent">Agent</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
            <Button id="reg-submit" type="submit" variant="contained" fullWidth size="large" disabled={loading} sx={{ mt: 1, py: 1.4, background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
              {loading ? 'Creating…' : 'Create Account'}
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 3 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;
