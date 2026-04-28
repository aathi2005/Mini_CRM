import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, Typography, Avatar, Divider, Tooltip, IconButton,
} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { useAuth } from '../../context/AuthContext';

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 72;

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: DashboardRoundedIcon },
  { label: 'Leads',     path: '/leads',     icon: PeopleAltRoundedIcon },
  { label: 'Companies', path: '/companies', icon: BusinessRoundedIcon },
  { label: 'Tasks',     path: '/tasks',     icon: AssignmentRoundedIcon },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const width = collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          background: 'rgba(15, 15, 26, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          overflowX: 'hidden',
          transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        },
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          display: 'flex', alignItems: 'center', gap: 1.5,
          px: collapsed ? 1.5 : 2.5, py: 2.5,
          minHeight: 64,
          transition: 'padding 0.3s',
        }}
      >
        <Box
          sx={{
            width: 38, height: 38, borderRadius: '10px', flexShrink: 0,
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
          }}
        >
          <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: 18 }}>C</Typography>
        </Box>
        {!collapsed && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #f1f5f9, #818cf8)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              whiteSpace: 'nowrap',
            }}
          >
            Mini CRM
          </Typography>
        )}
        <Box sx={{ ml: 'auto' }}>
          <IconButton
            size="small"
            onClick={() => setCollapsed((p) => !p)}
            sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
          >
            {collapsed ? <MenuRoundedIcon fontSize="small" /> : <MenuOpenRoundedIcon fontSize="small" />}
          </IconButton>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

      {/* Nav Items */}
      <List sx={{ px: 1, py: 1.5, flexGrow: 1 }}>
        {navItems.map(({ label, path, icon: Icon }) => {
          const active = location.pathname.startsWith(path);
          return (
            <ListItem key={path} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip title={collapsed ? label : ''} placement="right">
                <ListItemButton
                  component={NavLink}
                  to={path}
                  sx={{
                    borderRadius: 2,
                    px: collapsed ? 1.5 : 2,
                    py: 1.2,
                    minHeight: 46,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
                    border: active ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                    '&:hover': {
                      background: 'rgba(99,102,241,0.1)',
                      border: '1px solid rgba(99,102,241,0.2)',
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: collapsed ? 0 : 36 }}>
                    <Icon
                      sx={{
                        fontSize: 22,
                        color: active ? 'primary.light' : 'text.secondary',
                        transition: 'color 0.2s',
                      }}
                    />
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={label}
                      primaryTypographyProps={{
                        fontWeight: active ? 700 : 500,
                        fontSize: '0.9rem',
                        color: active ? 'primary.light' : 'text.secondary',
                        noWrap: true,
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

      {/* User + Logout */}
      <Box sx={{ p: collapsed ? 1 : 1.5 }}>
        <Box
          sx={{
            display: 'flex', alignItems: 'center', gap: 1.5,
            p: collapsed ? 1 : 1.5,
            borderRadius: 2,
            background: 'rgba(255,255,255,0.04)',
          }}
        >
          <Avatar
            sx={{
              width: 36, height: 36, flexShrink: 0,
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              fontSize: 14, fontWeight: 700,
            }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          {!collapsed && (
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
              <Typography variant="caption" fontWeight={700} noWrap display="block" color="text.primary">
                {user?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap display="block" sx={{ fontSize: '0.68rem' }}>
                {user?.role}
              </Typography>
            </Box>
          )}
          <Tooltip title="Logout">
            <IconButton
              size="small"
              onClick={logout}
              sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' }, flexShrink: 0 }}
            >
              <LogoutRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
