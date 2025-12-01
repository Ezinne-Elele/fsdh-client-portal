import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  alpha,
} from '@mui/material';
import { Building2 as AccountBalance } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      
      if (data.requiresMFA) {
        navigate('/mfa-verify', { state: { userId: data.user.userId } });
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'hsl(210, 40%, 98%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(30, 58, 138, 0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          animation: 'move 20s linear infinite',
          '@keyframes move': {
            '0%': { transform: 'translate(0, 0)' },
            '100%': { transform: 'translate(50px, 50px)' },
          },
        },
      }}
    >
      <Container component="main" maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: 5,
            width: '100%',
          background: '#ffffff',
          border: '1px solid hsl(214, 32%, 91%)',
          borderRadius: 8,
          boxShadow: 'none',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <AccountBalance 
              size={48}
              style={{ 
                color: 'hsl(221, 83%, 53%)',
                marginBottom: 16,
              }} 
            />
            <Typography 
              component="h1" 
              variant="h4" 
              sx={{ 
                fontFamily: '"Space Grotesk", sans-serif',
                color: 'hsl(222, 47%, 11%)',
                fontWeight: 700,
                mb: 1,
                letterSpacing: '-0.01em',
              }}
            >
              FSDH Client Portal
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'hsl(222, 20%, 40%)',
              }}
            >
              Sign in to your account
            </Typography>
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

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 2,
                mb: 2,
                py: 1.25,
                background: 'hsl(221, 83%, 53%)',
                boxShadow: 'none',
                '&:hover': {
                  background: 'hsl(221, 83%, 48%)',
                },
                '&:disabled': {
                  background: 'hsl(221, 83%, 80%)',
                },
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/password-reset')}
                sx={{
                  color: 'hsl(221, 83%, 53%)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Forgot password?
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

