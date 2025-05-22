// src/pages/VehicleRegistration.js
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Chip,
  Divider
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
  Search as SearchIcon,
  Check as CheckIcon,
  QrCode as QrCodeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { VehicleService } from '../services/ApiService';
import NotificationService from '../services/NotificationService';
import { ValidationUtils, FormatUtils, Constants } from '../utils';

const VehicleRegistration = () => {
  const navigate = useNavigate();
  
  // Stepper state
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Vehicle Details', 'DMT Validation', 'Registration Complete'];

  // Form state
  const [formData, setFormData] = useState({
    registrationNumber: '',
    chassisNumber: ''
  });

  // DMT validation state
  const [dmtData, setDmtData] = useState(null);
  const [validationLoading, setValidationLoading] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState(false);

  // UI state
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');

  // Handle input changes
  const handleInputChange = (field) => (event) => {
    const value = event.target.value.toUpperCase();
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    // Validate registration number
    const regValidation = ValidationUtils.validateRegistrationNumber(formData.registrationNumber);
    if (!regValidation.isValid) {
      newErrors.registrationNumber = regValidation.message;
    }

    // Validate chassis number
    const chassisValidation = ValidationUtils.validateChassisNumber(formData.chassisNumber);
    if (!chassisValidation.isValid) {
      newErrors.chassisNumber = chassisValidation.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle DMT validation
  const handleDMTValidation = async () => {
    if (!validateForm()) {
      return;
    }

    setValidationLoading(true);
    setMessage('');

    try {
      const response = await VehicleService.validateVehicle(
        formData.registrationNumber,
        formData.chassisNumber
      );

      setDmtData(response.data);
      setActiveStep(1);
      setMessage('Vehicle validated successfully with DMT records!');
      setMessageType('success');
      NotificationService.success('Vehicle validation successful!');

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Vehicle validation failed';
      setMessage(errorMessage);
      setMessageType('error');
      NotificationService.error(errorMessage);
    } finally {
      setValidationLoading(false);
    }
  };

  // Handle vehicle registration
  const handleRegistration = async () => {
    setRegistrationLoading(true);

    try {
      const response = await VehicleService.registerVehicle({
        registrationNumber: formData.registrationNumber,
        chassisNumber: formData.chassisNumber
      });

      setActiveStep(2);
      setMessage('Vehicle registered successfully! You can now use the fuel quota system.');
      setMessageType('success');
      NotificationService.registrationSuccess('Vehicle', formData.registrationNumber);

      // Redirect to vehicle list after 3 seconds
      setTimeout(() => {
        navigate('/vehicle/list');
      }, 3000);

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Vehicle registration failed';
      setMessage(errorMessage);
      setMessageType('error');
      NotificationService.error(errorMessage);
    } finally {
      setRegistrationLoading(false);
    }
  };

  // Handle back to step 0
  const handleBack = () => {
    setActiveStep(0);
    setDmtData(null);
    setMessage('');
  };

  // Render vehicle details form (Step 0)
  const renderVehicleDetailsForm = () => (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <CarIcon sx={{ mr: 1 }} />
        Enter Vehicle Details
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Enter your vehicle's registration number and chassis number as shown in your vehicle documents.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Registration Number"
            placeholder="e.g., ABC-1234 or WP-1234"
            value={formData.registrationNumber}
            onChange={handleInputChange('registrationNumber')}
            error={!!errors.registrationNumber}
            helperText={errors.registrationNumber || 'Enter as shown on your vehicle registration'}
            required
            inputProps={{ maxLength: 20 }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Chassis Number"
            placeholder="17-character chassis number"
            value={formData.chassisNumber}
            onChange={handleInputChange('chassisNumber')}
            error={!!errors.chassisNumber}
            helperText={errors.chassisNumber || 'Found on your vehicle registration document'}
            required
            inputProps={{ maxLength: 17 }}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleDMTValidation}
          disabled={validationLoading || !formData.registrationNumber || !formData.chassisNumber}
          startIcon={validationLoading ? <CircularProgress size={20} /> : <SearchIcon />}
          size="large"
        >
          {validationLoading ? 'Validating...' : 'Validate with DMT'}
        </Button>
      </Box>
    </Paper>
  );

  // Render DMT validation results (Step 1)
  const renderDMTValidation = () => (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <CheckIcon sx={{ mr: 1, color: 'success.main' }} />
        Vehicle Validation Results
      </Typography>

      {dmtData && (
        <Card sx={{ mt: 2, mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Registration Number
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {dmtData.registrationNumber}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Vehicle Type
                </Typography>
                <Typography variant="body1">
                  {FormatUtils.formatVehicleType(dmtData.vehicleType)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Fuel Type
                </Typography>
                <Chip 
                  label={dmtData.fuelType}
                  color={dmtData.fuelType === 'Petrol' ? 'success' : 'primary'}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Engine Capacity
                </Typography>
                <Typography variant="body1">
                  {dmtData.engineCapacity}cc
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Make & Model
                </Typography>
                <Typography variant="body1">
                  {dmtData.make} {dmtData.model}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Year
                </Typography>
                <Typography variant="body1">
                  {dmtData.year}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Chip 
                  label={dmtData.status}
                  color={dmtData.status === 'Active' ? 'success' : 'error'}
                  size="small"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          onClick={handleBack}
          disabled={registrationLoading}
        >
          Back to Edit
        </Button>
        <Button
          variant="contained"
          onClick={handleRegistration}
          disabled={registrationLoading}
          startIcon={registrationLoading ? <CircularProgress size={20} /> : <CheckIcon />}
          size="large"
        >
          {registrationLoading ? 'Registering...' : 'Register Vehicle'}
        </Button>
      </Box>
    </Paper>
  );

  // Render registration complete (Step 2)
  const renderRegistrationComplete = () => (
    <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
      <CheckIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
      <Typography variant="h5" gutterBottom color="success.main">
        Vehicle Registered Successfully!
      </Typography>
      <Typography variant="body1" paragraph>
        Your vehicle <strong>{formData.registrationNumber}</strong> has been registered in the fuel quota system.
      </Typography>
      
      <Box sx={{ mt: 3, mb: 3 }}>
        <Alert severity="success" sx={{ textAlign: 'left' }}>
          <Typography variant="body2">
            <strong>What's Next?</strong>
          </Typography>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li>Your QR code has been generated automatically</li>
            <li>You can now check your fuel quota</li>
            <li>Visit any registered fuel station to use your quota</li>
            <li>Show your QR code to the station operator</li>
          </ul>
        </Alert>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          onClick={() => navigate('/vehicle/list')}
          startIcon={<CarIcon />}
        >
          View My Vehicles
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/vehicle/quota')}
          startIcon={<QrCodeIcon />}
        >
          Check Quota
        </Button>
      </Box>
    </Paper>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom component="h1">
        Register New Vehicle
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Register your vehicle to access the fuel quota system
      </Typography>

      {/* Stepper */}
      <Box sx={{ mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Message Display */}
      {message && (
        <Alert 
          severity={messageType} 
          sx={{ mb: 3 }}
          onClose={() => setMessage('')}
        >
          {message}
        </Alert>
      )}

      {/* Step Content */}
      {activeStep === 0 && renderVehicleDetailsForm()}
      {activeStep === 1 && renderDMTValidation()}
      {activeStep === 2 && renderRegistrationComplete()}

      {/* Help Section */}
      <Paper elevation={1} sx={{ mt: 4, p: 3, bgcolor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom>
          Need Help?
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" gutterBottom>
              Registration Number
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Found on your vehicle registration certificate. Common formats: ABC-1234, WP-1234, etc.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" gutterBottom>
              Chassis Number
            </Typography>
            <Typography variant="body2" color="text.secondary">
              17-character code found on your vehicle registration. Also called VIN number.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" gutterBottom>
              Validation Failed?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ensure details match exactly with your vehicle registration document. Contact DMT if issues persist.
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default VehicleRegistration;