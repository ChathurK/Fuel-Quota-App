import ApiService from './ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StationService = {
  // Fetch station info
  getStationInfo: async () => {
    try {
      const stationId = await AsyncStorage.getItem('stationId');
      console.log('StationService: Retrieved stationId for info:', stationId);
      
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
      // Return mock data
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
          todayDieselDispensed: response.todayDieselDispensed || 0,
          todayPetrolDispensed: response.todayPetrolDispensed || 0,
          todayTotalDispensed: response.todayTotalDispensed || 0,
          todayTransactionCount: response.todayTransactionCount || 0,
          totalDieselDispensed: response.totalDieselDispensed || 0,
          totalPetrolDispensed: response.totalPetrolDispensed || 0,
          totalFuelDispensed: response.totalFuelDispensed || 0,
          totalTransactionCount: response.totalTransactionCount || 0
        };
      } else {
        throw new Error(response.message || 'Failed to load today stats');
      }
    } catch (error) {
      console.error('Get today stats error:', error);
      // Return mock data
      return StationService.getMockTodayStats();
    }
  },

  // Mock data
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
      todayDieselDispensed: 0.0,
      todayPetrolDispensed: 0.0,
      todayTotalDispensed: 0.0,
      todayTransactionCount: 0,
      totalDieselDispensed: 0.0,
      totalPetrolDispensed: 0.0,
      totalFuelDispensed: 0.0,
      totalTransactionCount: 0,
    };
  },
};

export default StationService;
