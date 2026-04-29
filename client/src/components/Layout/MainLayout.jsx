import { Box } from '@mui/material';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => (
  <Box sx={{ display: 'flex', minHeight: '100vh' }}>
    <Sidebar />
    <Box
      component="main"
      sx={{
        flex: 1,
        p: { xs: 2, md: 3.5 },
        overflowY: 'auto',
        minHeight: '100vh',
      }}
    >
      {children}
    </Box>
  </Box>
);

export default MainLayout;
