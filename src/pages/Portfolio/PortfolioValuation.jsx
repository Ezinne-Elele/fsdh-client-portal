import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { Download as DownloadIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import PortfolioChart from '../../components/Charts/PortfolioChart';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function PortfolioValuation() {
  const { user } = useAuth();
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockData = generateMockHoldings(filterDate);
      setHoldings(mockData);
      const total = mockData.reduce((sum, h) => sum + (h.value || 0), 0);
      setTotalValue(total);
      setLoading(false);
    }, 300);
    
    const interval = setInterval(() => {
      const mockData = generateMockHoldings(filterDate);
      setHoldings(mockData);
      const total = mockData.reduce((sum, h) => sum + (h.value || 0), 0);
      setTotalValue(total);
    }, 30000);
    return () => clearInterval(interval);
  }, [filterDate]);

  const handleExport = () => {
    // Mock export - simulate file download
    const csvContent = [
      ['ISIN', 'Instrument Name', 'Quantity', 'Price', 'Value'],
      ...holdings.map(h => [
        h.isin || '-',
        h.instrumentName || '-',
        h.quantity?.toLocaleString() || '0',
        h.price?.toLocaleString() || '0',
        h.value?.toLocaleString() || '0',
      ]),
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-valuation-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (loading && holdings.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  // Mock historical data for chart
  const historicalData = [
    { date: 'Jan', value: totalValue * 0.9 },
    { date: 'Feb', value: totalValue * 0.95 },
    { date: 'Mar', value: totalValue * 1.0 },
    { date: 'Apr', value: totalValue * 1.05 },
    { date: 'May', value: totalValue * 1.02 },
    { date: 'Jun', value: totalValue },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography 
          variant="h4"
          sx={{
            fontFamily: '"Space Grotesk", sans-serif',
            color: 'hsl(222, 47%, 11%)',
            fontWeight: 700,
          }}
        >
          Portfolio Valuation
        </Typography>
        <Box>
          <TextField
            type="date"
            label="Filter by Date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ 
              mr: 2,
              '& .MuiOutlinedInput-root': {
                background: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          />
          <Button
            variant="outlined"
            startIcon={<DownloadIcon size={18} />}
            onClick={handleExport}
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: '#ffffff',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
                background: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Export
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              background: '#ffffff',
              border: '1px solid hsl(214, 32%, 91%)',
            }}
          >
            <CardContent sx={{ py: 2 }}>
              <Typography 
                variant="body2" 
                gutterBottom
                sx={{ 
                  color: 'hsl(222, 20%, 40%)',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  mb: 0.5,
                }}
              >
                Total Portfolio Value
              </Typography>
              <Typography 
                variant="h4"
                sx={{ 
                  fontFamily: '"Space Grotesk", sans-serif',
                  color: 'hsl(222, 47%, 11%)', 
                  fontWeight: 700,
                  fontSize: '1.5rem',
                }}
              >
                NGN {totalValue.toLocaleString()}
              </Typography>
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
            <CardContent sx={{ py: 2 }}>
              <Typography 
                variant="body2" 
                gutterBottom
                sx={{ 
                  color: 'hsl(222, 20%, 40%)',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  mb: 0.5,
                }}
              >
                Total Holdings
              </Typography>
              <Typography 
                variant="h4"
                sx={{ 
                  fontFamily: '"Space Grotesk", sans-serif',
                  color: 'hsl(222, 47%, 11%)', 
                  fontWeight: 700,
                  fontSize: '1.5rem',
                }}
              >
                {holdings.length}
              </Typography>
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
          <CardContent sx={{ py: 2 }}>
            <Typography 
              variant="body2" 
              gutterBottom
              sx={{ 
                color: 'hsl(222, 20%, 40%)',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                mb: 0.5,
              }}
            >
              P&L (Estimated)
            </Typography>
            <Typography 
              variant="h4"
              sx={{ 
                fontFamily: '"Space Grotesk", sans-serif',
                color: 'hsl(142, 52%, 45%)', 
                fontWeight: 700,
                fontSize: '1.5rem',
              }}
            >
                +{(totalValue * 0.05).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Portfolio Allocation
              </Typography>
              <PortfolioChart data={holdings} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Value Trend
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" name="Portfolio Value" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Holdings Details
          </Typography>
          <TableContainer 
            component={Paper} 
            sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600 }}>
                    ISIN
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600 }}>
                    Instrument Name
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600 }}>
                    Quantity
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600 }}>
                    Price
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600 }}>
                    Value
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {holdings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      No holdings found
                    </TableCell>
                  </TableRow>
                ) : (
                  holdings.map((holding, index) => (
                    <TableRow 
                      key={index}
                      sx={{
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.05)',
                        },
                      }}
                    >
                      <TableCell sx={{ color: '#ffffff' }}>
                        {holding.isin || '-'}
                      </TableCell>
                      <TableCell sx={{ color: '#ffffff' }}>
                        {holding.instrumentName || '-'}
                      </TableCell>
                      <TableCell sx={{ color: '#ffffff' }}>
                        {holding.quantity?.toLocaleString() || '-'}
                      </TableCell>
                      <TableCell sx={{ color: '#ffffff' }}>
                        {holding.price ? `NGN ${holding.price.toLocaleString()}` : '-'}
                      </TableCell>
                      <TableCell sx={{ color: '#ffffff', fontWeight: 600 }}>
                        {holding.value ? `NGN ${holding.value.toLocaleString()}` : '-'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}

function generateMockHoldings(filterDate) {
  const instruments = [
    { symbol: 'ZENITHBANK', name: 'Zenith Bank Plc', basePrice: 35 },
    { symbol: 'GTCO', name: 'Guaranty Trust Holding Company', basePrice: 28 },
    { symbol: 'DANGCEM', name: 'Dangote Cement Plc', basePrice: 320 },
    { symbol: 'UBA', name: 'United Bank for Africa Plc', basePrice: 22 },
    { symbol: 'MTNN', name: 'MTN Nigeria Communications Plc', basePrice: 245 },
    { symbol: 'WAPCO', name: 'Lafarge Africa Plc', basePrice: 28 },
    { symbol: 'ACCESS', name: 'Access Bank Plc', basePrice: 18 },
    { symbol: 'FBNH', name: 'FBN Holdings Plc', basePrice: 20 },
  ];

  return instruments.map((inst, idx) => {
    const quantity = Math.floor(Math.random() * 1000000) + 500000;
    const price = inst.basePrice + (Math.random() * 5 - 2.5);
    const value = quantity * price;
    
    return {
      isin: `NG${(100000 + idx * 137).toString().padStart(6, '0')}`,
      instrumentName: inst.name,
      quantity,
      price: Math.round(price * 100) / 100,
      value: Math.round(value),
    };
  });
}

