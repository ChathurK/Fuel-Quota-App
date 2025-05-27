import ApiService from './ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StationService = {
  // Fetch station info
  getStationInfo: async () => {
    try {
      const stationId = await AsyncStorage.getItem('stationId');
      console.log('StationService: Retrieved stationId from storage:', stationId);
      
      if (!stationId) {
        throw new Error('Station ID not found. Please login again.');
      }
      
      // Fetch station data from API
      const response = await ApiService.getStationInfo(stationId);
      console.log('StationService: getStationInfo response:', response);
      
      if (response && (response.name || response.id)) {
        // Extract station info from response
        return {
          id: response.id,
          name: response.name,
          ownerName: response.ownerName,
          address: response.address,
          phone: response.contactNumber,
          status: response.status,
          fuelTypes: (response.hasPetrol ? (response.hasDiesel ? 'Petrol, Diesel' : 'Petrol') : (stationData.hasDiesel ? 'Diesel' : 'Not available')),
          registrationNumber: response.registrationNumber,
        };
      } else {
        throw new Error(response.message || 'Failed to load station info');
      }
    } catch (error) {
      console.error('Get station info error:', error);
      // Return mock data for development
      return StationService.getMockStationInfo();
    }
  },

  // Fetch today's stats for the station
  getTodayStats: async () => {
    try {
      const stationId = await AsyncStorage.getItem('stationId');
      console.log('StationService: Retrieved stationId for stats:', stationId);
      
      if (!stationId) {
        throw new Error('Station ID not found. Please login again.');
      }
      
      const response = await ApiService.getTodayStats(stationId);
      console.log('StationService: getTodayStats response:', response);
      
      if (response && typeof response === 'object') {
        return {
          totalTransactions: response.todayTransactionCount || response.todayTransactions || 0,
          totalLiters: response.todayFuelDispensed || (response.todayPetrolDispensed + response.todayDieselDispensed) || 0,
          totalRevenue: response.todayRevenue || 0,
        };
      } else {
        throw new Error(response.message || 'Failed to load today stats');
      }
    } catch (error) {
      console.error('Get today stats error:', error);
      // Return mock data for development
      return StationService.getMockTodayStats();
    }
  },

  // Mock data for development/testing
  getMockStationInfo: () => {
    return {
      id: 1,
      name: 'Mock Fuel Station',
      ownerName: 'Mock Station Manager',
      address: 'Mock address',
      contactNumber: 'Mock number',
      status: 'Mock status',
      hasPetrol: false,
      hasDiesel: false,
      registrationNumber: 'Mock reg no',
    };
  },

  getMockTodayStats: () => {
    return {
      totalTransactions: 25,
      totalLiters: 1250.5,
      totalRevenue: 150060.00,
      averageTransactionSize: 50.02,
      peakHour: '08:00 AM - 09:00 AM',
    };
  },
};

export default StationService;
