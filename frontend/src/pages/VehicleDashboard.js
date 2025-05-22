// src/pages/VehicleDashboard.js (Enhanced with Real API Data)
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
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
  CircularProgress,
  LinearProgress,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
  LocalGasStation as FuelIcon,
  QrCode as QrCodeIcon,
  History as HistoryIcon,
  Add as AddIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { VehicleService, FuelQuotaService } from '../services/ApiService';
import AuthService from '../services/AuthService';
import NotificationService from '../services/NotificationService';
import { FormatUtils, QuotaUtils, DateUtils } from '../utils';

const VehicleDashboard = () => {
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();
  
  // State management
  const [vehicles, setVehicles] = useState([]);
  const [quotaData, setQuotaData] = useState({});
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalVehicles: 0,
    totalQuotaRemaining: 0,
    lowQuotaVehicles: 0,
    totalQuotaUsed: 0,
    lastRefillDate: null
  });

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load vehicles
      const vehiclesResponse = await VehicleService.getMyVehicles();
      const vehiclesList = vehiclesResponse.data;
      setVehicles(vehiclesList);

      if (vehiclesList.length === 0) {
        setLoading(false);
        return;
      }

      // Load quota data for each vehicle
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

      // Load recent transactions for the first vehicle (or all if needed)
      if (vehiclesList.length > 0) {
        try {
          const transactionsResponse = await FuelQuotaService.getVehicleTransactions(vehiclesList[0].id);
          setRecentTransactions(transactionsResponse.data.slice(0, 5)); // Last 5 transactions
        } catch (error) {
          console.error('Error loading transactions:', error);
          setRecentTransactions([]);
        }
      }

      // Calculate dashboard statistics
      calculateDashboardStats(vehiclesList, quotaMap);

    } catch (error) {
      NotificationService.error('Failed to load dashboard data');
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate dashboard statistics
  const calculateDashboardStats = (vehiclesList, quotaMap) => {
    const stats = {
      totalVehicles: vehiclesList.length,
      totalQuotaRemaining: 0,
      lowQuotaVehicles: 0,
      totalQuotaUsed: 0,
      lastRefillDate: null
    };

    Object.values(quotaMap).forEach(quota => {
      if (quota) {
        stats.totalQuotaRemaining += quota.remainingQuota || 0;
        stats.totalQuotaUsed += quota.usedQuota || 0;
        
        const quotaPercentage = QuotaUtils.calculateQuotaPercentage(quota.remainingQuota, quota.allocatedQuota);
        if (quotaPercentage <= 25) {
          stats.lowQuotaVehicles++;
        }
      }
    });

    // Find most recent transaction date
    if (recentTransactions.length > 0) {
      stats.lastRefillDate = recentTransactions[0].timestamp;
    }

    setDashboardStats(stats);
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
    NotificationService.success('Dashboard refreshed!');
  };

  // Render quick action buttons
  const renderQuickActions = () => (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Quick Actions
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<AddIcon />}
            onClick={() => navigate('/vehicle/add')}
          >
            Add Vehicle
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<CarIcon />}
            onClick={() => navigate('/vehicle/list')}
          >
            My Vehicles
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<QrCodeIcon />}
            onClick={() => navigate('/vehicle/quota')}
          >
            Check Quota
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<HistoryIcon />}
            onClick={() => navigate('/vehicle/transactions')}
          >
            Transactions
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );

  // Render summary cards
  const renderSummaryCards = () => (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {/* Total Vehicles */}
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  Registered Vehicles
                </Typography>
                <Typography variant="h4">
                  {dashboardStats.totalVehicles}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <CarIcon />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Available Quota */}
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  Available Quota
                </Typography>
                <Typography variant="h4">
                  {FormatUtils.formatFuelAmount(dashboardStats.totalQuotaRemaining)}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'success.main' }}>
                <FuelIcon />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Low Quota Vehicles */}
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  Low Quota Vehicles
                </Typography>
                <Typography variant="h4" color={dashboardStats.lowQuotaVehicles > 0 ? 'warning.main' : 'text.primary'}>
                  {dashboardStats.lowQuotaVehicles}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: dashboardStats.lowQuotaVehicles > 0 ? 'warning.main' : 'grey.400' }}>
                <WarningIcon />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Fuel Used */}
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  Fuel Used This Period
                </Typography>
                <Typography variant="h4">
                  {FormatUtils.formatFuelAmount(dashboardStats.totalQuotaUsed)}
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'info.main' }}>
                <TrendingUpIcon />
              </Avatar>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  // Render vehicle overview cards
  const renderVehicleOverview = () => (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Vehicle Overview
        </Typography>
        <Tooltip title="Refresh data">
          <IconButton onClick={handleRefresh} disabled={refreshing}>
            <RefreshIcon sx={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          </IconButton>
        </Tooltip>
      </Box>

      {vehicles.length === 0 ? (
        <Alert severity="info">
          <Typography variant="body1">
            You haven't registered any vehicles yet.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/vehicle/add')}
            sx={{ mt: 1 }}
          >
            Register Your First Vehicle
          </Button>
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {vehicles.map((vehicle) => {
            const quota = quotaData[vehicle.id];
            const quotaStatus = quota ? QuotaUtils.getQuotaStatus(quota.remainingQuota, quota.allocatedQuota) : null;
            const quotaPercentage = quota ? QuotaUtils.calculateQuotaPercentage(quota.remainingQuota, quota.allocatedQuota) : 0;

            return (
              <Grid item xs={12} md={6} key={vehicle.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6">
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

                    {quota ? (
                      <Box>
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
                        
                        <Typography variant="body2">
                          <strong>{FormatUtils.formatFuelAmount(quota.remainingQuota)}</strong> of {FormatUtils.formatFuelAmount(quota.allocatedQuota)} remaining
                        </Typography>

                        {quota.expiringSoon && (
                          <Alert severity="warning" sx={{ mt: 1, py: 0 }}>
                            <Typography variant="caption">
                              Quota expires on {DateUtils.formatTimestamp(quota.quotaEndDate)}
                            </Typography>
                          </Alert>
                        )}
                      </Box>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 2 }}>
                        <CircularProgress size={20} />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Loading quota...
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                  
                  <CardActions>
                    <Button size="small" startIcon={<QrCodeIcon />}>
                      QR Code
                    </Button>
                    <Button size="small" startIcon={<InfoIcon />}>
                      Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Paper>
  );

  // Render recent transactions
  const renderRecentTransactions = () => (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Recent Transactions
      </Typography>
      
      {recentTransactions.length === 0 ? (
        <Alert severity="info">
          <Typography>No recent transactions found.</Typography>
        </Alert>
      ) : (
        <List>
          {recentTransactions.map((transaction) => (
            <React.Fragment key={transaction.id}>
              <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body1">
                        {transaction.vehicleRegNo} • {transaction.stationName}
                      </Typography>
                      <Chip 
                        label={`${transaction.amount}L ${transaction.fuelType}`}
                        color={transaction.fuelType === 'Petrol' ? 'success' : 'primary'}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {DateUtils.formatTimestamp(transaction.timestamp)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Remaining quota: {FormatUtils.formatFuelAmount(transaction.quotaAfter)}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
      
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<HistoryIcon />}
          onClick={() => navigate('/vehicle/transactions')}
        >
          View All Transactions
        </Button>
      </Box>
    </Paper>
  );

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading your dashboard...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {currentUser?.username || 'User'}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Here's an overview of your vehicles and fuel quota status
        </Typography>
      </Box>

      {/* Quick Actions */}
      {renderQuickActions()}

      {/* Summary Cards */}
      {renderSummaryCards()}

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Vehicle Overview */}
        <Grid item xs={12} lg={8}>
          {renderVehicleOverview()}
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12} lg={4}>
          {renderRecentTransactions()}
        </Grid>
      </Grid>

      {/* Low Quota Alert */}
      {dashboardStats.lowQuotaVehicles > 0 && (
        <Alert severity="warning" sx={{ mt: 3 }}>
          <Typography variant="body1">
            <strong>⚠️ Low Quota Alert:</strong> You have {dashboardStats.lowQuotaVehicles} vehicle(s) with low fuel quota. 
            Consider refueling soon.
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate('/vehicle/list')}
            sx={{ mt: 1 }}
          >
            View Vehicles
          </Button>
        </Alert>
      )}
    </Container>
  );
};

// CSS for refresh animation
const styles = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default VehicleDashboard;