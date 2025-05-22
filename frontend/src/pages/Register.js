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
  Alert
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const theme = createTheme();

export default function Register() {
  // Form state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('vehicle'); // Default role is vehicle owner
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate();

  // Basic form validation
  const validateForm = () => {
    if (!username || !email || !password || !confirmPassword || !fullName) {
      setMessage('All fields are required');
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
          
          // Redirect to login after 2 seconds
          setTimeout(() => {
            navigate('/login');
          }, 2000);
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

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Paper elevation={6} sx={{ marginY: 8, p: { xs: 2, md: 4 } }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
              <PersonAddIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            
            {message && (
              <Alert 
                severity={successful ? "success" : "error"} 
                sx={{ mt: 2, width: '100%' }}
              >
                {message}
              </Alert>
            )}
            
            <Box component="form" noValidate onSubmit={handleRegister} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
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
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="role-label">Account Type</InputLabel>
                    <Select
                      labelId="role-label"
                      id="role"
                      value={role}
                      label="Account Type"
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <MenuItem value="vehicle">Vehicle Owner</MenuItem>
                      <MenuItem value="station">Fuel Station Owner</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading ? "Processing..." : "Sign Up"}
              </Button>
              <Grid container justifyContent="center">
                <Grid item>
                  <Link href="/login" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}