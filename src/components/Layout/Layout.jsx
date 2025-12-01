import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  alpha,
} from '@mui/material';
import {
  LayoutDashboard as DashboardIcon,
  Building2 as PortfolioIcon,
  FileText as InstructionsIcon,
  FileSpreadsheet as StatementsIcon,
  Bell as NotificationsIcon,
  Users as RelationshipIcon,
  ShieldCheck as MandateIcon,
  BarChart3 as AnalyticsIcon,
  Activity as TrackingIcon,
  UserCircle as AccountIcon,
  Menu as MenuIcon,
  LogOut as LogoutIcon,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { notificationService } from '../../services/notificationService';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Portfolio Valuation', icon: <PortfolioIcon />, path: '/portfolio' },
  { text: 'Instructions', icon: <InstructionsIcon />, path: '/instructions' },
  { text: 'Statements', icon: <StatementsIcon />, path: '/statements' },
  { text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
  { text: 'Relationship', icon: <RelationshipIcon />, path: '/relationship' },
  { text: 'Mandates', icon: <MandateIcon />, path: '/mandates' },
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
  { text: 'Instruction Tracking', icon: <TrackingIcon />, path: '/tracking' },
  { text: 'Account', icon: <AccountIcon />, path: '/account' },
];

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    // Fetch unread notifications count
    const fetchUnreadCount = async () => {
      try {
        const response = await notificationService.getNotifications({ unread: true });
        setUnreadCount(response.data?.length || 0);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const drawer = (
    <Box sx={{ height: '100%', background: 'transparent' }}>
      <Toolbar sx={{ py: 3 }}>
        <Typography 
          variant="h6" 
          noWrap 
          component="div"
          sx={{ 
            fontFamily: '"Space Grotesk", sans-serif',
            color: 'hsl(222, 47%, 11%)',
            fontWeight: 700,
            fontSize: '1.25rem',
            letterSpacing: '-0.01em',
          }}
        >
          FSDH Portal
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: 'hsl(214, 32%, 91%)', mx: 2 }} />
      <List sx={{ px: 1, py: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              sx={{
                color: location.pathname === item.path 
                  ? 'hsl(221, 83%, 53%)' 
                  : 'hsl(222, 20%, 40%)',
                '& .MuiListItemIcon-root': {
                  color: location.pathname === item.path 
                    ? 'hsl(221, 83%, 53%)' 
                    : 'hsl(222, 20%, 40%)',
                },
                '& .MuiListItemText-primary': {
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  fontSize: '0.875rem',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { sm: 'none' },
              color: 'hsl(222, 47%, 11%)',
            }}
          >
            <MenuIcon size={24} />
          </IconButton>
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontFamily: '"Space Grotesk", sans-serif',
              color: 'hsl(222, 47%, 11%)',
              fontWeight: 600,
              fontSize: '1rem',
            }}
          >
            Client Portal
          </Typography>
          <IconButton
            color="inherit"
            onClick={() => navigate('/notifications')}
            sx={{ 
              mr: 2,
              color: 'hsl(222, 47%, 11%)',
            }}
          >
            <Badge 
              badgeContent={unreadCount} 
              sx={{
                '& .MuiBadge-badge': {
                  background: 'hsl(0, 65%, 55%)',
                  color: '#ffffff',
                  fontSize: '0.625rem',
                },
              }}
            >
              <NotificationsIcon size={20} />
            </Badge>
          </IconButton>
          <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
            <Avatar 
              sx={{ 
                bgcolor: 'hsl(221, 83%, 53%)',
                border: '1px solid hsl(214, 32%, 91%)',
                fontWeight: 600,
                color: '#ffffff',
                width: 32,
                height: 32,
                fontSize: '0.875rem',
              }}
            >
              {user?.firstName?.[0] || 'U'}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                background: '#ffffff',
                border: '1px solid hsl(214, 32%, 91%)',
                mt: 1,
                boxShadow: 'none',
              },
            }}
          >
            <MenuItem 
              onClick={() => { navigate('/account'); handleMenuClose(); }}
              sx={{ color: 'hsl(222, 47%, 11%)', fontSize: '0.875rem', display: 'flex', alignItems: 'center' }}
            >
              <AccountIcon size={16} style={{ marginRight: 8 }} /> Account
            </MenuItem>
            <MenuItem 
              onClick={handleLogout}
              sx={{ color: 'hsl(222, 47%, 11%)', fontSize: '0.875rem', display: 'flex', alignItems: 'center' }}
            >
              <LogoutIcon size={16} style={{ marginRight: 8 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

