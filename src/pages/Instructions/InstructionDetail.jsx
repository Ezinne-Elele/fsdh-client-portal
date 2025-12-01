import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Paper,
} from '@mui/material';
import { ArrowLeft as BackIcon } from 'lucide-react';

const steps = ['Draft', 'Submitted', 'Pending Approval', 'Approved', 'Completed'];

export default function InstructionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [instruction, setInstruction] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockInstruction = generateMockInstruction(id);
      const mockLogs = generateMockAuditLogs(id);
      setInstruction(mockInstruction);
      setAuditLogs(mockLogs);
      setLoading(false);
    }, 300);
    
    // Simulate status updates
    const interval = setInterval(() => {
      setInstruction(prev => {
        if (!prev) return prev;
        if (prev.status === 'pending' && Math.random() > 0.7) {
          return { ...prev, status: 'approved' };
        }
        if (prev.status === 'approved' && Math.random() > 0.8) {
          return { ...prev, status: 'completed' };
        }
        return prev;
      });
    }, 15000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !instruction) {
    return <Alert severity="error">{error || 'Instruction not found'}</Alert>;
  }

  const getActiveStep = () => {
    const statusMap = {
      draft: 0,
      submitted: 1,
      pending: 2,
      approved: 3,
      completed: 4,
    };
    return statusMap[instruction.status] || 0;
  };

  return (
    <Box>
      <Button
        startIcon={<BackIcon size={18} />}
        onClick={() => navigate('/instructions')}
        sx={{ 
          mb: 2,
          color: 'hsl(222, 47%, 11%)',
        }}
      >
        Back to Instructions
      </Button>

      <Typography variant="h4" gutterBottom>
        Instruction Details
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Status
              </Typography>
              <Stepper activeStep={getActiveStep()} sx={{ mb: 3 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Instruction ID
                  </Typography>
                  <Typography variant="body1">{instruction.instructionId || instruction.id}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Type
                  </Typography>
                  <Typography variant="body1">{instruction.type || 'Trade'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    ISIN
                  </Typography>
                  <Typography variant="body1">{instruction.isin || '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Quantity
                  </Typography>
                  <Typography variant="body1">{instruction.quantity || '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Price
                  </Typography>
                  <Typography variant="body1">
                    {instruction.price ? `NGN ${instruction.price.toLocaleString()}` : '-'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip label={instruction.status || 'draft'} size="small" />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Audit Trail
              </Typography>
              <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                {auditLogs.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No audit logs available
                  </Typography>
                ) : (
                  auditLogs.map((log, index) => (
                    <Paper key={index} sx={{ p: 1, mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {log.timestamp ? new Date(log.timestamp).toLocaleString() : '-'}
                      </Typography>
                      <Typography variant="body2">{log.action || log.description}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        By: {log.userId || 'System'}
                      </Typography>
                    </Paper>
                  ))
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

function generateMockInstruction(id) {
  const statuses = ['draft', 'submitted', 'pending', 'approved', 'completed'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  return {
    id,
    instructionId: id,
    type: 'buy',
    isin: 'NG000123456',
    quantity: 10000,
    price: 35.50,
    status,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  };
}

function generateMockAuditLogs(instructionId) {
  return [
    {
      action: 'Instruction created',
      description: `Instruction ${instructionId} was created`,
      timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
      userId: 'CLIENT-001',
    },
    {
      action: 'Instruction submitted',
      description: `Instruction ${instructionId} was submitted for approval`,
      timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
      userId: 'CLIENT-001',
    },
    {
      action: 'Under review',
      description: `Instruction ${instructionId} is under review by operations team`,
      timestamp: new Date(Date.now() - 12 * 3600000).toISOString(),
      userId: 'SYSTEM',
    },
  ];
}

