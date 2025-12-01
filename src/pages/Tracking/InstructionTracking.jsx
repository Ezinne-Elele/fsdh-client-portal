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
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { Download as DownloadIcon, Eye as ViewIcon } from 'lucide-react';
import { tradeService } from '../../services/tradeService';
import { auditService } from '../../services/auditService';
import { useAuth } from '../../contexts/AuthContext';

export default function InstructionTracking() {
  const { user } = useAuth();
  const [instructions, setInstructions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInstructions();
    const interval = setInterval(fetchInstructions, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchInstructions = async () => {
    try {
      setLoading(true);
      const response = await tradeService.getInstructions({ clientId: user?.userId });
      setInstructions(response.instructions || response.data || []);
    } catch (err) {
      setError('Failed to load instructions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (instructionId) => {
    try {
      const logs = await auditService.getInstructionAudit(instructionId);
      // Export functionality
      alert('Export audit trail - will generate PDF/CSV');
    } catch (err) {
      alert('Failed to export audit trail');
    }
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
      <Typography variant="h4" gutterBottom>
        Instruction Tracking & Audit Trail
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Instruction History
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Instruction ID</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Last Updated</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {instructions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No instructions found
                    </TableCell>
                  </TableRow>
                ) : (
                  instructions.map((instruction) => (
                    <TableRow key={instruction.instructionId || instruction.id}>
                      <TableCell>{instruction.instructionId || instruction.id}</TableCell>
                      <TableCell>{instruction.type || 'Trade'}</TableCell>
                      <TableCell>
                        <Chip
                          label={instruction.status || 'draft'}
                          size="small"
                          color={
                            instruction.status === 'completed'
                              ? 'success'
                              : instruction.status === 'rejected'
                              ? 'error'
                              : 'default'
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {instruction.createdAt
                          ? new Date(instruction.createdAt).toLocaleDateString()
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {instruction.updatedAt
                          ? new Date(instruction.updatedAt).toLocaleDateString()
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleExport(instruction.instructionId || instruction.id)}
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

