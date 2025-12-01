import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Bell as NotificationIcon,
  CheckCircle2 as ReadIcon,
  Circle as UnreadIcon,
} from 'lucide-react';

export default function Notifications() {
  const [notifications, setNotifications] = useState(() => generateMockNotifications());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState(0);
  const [preferences, setPreferences] = useState({
    email: true,
    sms: false,
    inApp: true,
  });

  useEffect(() => {
    // Simulate new notifications arriving
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newNotif = generateSingleNotification();
        setNotifications(prev => [newNotif, ...prev]);
      }
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    alert(`Notification preference updated: ${key} = ${value}`);
  };

  if (loading && notifications.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography 
        variant="h4"
        sx={{
          fontFamily: '"Space Grotesk", sans-serif',
          color: 'hsl(222, 47%, 11%)',
          fontWeight: 700,
          mb: 3,
        }}
      >
        Notifications & Alerts
      </Typography>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            background: 'hsla(0, 65%, 55%, 0.1)',
            border: '1px solid hsla(0, 65%, 55%, 0.2)',
          }}
        >
          {error}
        </Alert>
      )}

      <Card 
        sx={{ 
          mb: 3,
          background: '#ffffff',
          border: '1px solid hsl(214, 32%, 91%)',
        }}
      >
        <CardContent>
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{
              fontFamily: '"Space Grotesk", sans-serif',
              color: 'hsl(222, 47%, 11%)',
              fontWeight: 600,
              mb: 2,
              fontSize: '1rem',
            }}
          >
            Notification Preferences
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={preferences.email}
                onChange={(e) => handlePreferenceChange('email', e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#6366f1',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#6366f1',
                  },
                }}
              />
            }
            label="Email Notifications"
            sx={{ color: 'hsl(222, 47%, 11%)', mb: 2, fontSize: '0.875rem' }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={preferences.sms}
                onChange={(e) => handlePreferenceChange('sms', e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: 'hsl(221, 83%, 53%)',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: 'hsl(221, 83%, 53%)',
                  },
                }}
              />
            }
            label="SMS Notifications"
            sx={{ color: 'hsl(222, 47%, 11%)', mb: 2, fontSize: '0.875rem' }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={preferences.inApp}
                onChange={(e) => handlePreferenceChange('inApp', e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: 'hsl(221, 83%, 53%)',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: 'hsl(221, 83%, 53%)',
                  },
                }}
              />
            }
            label="In-App Notifications"
            sx={{ color: 'hsl(222, 47%, 11%)', fontSize: '0.875rem' }}
          />
        </CardContent>
      </Card>

      <Card
        sx={{
          background: '#ffffff',
          border: '1px solid hsl(214, 32%, 91%)',
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Tabs value={tab} onChange={(e, v) => setTab(v)}>
              <Tab label="All" />
              <Tab label="Unread" />
            </Tabs>
            {tab === 1 && notifications.filter(n => !n.read).length > 0 && (
              <Chip
                label="Mark All Read"
                onClick={handleMarkAllAsRead}
                clickable
                sx={{
                  background: 'hsla(221, 83%, 53%, 0.1)',
                  color: 'hsl(221, 83%, 53%)',
                  border: '1px solid hsl(221, 83%, 53%)',
                }}
              />
            )}
          </Box>

          <List>
            {notifications.filter(n => tab === 1 ? !n.read : true).length === 0 ? (
              <ListItem>
                <ListItemText 
                  primary="No notifications found" 
                  sx={{ color: 'hsl(222, 20%, 40%)' }}
                />
              </ListItem>
            ) : (
              notifications.filter(n => tab === 1 ? !n.read : true).map((notification) => (
                <ListItem
                  key={notification.notificationId || notification.id}
                  sx={{
                    bgcolor: notification.read ? 'transparent' : 'hsla(221, 83%, 53%, 0.05)',
                    borderLeft: notification.read ? 'none' : '4px solid',
                    borderColor: 'hsl(221, 83%, 53%)',
                    mb: 1,
                    borderRadius: 1,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {notification.read ? (
                      <ReadIcon size={18} style={{ color: 'hsl(222, 20%, 60%)' }} />
                    ) : (
                      <UnreadIcon size={18} style={{ color: 'hsl(221, 83%, 53%)' }} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={notification.title || notification.subject}
                    secondary={
                      <>
                        <Typography variant="body2" component="span" sx={{ color: 'hsl(222, 47%, 11%)' }}>
                          {notification.message || notification.body}
                        </Typography>
                        <br />
                        <Typography variant="caption" sx={{ color: 'hsl(222, 20%, 40%)' }}>
                          {notification.timestamp
                            ? new Date(notification.timestamp).toLocaleString()
                            : '-'}
                        </Typography>
                      </>
                    }
                  />
                  {!notification.read && (
                    <IconButton
                      size="small"
                      onClick={() => handleMarkAsRead(notification.id)}
                      sx={{
                        color: 'hsl(221, 83%, 53%)',
                        '&:hover': {
                          background: 'hsla(221, 83%, 53%, 0.1)',
                        },
                      }}
                    >
                      <ReadIcon size={18} />
                    </IconButton>
                  )}
                </ListItem>
              ))
            )}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}

function generateMockNotifications() {
  const notifications = [
    {
      id: 'notif-1',
      title: 'Trade Settlement Completed',
      message: 'TRD-000123 settled successfully for 10,000 units of ZENITHBANK',
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
      read: false,
    },
    {
      id: 'notif-2',
      title: 'New Corporate Action',
      message: 'Dividend announcement for DANGCEM - Ex-date: 2024-02-15',
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
      read: false,
    },
    {
      id: 'notif-3',
      title: 'Monthly Statement Available',
      message: 'January 2024 statement is ready for download',
      timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
      read: true,
    },
    {
      id: 'notif-4',
      title: 'Instruction Approved',
      message: 'INS-004567 approved and queued for execution',
      timestamp: new Date(Date.now() - 8 * 3600000).toISOString(),
      read: true,
    },
    {
      id: 'notif-5',
      title: 'Portfolio Valuation Updated',
      message: 'Portfolio value updated: NGN 8.5B (+2.3%)',
      timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
      read: true,
    },
  ];
  return notifications;
}

function generateSingleNotification() {
  const titles = [
    'New Trade Confirmation',
    'Corporate Action Reminder',
    'Statement Generated',
    'Instruction Status Update',
    'Market Alert',
  ];
  const messages = [
    'A new trade has been confirmed in your portfolio',
    'Corporate action deadline approaching',
    'Your monthly statement is ready',
    'Your instruction status has been updated',
    'Market movement detected in your holdings',
  ];
  const idx = Math.floor(Math.random() * titles.length);
  return {
    id: `notif-${Date.now()}`,
    title: titles[idx],
    message: messages[idx],
    timestamp: new Date().toISOString(),
    read: false,
  };
}

