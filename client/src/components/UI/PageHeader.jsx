import { Box, Typography, Button } from '@mui/material';

const PageHeader = ({ title, subtitle, action, actionLabel, actionIcon: Icon }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      mb: 3,
      flexWrap: 'wrap',
      gap: 2,
    }}
  >
    <Box>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          background: 'linear-gradient(135deg, #f1f5f9, #818cf8)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1.2,
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
    {action && (
      <Button
        variant="contained"
        onClick={action}
        startIcon={Icon ? <Icon /> : null}
        sx={{ whiteSpace: 'nowrap' }}
      >
        {actionLabel}
      </Button>
    )}
  </Box>
);

export default PageHeader;
