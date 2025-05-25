// src/pages/VehicleTransactions.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  Button
} from '@mui/material';
import {
  LocalGasStation as FuelIcon,
  DirectionsCar as CarIcon,
  Refresh as RefreshIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { VehicleService, FuelQuotaService } from '../services/ApiService';
import NotificationService from '../services/NotificationService';
import { FormatUtils, DateUtils } from '../utils';

const VehicleTransactions = () => {
  const { vehicleId } = useParams(); // If present, show transactions for specific vehicle
  const navigate = useNavigate();
  
  // State management
  const [transactions, setTransactions] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalFuelUsed, setTotalFuelUsed] = useState(0);

  // Load data on component mount
  useEffect(() => {
    loadInitialData();
  }, [vehicleId]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load user's vehicles first
      const vehiclesResponse = await VehicleService.getMyVehicles();
      const vehiclesList = vehiclesResponse.data;
      setVehicles(vehiclesList);

      if (vehiclesList.length === 0) {
        setLoading(false);
        return;
      }

      // If viewing specific vehicle, find it
      if (vehicleId) {
        const vehicle = vehiclesList.find(v => v.id.toString() === vehicleId.toString());
        if (!vehicle) {
          NotificationService.error('Vehicle not found');
          navigate('/vehicle/list');
          return;
        }
        setCurrentVehicle(vehicle);
      }

      // Load transactions
      await loadTransactions(vehiclesList);

    } catch (error) {
      NotificationService.error('Failed to load transaction data');
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async (vehiclesList = vehicles) => {
    try {
      let allTransactions = [];

      if (vehicleId) {
        // SCENARIO 2: Load transactions for specific vehicle only
        console.log(`Loading transactions for vehicle ${vehicleId}`);
        const response = await FuelQuotaService.getVehicleTransactions(vehicleId);
        allTransactions = response.data;
        console.log(`Found ${allTransactions.length} transactions for vehicle ${vehicleId}`);
      } else {
        // SCENARIO 1: Load transactions for ALL user's vehicles
        console.log(`Loading transactions for all ${vehiclesList.length} vehicles`);
        
        const transactionPromises = vehiclesList.map(async (vehicle) => {
          try {
            const response = await FuelQuotaService.getVehicleTransactions(vehicle.id);
            return response.data.map(transaction => ({
              ...transaction,
              vehicleRegNo: vehicle.registrationNumber, // Ensure we have the registration number
              vehicleId: vehicle.id
            }));
          } catch (error) {
            console.error(`Error loading transactions for vehicle ${vehicle.id} (${vehicle.registrationNumber}):`, error);
            return [];
          }
        });

        const results = await Promise.all(transactionPromises);
        allTransactions = results.flat();
        console.log(`Found ${allTransactions.length} total transactions across all vehicles`);
      }

      // Sort by timestamp (most recent first)
      allTransactions.sort((a, b) => {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);
        return dateB - dateA;
      });
      
      setTransactions(allTransactions);
      calculateStatistics(allTransactions);

    } catch (error) {
      console.error('Error loading transactions:', error);
      NotificationService.error('Failed to load transactions');
    }
  };

  const calculateStatistics = (transactionList) => {
    setTotalTransactions(transactionList.length);
    const totalFuel = transactionList.reduce((sum, transaction) => sum + (transaction.amount || 0), 0);
    setTotalFuelUsed(totalFuel);
  };

  const handleRefresh = async () => {
    await loadTransactions();
    NotificationService.success('Transactions refreshed!');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getVehicleName = (vehicleId) => {
    const vehicle = vehicles.find(v => v.id.toString() === vehicleId.toString());
    return vehicle ? vehicle.registrationNumber : 'Unknown Vehicle';
  };

  // Render statistics cards
  const renderStatistics = () => (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={4}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <FuelIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h5">{totalTransactions}</Typography>
            <Typography variant="body2" color="text.secondary">
              Total Transactions
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={4}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <CarIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h5">
              {FormatUtils.formatFuelAmount(totalFuelUsed)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Fuel Used
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={4}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <FuelIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
            <Typography variant="h5">
              {vehicleId ? 1 : vehicles.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {vehicleId ? 'Vehicle' : 'Total Vehicles'}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  // Render transactions table
  const renderTransactionsTable = () => {
    const paginatedTransactions = transactions.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );

    return (
      <Paper>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Transaction History
          </Typography>
          <Tooltip title="Refresh transactions">
            <IconButton onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date & Time</TableCell>
                {!vehicleId && <TableCell>Vehicle</TableCell>}
                <TableCell>Station</TableCell>
                <TableCell>Fuel Type</TableCell>
                <TableCell align="right">Amount (L)</TableCell>
                <TableCell align="right">Quota Before</TableCell>
                <TableCell align="right">Quota After</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={vehicleId ? 7 : 8} align="center">
                    <Typography variant="body1" color="text.secondary" sx={{ py: 4 }}>
                      No transactions found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTransactions.map((transaction) => (
                  <TableRow key={transaction.id} hover>
                    <TableCell>
                      <Typography variant="body2">
                        {DateUtils.formatTimestamp(transaction.timestamp)}
                      </Typography>
                    </TableCell>
                    
                    {!vehicleId && (
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {transaction.vehicleRegNo || getVehicleName(transaction.vehicleId)}
                        </Typography>
                      </TableCell>
                    )}
                    
                    <TableCell>
                      <Typography variant="body2">
                        {transaction.stationName}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Chip 
                        label={transaction.fuelType}
                        color={transaction.fuelType === 'Petrol' ? 'success' : 'primary'}
                        size="small"
                      />
                    </TableCell>
                    
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="medium">
                        {FormatUtils.formatFuelAmount(transaction.amount)}
                      </Typography>
                    </TableCell>
                    
                    <TableCell align="right">
                      <Typography variant="body2">
                        {FormatUtils.formatFuelAmount(transaction.quotaBefore)}
                      </Typography>
                    </TableCell>
                    
                    <TableCell align="right">
                      <Typography variant="body2">
                        {FormatUtils.formatFuelAmount(transaction.quotaAfter)}
                      </Typography>
                    </TableCell>
                    
                    <TableCell align="center">
                      <Chip 
                        label={transaction.notificationSent ? 'Notified' : 'Pending'}
                        color={transaction.notificationSent ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {transactions.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={transactions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>
    );
  };

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading transaction history...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {vehicleId && (
            <IconButton 
              onClick={() => navigate('/vehicle/list')} 
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          <Box>
            <Typography variant="h4" component="h1">
              {vehicleId 
                ? `Transaction History - ${currentVehicle?.registrationNumber || 'Vehicle'}` 
                : 'All Transaction History'
              }
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {vehicleId 
                ? `View fuel transactions for ${currentVehicle?.registrationNumber}`
                : `View fuel transactions for all your ${vehicles.length} registered vehicles`
              }
            </Typography>
          </Box>
        </Box>
        
        {!vehicleId && vehicles.length > 1 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Showing transactions from all your vehicles. To view transactions for a specific vehicle, 
              go to <Button 
                variant="text" 
                size="small" 
                onClick={() => navigate('/vehicle/list')}
                sx={{ textDecoration: 'underline' }}
              >
                Vehicle List
              </Button> and click the transaction icon.
            </Typography>
          </Alert>
        )}
      </Box>

      {/* Statistics */}
      {renderStatistics()}

      {/* Transactions Table */}
      {renderTransactionsTable()}

      {/* No transactions message */}
      {transactions.length === 0 && (
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body1">
            {vehicleId 
              ? `No transactions found for vehicle ${currentVehicle?.registrationNumber}.`
              : 'No transactions found for any of your vehicles.'
            }
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Transactions will appear here after you fuel up at participating stations.
          </Typography>
        </Alert>
      )}
    </Container>
  );
};

export default VehicleTransactions;