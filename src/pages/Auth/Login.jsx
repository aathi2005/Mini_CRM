import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  InputAdornment, IconButton, Alert, Divider,
} from '@mui/material';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import { login } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await login(form);
      loginUser(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
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
      {/* Decorative blobs */}
      <Box sx={{ position: 'fixed', top: '10%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(99,102,241,0.06)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <Box sx={{ position: 'fixed', bottom: '10%', right: '5%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(6,182,212,0.06)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <Card sx={{ width: '100%', maxWidth: 420, position: 'relative' }}>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 56, height: 56, borderRadius: '14px',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                mx: 'auto', mb: 2,
                boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
              }}
            >
              <LockRoundedIcon sx={{ color: '#fff', fontSize: 28 }} />
            </Box>
            <Typography variant="h5" fontWeight={800} gutterBottom>Welcome back</Typography>
            <Typography variant="body2" color="text.secondary">Sign in to your Mini CRM account</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              id="login-email"
              name="email"
              label="Email address"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              fullWidth
              autoComplete="email"
            />
            <TextField
              id="login-password"
              name="password"
              label="Password"
              type={showPass ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              required
              fullWidth
              autoComplete="current-password"
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
            <Button
              id="login-submit"
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mt: 1, py: 1.4 }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </Box>

          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.08)' }} />

          <Typography variant="body2" color="text.secondary" textAlign="center">
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#818cf8', fontWeight: 600, textDecoration: 'none' }}>
              Create one
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
