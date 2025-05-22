// src/pages/VehicleList.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Fab
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
  QrCode as QrCodeIcon,
  History as HistoryIcon,
  Add as AddIcon,
  LocalGasStation as FuelIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { VehicleService, FuelQuotaService } from '../services/ApiService';
import NotificationService from '../services/NotificationService';
import { FormatUtils, QuotaUtils, QRUtils } from '../utils';

const VehicleList = () => {
  const navigate = useNavigate();
  
  // State management
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quotaData, setQuotaData] = useState({});
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [qrCodeImage, setQrCodeImage] = useState('');

  // Load vehicles and quota data
  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      
      // Fetch user's vehicles
      const vehiclesResponse = await VehicleService.getMyVehicles();
      const vehiclesList = vehiclesResponse.data;
      setVehicles(vehiclesList);

      // Fetch quota data for each vehicle
      const quotaPromises = vehiclesList.map(async (vehicle) => {
        try {
          const quotaResponse = await FuelQuotaService.checkQuotaByVehicleId(vehicle.id);
          return { vehicleId: vehicle.id, quota: quotaResponse.data };
        } catch (error) {
          console.error(`Error fetching quota for vehicle ${vehicle.id}:`, error);
          return { vehicleId: vehicle.id, quota: null };
        }
      });

      const quotaResults = await Promise.all(quotaPromises);
      const quotaMap = {};
      quotaResults.forEach(result => {
        quotaMap[result.vehicleId] = result.quota;
      });
      setQuotaData(quotaMap);

    } catch (error) {
      NotificationService.error('Failed to load vehicles');
      console.error('Error loading vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle QR code display
  const handleShowQR = async (vehicle) => {
    try {
      setSelectedVehicle(vehicle);
      setQrDialogOpen(true);
      
      // Generate QR code image
      const qrImage = await QRUtils.generateQRCode(vehicle.qrCode || vehicle.registrationNumber);
      setQrCodeImage(qrImage);
    } catch (error) {
      NotificationService.error('Failed to generate QR code');
      console.error('QR generation error:', error);
    }
  };

  // Handle QR code download
  const handleDownloadQR = () => {
    if (qrCodeImage && selectedVehicle) {
      const link = document.createElement('a');
      link.download = `${selectedVehicle.registrationNumber}_QR.png`;
      link.href = qrCodeImage;
      link.click();
      NotificationService.success('QR code downloaded successfully!');
    }
  };

  // Close QR dialog
  const handleCloseQR = () => {
    setQrDialogOpen(false);
    setSelectedVehicle(null);
    setQrCodeImage('');
  };

  // Navigate to vehicle transactions
  const handleViewTransactions = (vehicleId) => {
    navigate(`/vehicle/transactions/${vehicleId}`);
  };

  // Navigate to quota details
  const handleViewQuota = (vehicleId) => {
    navigate(`/vehicle/quota/${vehicleId}`);
  };

  // Render vehicle card
  const renderVehicleCard = (vehicle) => {
    const quota = quotaData[vehicle.id];
    const quotaStatus = quota ? QuotaUtils.getQuotaStatus(quota.remainingQuota, quota.allocatedQuota) : null;
    const quotaPercentage = quota ? QuotaUtils.calculateQuotaPercentage(quota.remainingQuota, quota.allocatedQuota) : 0;

    return (
      <Grid item xs={12} md={6} lg={4} key={vehicle.id}>
        <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flexGrow: 1 }}>
            {/* Vehicle Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                  <CarIcon sx={{ mr: 1 }} />
                  {vehicle.registrationNumber}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {FormatUtils.formatVehicleType(vehicle.vehicleType)} • {vehicle.engineCapacity}cc
                </Typography>
              </Box>
              <Chip 
                label={vehicle.fuelType}
                color={vehicle.fuelType === 'Petrol' ? 'success' : 'primary'}
                size="small"
              />
            </Box>

            {/* Quota Information */}
            {quota ? (
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Fuel Quota
                  </Typography>
                  <Chip 
                    label={quotaStatus.message}
                    color={quotaStatus.color}
                    size="small"
                  />
                </Box>
                
                <LinearProgress 
                  variant="determinate" 
                  value={quotaPercentage} 
                  color={quotaStatus.color}
                  sx={{ height: 8, borderRadius: 4, mb: 1 }}
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">
                    <strong>{FormatUtils.formatFuelAmount(quota.remainingQuota)}</strong> remaining
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    of {FormatUtils.formatFuelAmount(quota.allocatedQuota)}
                  </Typography>
                </Box>

                {/* Expiring Soon Warning */}
                {quota.expiringSoon && (
                  <Alert severity="warning" sx={{ mt: 1, py: 0 }}>
                    <Typography variant="caption">
                      Quota expires on {new Date(quota.quotaEndDate).toLocaleDateString()}
                    </Typography>
                  </Alert>
                )}
              </Box>
            ) : (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <CircularProgress size={20} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Loading quota...
                </Typography>
              </Box>
            )}
          </CardContent>

          <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
            <Button
              size="small"
              startIcon={<QrCodeIcon />}
              onClick={() => handleShowQR(vehicle)}
            >
              QR Code
            </Button>
            
            <Box>
              <Tooltip title="View quota details">
                <IconButton 
                  size="small" 
                  onClick={() => handleViewQuota(vehicle.id)}
                  disabled={!quota}
                >
                  <InfoIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Transaction history">
                <IconButton 
                  size="small" 
                  onClick={() => handleViewTransactions(vehicle.id)}
                >
                  <HistoryIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </CardActions>
        </Card>
      </Grid>
    );
  };

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading your vehicles...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            My Vehicles
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage your registered vehicles and check fuel quotas
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/vehicle/add')}
          size="large"
        >
          Add Vehicle
        </Button>
      </Box>

      {/* Summary Cards */}
      {vehicles.length > 0 && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <CarIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h5">{vehicles.length}</Typography>
              <Typography variant="body2" color="text.secondary">
                Registered Vehicles
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <FuelIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h5">
                {Object.values(quotaData).reduce((total, quota) => 
                  total + (quota?.remainingQuota || 0), 0
                ).toFixed(1)}L
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Remaining Quota
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <HistoryIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h5">
                {Object.values(quotaData).filter(quota => 
                  quota && QuotaUtils.calculateQuotaPercentage(quota.remainingQuota, quota.allocatedQuota) <= 25
                ).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Low Quota Vehicles
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Vehicles Grid */}
      {vehicles.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CarIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No Vehicles Registered
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            You haven't registered any vehicles yet. Register your first vehicle to start using the fuel quota system.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => navigate('/vehicle/add')}
          >
            Register Your First Vehicle
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {vehicles.map(renderVehicleCard)}
        </Grid>
      )}

      {/* QR Code Dialog */}
      <Dialog
        open={qrDialogOpen}
        onClose={handleCloseQR}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            QR Code - {selectedVehicle?.registrationNumber}
          </Typography>
          <IconButton onClick={handleCloseQR}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ textAlign: 'center', py: 3 }}>
          {qrCodeImage ? (
            <Box>
              <img 
                src={qrCodeImage} 
                alt="Vehicle QR Code" 
                style={{ maxWidth: '100%', height: 'auto', maxHeight: '300px' }}
              />
              <Alert severity="info" sx={{ mt: 2, textAlign: 'left' }}>
                <Typography variant="body2">
                  <strong>How to use:</strong>
                </Typography>
                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                  <li>Show this QR code to the fuel station operator</li>
                  <li>They will scan it to check your quota</li>
                  <li>Fuel will be dispensed and deducted from your quota</li>
                </ul>
              </Alert>
            </Box>
          ) : (
            <CircularProgress />
          )}
        </DialogContent>
        
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadQR}
            disabled={!qrCodeImage}
          >
            Download QR Code
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button for Mobile */}
      <Fab
        color="primary"
        aria-label="add vehicle"
        sx={{ 
          position: 'fixed', 
          bottom: 16, 
          right: 16,
          display: { xs: 'flex', md: 'none' }
        }}
        onClick={() => navigate('/vehicle/add')}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default VehicleList;