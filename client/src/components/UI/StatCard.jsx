import { Card, CardContent, Box, Typography, Avatar } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const StatCard = ({ title, value, subtitle, icon: Icon, color = '#6366f1', gradient }) => (
  <Card
    sx={{
      position: 'relative',
      overflow: 'hidden',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 16px 48px ${color}30`,
      },
    }}
  >
    {/* Gradient accent bar */}
    <Box
      sx={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 3,
        background: gradient || `linear-gradient(90deg, ${color}, ${color}99)`,
      }}
    />
    {/* Glow blob */}
    <Box
      sx={{
        position: 'absolute',
        top: -20, right: -20,
        width: 120, height: 120,
        borderRadius: '50%',
        background: `${color}15`,
        filter: 'blur(30px)',
      }}
    />
    <CardContent sx={{ p: 3, position: 'relative' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {title}
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', my: 0.5, lineHeight: 1 }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
          )}
        </Box>
        <Avatar
          sx={{
            width: 52, height: 52,
            background: `${color}20`,
            border: `1px solid ${color}40`,
          }}
        >
          {Icon ? <Icon sx={{ color, fontSize: 26 }} /> : <TrendingUpIcon sx={{ color }} />}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

export default StatCard;
