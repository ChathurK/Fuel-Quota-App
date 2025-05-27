import ApiService from './ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TransactionService = {
  processTransaction: async (transactionData) => {
    try {
      const response = await ApiService.processTransaction(transactionData);
      
      if (response.success) {
        return {
          success: true,
          transactionId: response.transactionId,
          message: response.message,
        };
      } else {
        throw new Error(response.message || 'Transaction failed');
      }
    } catch (error) {
      console.error('Process transaction error:', error);
      throw error;
    }
  },

  // Fetch transaction history for the logged-in station
  getTransactionHistory: async () => {
    try {
      const stationId = await AsyncStorage.getItem('stationId');
      console.log('TransactionService: Retrieved stationId for history:', stationId);

      if (!stationId) {
        throw new Error('Station ID not found. Please login again.');
      }

      const response = await ApiService.getStationTransactions(stationId);
      console.log('TransactionService: getTransactionHistory response:', response);

      if (Array.isArray(response) && response.length > 0) {
        return response;
      } else {
        throw new Error(response.message || 'Failed to load transactions');
      }
    } catch (error) {
      console.error('Get transaction history error:', error);
    }
  },
};

export default TransactionService;
