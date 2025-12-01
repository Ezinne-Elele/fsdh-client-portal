import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Building2 as AccountBalance,
  TrendingUp,
  FileText as Assignment,
  Bell as Notifications,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import PortfolioChart from '../../components/Charts/PortfolioChart';

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    portfolioValue: 0,
    totalHoldings: 0,
    pendingInstructions: 0,
    unreadNotifications: 0,
  });
  const [portfolioData, setPortfolioData] = useState([]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockData = generateMockDashboardData();
      setStats(mockData.stats);
      setPortfolioData(mockData.portfolioData);
      setLoading(false);
    }, 300);
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      const mockData = generateMockDashboardData();
      setStats(mockData.stats);
      setPortfolioData(mockData.portfolioData);
    }, 30000);
    return () => clearInterval(interval);
  }, [user]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const StatCard = ({ title, value, icon, color }) => (
    <Card
        sx={{
          background: '#ffffff',
          border: '1px solid hsl(214, 32%, 91%)',
          transition: 'all 0.2s ease',
          '&:hover': {
            border: '1px solid hsl(221, 83%, 53%)',
          },
        }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography 
              sx={{ 
                color: 'hsl(222, 20%, 40%)',
                fontWeight: 500,
                mb: 0.5,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }} 
              variant="body2"
            >
              {title}
            </Typography>
            <Typography 
              variant="h4" 
              component="div"
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                color: 'hsl(222, 47%, 11%)',
                fontWeight: 700,
                fontSize: '1.5rem',
              }}
            >
              {typeof value === 'number' && value >= 1000
                ? `NGN ${(value / 1000000).toFixed(2)}M`
                : typeof value === 'number'
                ? `NGN ${value.toLocaleString()}`
                : value}
            </Typography>
          </Box>
          <Box 
            sx={{ 
              color: 'hsl(221, 83%, 53%)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography 
        variant="h4" 
        gutterBottom
        sx={{
          fontFamily: '"Space Grotesk", sans-serif',
          color: 'hsl(222, 47%, 11%)',
          fontWeight: 700,
          mb: 0.5,
        }}
      >
        Dashboard
      </Typography>
      <Typography 
        variant="body2" 
        sx={{ 
          mb: 3,
          color: 'hsl(222, 20%, 40%)',
          fontSize: '0.875rem',
        }}
      >
        Welcome back, {user?.firstName || 'User'}
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Portfolio Value"
            value={stats.portfolioValue}
            icon={<AccountBalance size={32} />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Holdings"
            value={stats.totalHoldings}
            icon={<TrendingUp size={32} />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Instructions"
            value={stats.pendingInstructions}
            icon={<Assignment size={32} />}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Unread Notifications"
            value={stats.unreadNotifications}
            icon={<Notifications size={32} />}
            color="error.main"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card
            sx={{
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
                Portfolio Allocation
              </Typography>
              <PortfolioChart data={portfolioData} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
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
                Recent Activity
              </Typography>
              {generateRecentActivity().map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    borderBottom: '1px solid hsl(214, 32%, 91%)',
                    py: 1.5,
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'hsl(222, 47%, 11%)', mb: 0.5 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'hsl(222, 20%, 40%)', display: 'block' }}>
                    {item.description}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'hsl(222, 20%, 40%)', fontSize: '0.7rem' }}>
                    {item.timestamp}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

function generateMockDashboardData() {
  const instruments = ['ZENITHBANK', 'GTCO', 'DANGCEM', 'UBA', 'MTNN', 'WAPCO', 'ACCESS', 'FBNH'];
  const portfolioData = instruments.map((symbol, idx) => ({
    name: symbol,
    value: Math.floor(Math.random() * 500000000) + 200000000,
    quantity: Math.floor(Math.random() * 1000000) + 500000,
  }));

  const totalValue = portfolioData.reduce((sum, h) => sum + h.value, 0);

  return {
    stats: {
      portfolioValue: totalValue,
      totalHoldings: portfolioData.length,
      pendingInstructions: Math.floor(Math.random() * 5) + 2,
      unreadNotifications: Math.floor(Math.random() * 8) + 1,
    },
    portfolioData,
  };
}

function generateRecentActivity() {
  return [
    {
      title: 'Trade Settlement Completed',
      description: 'TRD-000123 settled successfully for 10,000 units of ZENITHBANK',
      timestamp: '2 minutes ago',
    },
    {
      title: 'New Corporate Action',
      description: 'Dividend announcement for DANGCEM - Ex-date: 2024-02-15',
      timestamp: '1 hour ago',
    },
    {
      title: 'Monthly Statement Available',
      description: 'January 2024 statement is ready for download',
      timestamp: '3 hours ago',
    },
    {
      title: 'Instruction Approved',
      description: 'INS-004567 approved and queued for execution',
      timestamp: '5 hours ago',
    },
    {
      title: 'Portfolio Valuation Updated',
      description: 'Portfolio value updated: NGN 8.5B (+2.3%)',
      timestamp: '1 day ago',
    },
  ];
}

