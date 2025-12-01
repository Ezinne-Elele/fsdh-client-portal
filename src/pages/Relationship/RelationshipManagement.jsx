import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Alert,
} from '@mui/material';
import { Send as SendIcon } from 'lucide-react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import api from '../../services/api';

const validationSchema = yup.object({
  subject: yup.string().required('Subject is required'),
  message: yup.string().required('Message is required'),
  category: yup.string().required('Category is required'),
});

export default function RelationshipManagement() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      subject: '',
      message: '',
      category: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setError('');
        await api.post('/api/relationship/feedback', values);
        setSuccess(true);
        formik.resetForm();
        setTimeout(() => setSuccess(false), 5000);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to submit feedback');
      }
    },
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Relationship Management & Feedback
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Feedback submitted successfully. We'll get back to you soon.
        </Alert>
      )}

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Submit Feedback
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="category"
                  name="category"
                  label="Category"
                  select
                  SelectProps={{ native: true }}
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  error={formik.touched.category && Boolean(formik.errors.category)}
                  helperText={formik.touched.category && formik.errors.category}
                >
                  <option value="">Select category</option>
                  <option value="general">General Inquiry</option>
                  <option value="complaint">Complaint</option>
                  <option value="suggestion">Suggestion</option>
                  <option value="support">Support Request</option>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="subject"
                  name="subject"
                  label="Subject"
                  value={formik.values.subject}
                  onChange={formik.handleChange}
                  error={formik.touched.subject && Boolean(formik.errors.subject)}
                  helperText={formik.touched.subject && formik.errors.subject}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="message"
                  name="message"
                  label="Message"
                  multiline
                  rows={6}
                  value={formik.values.message}
                  onChange={formik.handleChange}
                  error={formik.touched.message && Boolean(formik.errors.message)}
                  helperText={formik.touched.message && formik.errors.message}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SendIcon size={18} />}
                  disabled={formik.isSubmitting}
                >
                  Submit Feedback
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

