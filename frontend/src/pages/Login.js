import React, { useState } from 'react';
import { 
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Paper,
  Box,
  Grid,
  Typography,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import {
  LockOutlined as LockOutlinedIcon,
  LocalGasStation as GasStationIcon,
  DirectionsCar as CarIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Eco as EcoIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

// Use your existing theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Blue for primary actions
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#dc004e", // Red for alerts/warnings
    },
    success: {
      main: "#2e7d32", // Green for petrol/success states
      light: "#4caf50",
      dark: "#1b5e20",
    },
    warning: {
      main: "#ed6c02", // Orange for warnings
      light: "#ff9800",
      dark: "#e65100",
    },
    info: {
      main: "#0288d1", // Light blue for diesel/info
      light: "#03a9f4",
      dark: "#01579b",
    },
    error: {
      main: "#d32f2f", // Red for errors
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    // Customize Material-UI components
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // Don't uppercase button text
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    // Form validation
    if (!username || !password) {
      setMessage('Username and password are required');
      setLoading(false);
      return;
    }

    AuthService.login(username, password).then(
      () => {
        // Get user info
        const user = AuthService.getCurrentUser();
        
        // Redirect based on user role
        if (user.roles.includes('ROLE_ADMIN')) {
          navigate('/admin');
        } else if (user.roles.includes('ROLE_STATION_OWNER')) {
          navigate('/station');
        } else {
          navigate('/vehicle');
        }
      },
      error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setLoading(false);
        setMessage(resMessage || 'Invalid username or password');
      }
    );
  };

  const features = [
    {
      icon: <GasStationIcon sx={{ fontSize: 24, color: 'inherit' }} />,
      title: 'Station Management',
      description: 'Efficiently manage fuel stations',
      color: '#1976d2' // primary.main
    },
    {
      icon: <CarIcon sx={{ fontSize: 24, color: 'inherit' }} />,
      title: 'Vehicle Tracking',
      description: 'Monitor vehicle fuel consumption',
      color: '#2e7d32' // success.main
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 24, color: 'inherit' }} />,
      title: 'Secure Access',
      description: 'Role-based access control',
      color: '#0288d1' // info.main
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 24, color: 'inherit' }} />,
      title: 'Analytics',
      description: 'Comprehensive reporting',
      color: '#ed6c02' // warning.main
    }
  ];

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        
        {/* Left side - Brand and Features */}
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', // Using your primary colors
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            p: 3,
            position: 'relative',
            overflow: 'hidden',
            height: '100vh',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.1)',
              zIndex: 1
            }
          }}
        >
          {/* Decorative elements using your theme colors */}
          <Box
            sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: 'rgba(66,165,245,0.2)', // primary.light with opacity
              zIndex: 1
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -30,
              left: -30,
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'rgba(21,101,192,0.1)', // primary.dark with opacity
              zIndex: 1
            }}
          />

          <Box sx={{ zIndex: 2, textAlign: 'center', maxWidth: 450, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {/* Logo and Brand */}
            <Box sx={{ mb: 2.5 }}>
              <Avatar
                sx={{
                  width: 50,
                  height: 50,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  mb: 1,
                  mx: 'auto',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <GasStationIcon sx={{ fontSize: 26 }} />
              </Avatar>
              <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 0.3, lineHeight: 1.2 }}>
                Fuel Quota Management
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, mb: 1.5, fontSize: '0.9rem' }}>
                Streamline fuel distribution and quota management
              </Typography>
            </Box>

            {/* Features Grid - Using your theme colors */}
            <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
              {features.map((feature, index) => (
                <Grid item xs={6} key={index}>
                  <Card 
                    sx={{ 
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: 'white',
                      height: 100,
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        background: 'rgba(255,255,255,0.15)'
                      }
                    }}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <Box sx={{ mb: 0.3, color: feature.color }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 0.3, fontSize: '0.7rem', lineHeight: 1.1 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8, lineHeight: 1.1, fontSize: '0.6rem' }}>
                        {feature.description.split(' ').slice(0, 5).join(' ')}...
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Stats */}
            <Box sx={{ display: 'flex', justifyContent: 'space-around', opacity: 0.9 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1 }}>500+</Typography>
                <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Stations</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1 }}>10K+</Typography>
                <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Vehicles</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1 }}>99.9%</Typography>
                <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Uptime</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Right side - Login form */}
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100vh',
              px: 4,
              py: 2,
              overflow: 'hidden' // Prevent scroll
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                maxWidth: 420
              }}
            >
              <Avatar sx={{ mb: 2, bgcolor: 'primary.main', width: 56, height: 56 }}>
                <LockOutlinedIcon sx={{ fontSize: 28 }} />
              </Avatar>
              
              <Typography component="h1" variant="h4" sx={{ mb: 1, fontWeight: 'bold', textAlign: 'center' }}>
                Welcome Back
              </Typography>
              
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                Please sign in to your account to continue
              </Typography>

              <Box component="form" noValidate onSubmit={handleLogin} sx={{ width: '100%' }}>
                {message && (
                  <Alert severity="error" sx={{ mb: 2, fontSize: '0.9rem' }}>
                    {message}
                  </Alert>
                )}
                
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  sx={{ mb: 2 }}
                  size="medium"
                  InputProps={{
                    style: { fontSize: '1rem' }
                  }}
                  InputLabelProps={{
                    style: { fontSize: '1rem' }
                  }}
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
                  sx={{ mb: 2.5 }}
                  size="medium"
                  InputProps={{
                    style: { fontSize: '1rem' }
                  }}
                  InputLabelProps={{
                    style: { fontSize: '1rem' }
                  }}
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ 
                    mt: 1, 
                    mb: 2.5,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    borderRadius: 2
                  }}
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
                
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Link href="/register" variant="body2" sx={{ textDecoration: 'none', fontSize: '0.95rem', color: 'primary.main' }}>
                    Don't have an account? <strong>Sign Up</strong>
                  </Link>
                </Box>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  align="center" 
                  sx={{ opacity: 0.7, fontSize: '0.8rem' }}
                >
                  © {new Date().getFullYear()} Fuel Quota Management System
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}