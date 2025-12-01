import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Divider,
} from '@mui/material';
import { Save as SaveIcon } from 'lucide-react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { clientService } from '../../services/clientService';

const validationSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  address: yup.string().required('Address is required'),
});

export default function AccountManagement() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [clientData, setClientData] = useState(null);

  useEffect(() => {
    fetchClientData();
  }, []);

  const fetchClientData = async () => {
    try {
      setLoading(true);
      const clientId = user?.userId || 'CLIENT-001';
      const data = await clientService.getClient(clientId);
      setClientData(data);
      formik.setValues({
        email: data.kycData?.email || user?.email || '',
        phone: data.kycData?.phone || '',
        address: data.kycData?.address || '',
      });
    } catch (err) {
      setError('Failed to load account data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      phone: '',
      address: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setError('');
        setSuccess(false);
        const clientId = user?.userId || 'CLIENT-001';
        await clientService.updateClient(clientId, {
          kycData: {
            ...clientData?.kycData,
            ...values,
          },
        });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to update account');
      }
    },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Account Management
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Account updated successfully
        </Alert>
      )}

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Profile Information
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="firstName"
                  label="First Name"
                  value={user?.firstName || ''}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  value={user?.lastName || ''}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="phone"
                  name="phone"
                  label="Phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="address"
                  name="address"
                  label="Address"
                  multiline
                  rows={3}
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  error={formik.touched.address && Boolean(formik.errors.address)}
                  helperText={formik.touched.address && formik.errors.address}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon size={18} />}
                  disabled={formik.isSubmitting}
                >
                  Save Changes
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

