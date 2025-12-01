import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Chip,
  Grid,
} from '@mui/material';
import { Download as DownloadIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Statements() {
  const { user } = useAuth();
  const [statements, setStatements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setStatements(generateMockStatements(startDate, endDate));
      setLoading(false);
    }, 300);
  }, [startDate, endDate]);

  const handleDownload = (statementId, format = 'pdf') => {
    // Mock download - simulate file generation
    const mockContent = `Statement ${statementId}\nGenerated on ${new Date().toLocaleDateString()}\n\nThis is a mock statement file.`;
    const blob = new Blob([mockContent], { type: format === 'pdf' ? 'application/pdf' : 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `statement-${statementId}.${format}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    alert(`Statement ${statementId} downloaded successfully!`);
  };

  if (loading && statements.length === 0) {
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
        Statements & Reports
      </Typography>

      <Card 
        sx={{ 
          mb: 3,
          background: '#ffffff',
          border: '1px solid hsl(214, 32%, 91%)',
        }}
      >
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                type="date"
                label="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                type="date"
                label="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button 
                variant="contained" 
                onClick={fetchStatements} 
                fullWidth
                sx={{
                  background: 'hsl(221, 83%, 53%)',
                  boxShadow: 'none',
                  '&:hover': {
                    background: 'hsl(221, 83%, 48%)',
                  },
                }}
              >
                Filter
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            background: 'rgba(239, 68, 68, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
          }}
        >
          {error}
        </Alert>
      )}

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
            Statements
          </Typography>
          <TableContainer 
            component={Paper} 
            sx={{
              background: '#ffffff',
              border: '1px solid hsl(214, 32%, 91%)',
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                    Statement ID
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                    Type
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                    Period
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                    Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {statements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ color: 'hsl(222, 20%, 40%)', py: 3 }}>
                      No statements found
                    </TableCell>
                  </TableRow>
                ) : (
                  statements.map((statement) => (
                    <TableRow 
                      key={statement.statementId || statement.id}
                      sx={{
                        '&:hover': {
                          background: 'hsl(210, 40%, 98%)',
                        },
                      }}
                    >
                      <TableCell sx={{ color: 'hsl(222, 47%, 11%)', fontFamily: '"Space Grotesk", sans-serif' }}>
                        {statement.statementId || statement.id}
                      </TableCell>
                      <TableCell sx={{ color: 'hsl(222, 47%, 11%)' }}>
                        {statement.type || 'Monthly'}
                      </TableCell>
                      <TableCell sx={{ color: 'hsl(222, 47%, 11%)', fontSize: '0.875rem' }}>
                        {statement.period
                          ? `${new Date(statement.period.startDate).toLocaleDateString()} - ${new Date(statement.period.endDate).toLocaleDateString()}`
                          : '-'}
                      </TableCell>
                      <TableCell sx={{ color: 'hsl(222, 47%, 11%)', fontSize: '0.875rem' }}>
                        {statement.date
                          ? new Date(statement.date).toLocaleDateString()
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={statement.status || 'available'}
                          color={statement.status === 'available' ? 'success' : 'default'}
                          size="small"
                          sx={{
                            background: statement.status === 'available' 
                              ? 'hsla(142, 52%, 45%, 0.1)'
                              : 'hsla(221, 83%, 53%, 0.1)',
                            color: statement.status === 'available' 
                              ? 'hsl(142, 52%, 45%)'
                              : 'hsl(221, 83%, 53%)',
                            fontWeight: 500,
                            fontSize: '0.75rem',
                            height: 24,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleDownload(statement.statementId || statement.id, 'pdf')}
                          sx={{
                            color: 'hsl(221, 83%, 53%)',
                            '&:hover': {
                              background: 'hsla(221, 83%, 53%, 0.1)',
                            },
                          }}
                        >
                          <DownloadIcon size={18} />
                        </IconButton>
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

function generateMockStatements(startDate, endDate) {
  const types = ['Monthly', 'Quarterly', 'Annual', 'Transaction'];
  const today = new Date();
  
  return Array.from({ length: 12 }, (_, idx) => {
    const statementDate = new Date(today);
    statementDate.setMonth(statementDate.getMonth() - idx);
    const start = new Date(statementDate.getFullYear(), statementDate.getMonth(), 1);
    const end = new Date(statementDate.getFullYear(), statementDate.getMonth() + 1, 0);
    
    return {
      id: `STMT-${202400 + idx}`,
      statementId: `STMT-${202400 + idx}`,
      type: types[idx % types.length],
      period: {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      },
      date: statementDate.toISOString(),
      status: idx < 3 ? 'available' : 'pending',
    };
  }).filter(stmt => {
    if (!startDate && !endDate) return true;
    const stmtDate = new Date(stmt.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    if (start && stmtDate < start) return false;
    if (end && stmtDate > end) return false;
    return true;
  });
}
