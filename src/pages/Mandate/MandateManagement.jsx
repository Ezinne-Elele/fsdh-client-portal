import React, { useState, useEffect } from 'react';
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
import { Upload as UploadIcon, Eye as ViewIcon } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export default function MandateManagement() {
  const { user } = useAuth();
  const [mandates, setMandates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMandates();
  }, []);

  const fetchMandates = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/mandates', {
        params: { clientId: user?.userId },
      });
      setMandates(response.data.mandates || response.data || []);
    } catch (err) {
      setError('Failed to load mandates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = () => {
    // File upload functionality
    alert('Upload mandate - File upload dialog will open');
  };

  if (loading && mandates.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Mandate & Signature Management</Typography>
        <Button
          variant="contained"
          startIcon={<UploadIcon size={18} />}
          onClick={handleUpload}
        >
          Upload Mandate
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Mandates
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mandate ID</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Version</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Uploaded</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mandates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No mandates found
                    </TableCell>
                  </TableRow>
                ) : (
                  mandates.map((mandate) => (
                    <TableRow key={mandate.mandateId || mandate.id}>
                      <TableCell>{mandate.mandateId || mandate.id}</TableCell>
                      <TableCell>{mandate.type || 'Trading Mandate'}</TableCell>
                      <TableCell>{mandate.version || '1.0'}</TableCell>
                      <TableCell>
                        <Chip
                          label={mandate.status || 'pending'}
                          color={
                            mandate.status === 'approved'
                              ? 'success'
                              : mandate.status === 'rejected'
                              ? 'error'
                              : 'warning'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {mandate.uploadedAt
                          ? new Date(mandate.uploadedAt).toLocaleDateString()
                          : '-'}
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          size="small"
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
    </Box>
  );
}

