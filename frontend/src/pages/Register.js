import React, { useState } from 'react';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Card,
  CardContent,
  Chip,
  Stepper,
  Step,
  StepLabel,
  alpha
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  LocalGasStation as GasStationIcon,
  DirectionsCar as CarIcon,
  Store as StoreIcon,
  Security as SecurityIcon,
  AccountCircle as AccountIcon,
  ContactMail as ContactIcon,
  Badge as BadgeIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

// Use your existing theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#dc004e",
    },
    success: {
      main: "#2e7d32",
      light: "#4caf50",
      dark: "#1b5e20",
    },
    warning: {
      main: "#ed6c02",
      light: "#ff9800",
      dark: "#e65100",
    },
    info: {
      main: "#0288d1",
      light: "#03a9f4",
      dark: "#01579b",
    },
    error: {
      main: "#d32f2f",
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
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
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

export default function Register() {
  // Form state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('vehicle');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  
  const navigate = useNavigate();

  const steps = ['Account Type', 'Personal Info', 'Account Details'];

  const roleOptions = [
    {
      value: 'vehicle',
      title: 'Vehicle Owner',
      description: 'Register your vehicles and manage fuel quotas',
      icon: <CarIcon sx={{ fontSize: 32 }} />,
      color: '#1976d2',
      features: ['Vehicle Registration', 'QR Code Access', 'Quota Tracking', 'Transaction History']
    },
    {
      value: 'station',
      title: 'Fuel Station Owner',
      description: 'Manage your fuel station and serve customers',
      icon: <StoreIcon sx={{ fontSize: 32 }} />,
      color: '#2e7d32',
      features: ['Station Management', 'QR Code Scanner', 'Sales Analytics', 'Customer Service']
    }
  ];

  // Basic form validation
  const validateForm = () => {
    if (!username || !email || !password || !confirmPassword || !fullName) {
      setMessage('All required fields must be filled');
      return false;
    }
    
    if (username.length < 3 || username.length > 20) {
      setMessage('Username must be between 3 and 20 characters');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address');
      return false;
    }
    
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters');
      return false;
    }
    
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setMessage('');
    setSuccessful(false);
    setLoading(true);

    if (validateForm()) {
      AuthService.register(
        username,
        email,
        password,
        fullName,
        phoneNumber,
        role
      ).then(
        response => {
          setMessage(response.data.message);
          setSuccessful(true);
          setLoading(false);
          setActiveStep(3); // Show success step
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setMessage(resMessage);
          setSuccessful(false);
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && !role) {
      setMessage('Please select an account type');
      return;
    }
    setMessage('');
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setMessage('');
    setActiveStep((prevStep) => prevStep - 1);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom textAlign="center" sx={{ mb: 3 }}>
              Choose Your Account Type
            </Typography>
            <Grid container spacing={3}>
              {roleOptions.map((option) => (
                <Grid item xs={12} md={6} key={option.value}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: role === option.value ? `2px solid ${option.color}` : '2px solid transparent',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 3,
                      },
                      bgcolor: role === option.value ? alpha(option.color, 0.05) : 'background.paper'
                    }}
                    onClick={() => setRole(option.value)}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Box
                        sx={{
                          display: 'inline-flex',
                          p: 2,
                          borderRadius: 3,
                          bgcolor: alpha(option.color, 0.1),
                          color: option.color,
                          mb: 2
                        }}
                      >
                        {option.icon}
                      </Box>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {option.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {option.description}
                      </Typography>
                      <Box sx={{ textAlign: 'left' }}>
                        {option.features.map((feature, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <CheckIcon sx={{ color: 'success.main', fontSize: 16, mr: 1 }} />
                            <Typography variant="caption" color="text.secondary">
                              {feature}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                      {role === option.value && (
                        <Chip
                          label="Selected"
                          color="primary"
                          size="small"
                          sx={{ mt: 2 }}
                        />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );
      
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom textAlign="center" sx={{ mb: 3 }}>
              Personal Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="fullName"
                  required
                  fullWidth
                  id="fullName"
                  label="Full Name"
                  autoFocus
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  InputProps={{
                    startAdornment: <AccountIcon sx={{ color: 'text.secondary', mr: 1 }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="phoneNumber"
                  label="Phone Number"
                  type="tel"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+94771234567"
                  InputProps={{
                    startAdornment: <ContactIcon sx={{ color: 'text.secondary', mr: 1 }} />
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: <ContactIcon sx={{ color: 'text.secondary', mr: 1 }} />
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );
      
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom textAlign="center" sx={{ mb: 3 }}>
              Account Credentials
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  helperText="Choose a unique username (3-20 characters)"
                  InputProps={{
                    startAdornment: <BadgeIcon sx={{ color: 'text.secondary', mr: 1 }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  helperText="Minimum 6 characters"
                  InputProps={{
                    startAdornment: <SecurityIcon sx={{ color: 'text.secondary', mr: 1 }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  helperText="Re-enter your password"
                  InputProps={{
                    startAdornment: <SecurityIcon sx={{ color: 'text.secondary', mr: 1 }} />
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );
      
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${alpha('#1976d2', 0.05)} 0%, ${alpha('#42a5f5', 0.02)} 100%)`,
          py: 4
        }}
      >
        <CssBaseline />
        <Container component="main" maxWidth="md">
          <Paper elevation={8} sx={{ p: { xs: 3, md: 5 } }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
                <PersonAddIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography component="h1" variant="h4" fontWeight="bold" gutterBottom>
                Create Account
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Join our fuel quota management system today
              </Typography>
            </Box>

            {/* Success State */}
            {successful ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CheckIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                <Typography variant="h5" color="success.main" fontWeight="bold" gutterBottom>
                  Registration Successful!
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Your account has been created successfully. You will be redirected to the login page shortly.
                </Typography>
                <Alert severity="success" sx={{ maxWidth: 400, mx: 'auto' }}>
                  {message}
                </Alert>
              </Box>
            ) : (
              <>
                {/* Progress Stepper */}
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                {/* Error/Message Alert */}
                {message && !successful && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {message}
                  </Alert>
                )}

                {/* Form Content */}
                <Box component="form" noValidate onSubmit={handleRegister}>
                  {renderStepContent(activeStep)}

                  {/* Navigation Buttons */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      variant="outlined"
                      sx={{ px: 4 }}
                    >
                      Back
                    </Button>
                    
                    {activeStep === steps.length - 1 ? (
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{ px: 4 }}
                      >
                        {loading ? "Creating Account..." : "Create Account"}
                      </Button>
                    ) : (
                      <Button
                        onClick={handleNext}
                        variant="contained"
                        sx={{ px: 4 }}
                      >
                        Next
                      </Button>
                    )}
                  </Box>
                </Box>

                {/* Login Link */}
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Already have an account?{' '}
                    <Link href="/login" sx={{ color: 'primary.main', textDecoration: 'none', fontWeight: 'bold' }}>
                      Sign In
                    </Link>
                  </Typography>
                </Box>
              </>
            )}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}