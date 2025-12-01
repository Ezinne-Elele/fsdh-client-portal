import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Plus as AddIcon, Eye as ViewIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
} from '@mui/material';

const statusColors = {
  draft: 'default',
  submitted: 'info',
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
  completed: 'success',
};

export default function Instructions() {
  const [instructions, setInstructions] = useState(() => generateMockInstructions());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'buy',
    isin: '',
    quantity: '',
    price: '',
    settlementDate: '',
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      setInstructions(prev => prev.map(inst => {
        // Simulate status updates
        if (inst.status === 'pending' && Math.random() > 0.7) {
          return { ...inst, status: 'approved' };
        }
        if (inst.status === 'approved' && Math.random() > 0.8) {
          return { ...inst, status: 'completed' };
        }
        return inst;
      }));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.isin || !formData.quantity) {
      alert('Please fill in ISIN and Quantity');
      return;
    }
    
    const newInstruction = {
      id: `INS-${Math.floor(Math.random() * 90000) + 10000}`,
      instructionId: `INS-${Math.floor(Math.random() * 90000) + 10000}`,
      type: formData.type,
      isin: formData.isin,
      quantity: parseInt(formData.quantity),
      price: formData.price ? parseFloat(formData.price) : null,
      settlementDate: formData.settlementDate || null,
      status: 'draft',
      createdAt: new Date().toISOString(),
    };
    
    setInstructions(prev => [newInstruction, ...prev]);
    setFormOpen(false);
    setFormData({ type: 'buy', isin: '', quantity: '', price: '', settlementDate: '' });
    alert(`Instruction ${newInstruction.instructionId} created successfully!`);
  };

  if (loading && instructions.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

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
          Instructions
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon size={18} />}
          onClick={() => setFormOpen(true)}
          sx={{
            background: 'hsl(221, 83%, 53%)',
            boxShadow: 'none',
            '&:hover': {
              background: 'hsl(221, 83%, 48%)',
            },
          }}
        >
          New Instruction
        </Button>
      </Box>

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
                    Instruction ID
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                    Type
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                    ISIN
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                    Quantity
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                    Created
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {instructions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ color: 'hsl(222, 20%, 40%)', py: 3 }}>
                      No instructions found
                    </TableCell>
                  </TableRow>
                ) : (
                  instructions.map((instruction) => (
                    <TableRow 
                      key={instruction.instructionId || instruction.id}
                      sx={{
                        '&:hover': {
                          background: 'hsl(210, 40%, 98%)',
                        },
                      }}
                    >
                      <TableCell sx={{ color: 'hsl(222, 47%, 11%)', fontFamily: '"Space Grotesk", sans-serif' }}>
                        {instruction.instructionId || instruction.id}
                      </TableCell>
                      <TableCell sx={{ color: 'hsl(222, 47%, 11%)' }}>
                        {instruction.type || 'Trade'}
                      </TableCell>
                      <TableCell sx={{ color: 'hsl(222, 47%, 11%)', fontFamily: '"Space Grotesk", sans-serif' }}>
                        {instruction.isin || '-'}
                      </TableCell>
                      <TableCell sx={{ color: 'hsl(222, 47%, 11%)', fontFamily: '"Space Grotesk", sans-serif' }}>
                        {instruction.quantity || '-'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={instruction.status || 'draft'}
                          color={statusColors[instruction.status] || 'default'}
                          size="small"
                          sx={{
                            background: statusColors[instruction.status] === 'success' 
                              ? 'hsla(142, 52%, 45%, 0.1)'
                              : statusColors[instruction.status] === 'warning'
                              ? 'hsla(38, 92%, 50%, 0.1)'
                              : statusColors[instruction.status] === 'error'
                              ? 'hsla(0, 65%, 55%, 0.1)'
                              : 'hsla(221, 83%, 53%, 0.1)',
                            color: statusColors[instruction.status] === 'success' 
                              ? 'hsl(142, 52%, 45%)'
                              : statusColors[instruction.status] === 'warning'
                              ? 'hsl(38, 92%, 50%)'
                              : statusColors[instruction.status] === 'error'
                              ? 'hsl(0, 65%, 55%)'
                              : 'hsl(221, 83%, 53%)',
                            fontWeight: 500,
                            fontSize: '0.75rem',
                            height: 24,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: 'hsl(222, 47%, 11%)', fontSize: '0.875rem' }}>
                        {instruction.createdAt
                          ? new Date(instruction.createdAt).toLocaleDateString()
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/instructions/${instruction.instructionId || instruction.id}`)}
                          sx={{
                            color: 'hsl(221, 83%, 53%)',
                            '&:hover': {
                              background: 'hsla(221, 83%, 53%, 0.1)',
                            },
                          }}
                        >
                          <ViewIcon size={18} />
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

      <Dialog open={formOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Instruction</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              select
              label="Instruction Type"
              value={formData.type}
              onChange={(e) => handleFormChange('type', e.target.value)}
              fullWidth
            >
              <MenuItem value="buy">Buy</MenuItem>
              <MenuItem value="sell">Sell</MenuItem>
              <MenuItem value="transfer">Transfer</MenuItem>
            </TextField>
            <TextField
              label="ISIN"
              value={formData.isin}
              onChange={(e) => handleFormChange('isin', e.target.value)}
              placeholder="NG000123456"
              fullWidth
              required
            />
            <TextField
              label="Quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => handleFormChange('quantity', e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Price (Optional)"
              type="number"
              value={formData.price}
              onChange={(e) => handleFormChange('price', e.target.value)}
              fullWidth
            />
            <TextField
              label="Settlement Date (Optional)"
              type="date"
              value={formData.settlementDate}
              onChange={(e) => handleFormChange('settlementDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Submit Instruction
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function generateMockInstructions() {
  const statuses = ['draft', 'submitted', 'pending', 'approved', 'completed'];
  const types = ['buy', 'sell', 'transfer'];
  const isins = ['NG000123456', 'NG000234567', 'NG000345678', 'NG000456789'];
  
  return Array.from({ length: 8 }, (_, idx) => ({
    id: `INS-${10000 + idx}`,
    instructionId: `INS-${10000 + idx}`,
    type: types[idx % types.length],
    isin: isins[idx % isins.length],
    quantity: Math.floor(Math.random() * 100000) + 10000,
    price: Math.floor(Math.random() * 50) + 20,
    status: statuses[Math.min(idx % statuses.length, 3)],
    createdAt: new Date(Date.now() - idx * 86400000).toISOString(),
  }));
}

