import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ApiService from '../services/ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FuelTransactionScreen = ({ route, navigation }) => {
  const { vehicleData, qrCode } = route.params;
  const [litersToDispense, setLitersToDispense] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [transactionData, setTransactionData] = useState(null);
  useEffect(() => {
    // Set the navigation title to include vehicle number
    navigation.setOptions({
      title: `Transaction - ${vehicleData.registrationNumber}`,
    });
  }, [vehicleData, navigation]);

  const validateLiters = () => {
    const liters = parseFloat(litersToDispense);

    if (isNaN(liters) || liters <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount of liters');
      return false;
    }

    if (liters > vehicleData.remainingQuota) {
      Alert.alert(
        'Insufficient Quota',
        `Vehicle has only ${vehicleData.remainingQuota}L remaining quota. You entered ${liters}L.`
      );
      return false;
    }

    return true;
  };
  const handleProcessTransaction = () => {
    if (!validateLiters()) return;

    const liters = parseFloat(litersToDispense);

    setTransactionData({
      vehicleNumber: vehicleData.registrationNumber,
      ownerName: vehicleData.ownerName,
      ownerPhone: vehicleData.ownerPhone,
      liters: liters,
      fuelType: vehicleData.fuelType,
      remainingQuota: vehicleData.remainingQuota - liters,
      timestamp: new Date().toISOString(),
    });

    setShowConfirmModal(true);
  };
  const confirmTransaction = async () => {
    setIsProcessing(true);
    setShowConfirmModal(false);

    try {
      // Get station ID from storage
      const stationId = await AsyncStorage.getItem('stationId');
      if (!stationId) {
        throw new Error('Station ID not found. Please login again.');
      }

      // Prepare fuel pump request according to backend DTO
      const fuelPumpRequest = {
        vehicleId: vehicleData.vehicleId,
        stationId: parseInt(stationId),
        fuelType: vehicleData.fuelType,
        amount: transactionData.liters
      };

      // Process the transaction using backend API
      const result = await ApiService.recordFuelPump(fuelPumpRequest);

      if (result.message) {
        Alert.alert(
          'Transaction Successful',
          result.message,
          [
            {
              text: 'New Transaction',
              onPress: () => navigation.navigate('QRScanner'),
            },
            {
              text: 'Back to Home',
              onPress: () => navigation.navigate('Home'),
            },
          ]
        );
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      console.error('Transaction error:', error);
      let errorMessage = 'Something went wrong';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Transaction Failed', errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };
  const quickAmountButtons = [5, 10, 20, 30];

  return (
    <ScrollView style={styles.container}>
      {/* Vehicle Information Card */}
      <View style={styles.vehicleCard}>
        <LinearGradient colors={['#4CAF50', '#45A049']} style={styles.vehicleHeader}>
          <Text style={styles.carIcon}>🚗</Text>
          <Text style={styles.vehicleNumber}>{vehicleData.registrationNumber}</Text>
        </LinearGradient>
        <View style={styles.vehicleDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>👤</Text>
            <Text style={styles.detailLabel}>Owner:</Text>
            <Text style={styles.detailValue}>{vehicleData.ownerName}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📞</Text>
            <Text style={styles.detailLabel}>Phone:</Text>
            <Text style={styles.detailValue}>{vehicleData.ownerPhone}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>🚗</Text>
            <Text style={styles.detailLabel}>Vehicle Type:</Text>
            <Text style={styles.detailValue}>{vehicleData.vehicleType}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>⛽</Text>
            <Text style={styles.detailLabel}>Fuel Type:</Text>
            <Text style={styles.detailValue}>{vehicleData.fuelType}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📊</Text>
            <Text style={styles.detailLabel}>Remaining Quota:</Text>
            <Text style={[styles.detailValue, styles.quotaValue]}>
              {vehicleData.remainingQuota}L
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>🚙</Text>
            <Text style={styles.detailLabel}>Vehicle Type:</Text>
            <Text style={styles.detailValue}>{vehicleData.vehicleType}</Text>
          </View>
        </View>
      </View>

      {/* Fuel Dispensing Section */}
      <View style={styles.dispensingCard}>
        <Text style={styles.sectionTitle}>Fuel Dispensing</Text>

        {/* Quick Amount Buttons */}
        <View style={styles.quickAmountContainer}>
          <Text style={styles.quickAmountLabel}>Quick Amount (Liters):</Text>
          <View style={styles.quickAmountButtons}>
            {quickAmountButtons.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={styles.quickAmountButton}
                onPress={() => setLitersToDispense(amount.toString())}
              >
                <Text style={styles.quickAmountButtonText}>{amount}L</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Manual Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Enter Liters to Dispense:</Text>
          <TextInput
            style={styles.literInput}
            value={litersToDispense}
            onChangeText={setLitersToDispense}
            placeholder="0.00"
            keyboardType="decimal-pad"
            maxLength={6}
          />
          <Text style={styles.inputUnit}>Liters</Text>
        </View>
        {/* Price Calculation - removed for simplicity */}

        {/* Process Button */}
        <TouchableOpacity
          style={[
            styles.processButton,
            (!litersToDispense || isProcessing) && styles.processButtonDisabled
          ]}
          onPress={handleProcessTransaction}
          disabled={!litersToDispense || isProcessing}
        >
          <LinearGradient
            colors={['#FF6B35', '#FF5722']}
            style={styles.processButtonGradient}
          >
            <Text style={styles.processIcon}>⚡</Text>
            <Text style={styles.processButtonText}>Process Transaction</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Fuel Transaction</Text>

            {transactionData && (
              <View style={styles.confirmationDetails}>
                <Text style={styles.confirmationText}>
                  Vehicle: {transactionData.vehicleNumber}
                </Text>
                <Text style={styles.confirmationText}>
                  Fuel Type: {transactionData.fuelType}
                </Text>
                <Text style={styles.confirmationText}>
                  Amount: {transactionData.liters}L
                </Text>
                <Text style={styles.confirmationText}>
                  Remaining Quota: {transactionData.remainingQuota}L
                </Text>
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={confirmTransaction}
              >
                <Text style={styles.modalConfirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Processing Modal */}
      <Modal visible={isProcessing} transparent={true}>
        <View style={styles.processingOverlay}>
          <View style={styles.processingContent}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={styles.processingText}>Processing Transaction...</Text>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  vehicleCard: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  vehicleHeader: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleNumber: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  vehicleDetails: {
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: '#666',
    width: 120,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  quotaValue: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  dispensingCard: {
    margin: 20,
    marginTop: 0,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  quickAmountContainer: {
    marginBottom: 25,
  },
  quickAmountLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  quickAmountButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAmountButton: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  quickAmountButtonText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 16,
    color: '#666',
    width: 150,
  },
  literInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  inputUnit: {
    fontSize: 16,
    color: '#666',
    width: 50,
  },
  calculationCard: {
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
  },
  calculationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  calculationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  calculationLabel: {
    fontSize: 14,
    color: '#666',
  },
  calculationValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  processButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  processButtonDisabled: {
    opacity: 0.5,
  },
  processButtonGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  processButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  confirmationDetails: {
    marginBottom: 25,
  },
  confirmationText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalCancelButton: {
    flex: 1,
    padding: 15,
    marginRight: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalConfirmButton: {
    flex: 1,
    padding: 15,
    marginLeft: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#666',
    fontWeight: 'bold',
  },
  modalConfirmText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  processingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
  }, processingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#333',
  },
  carIcon: {
    fontSize: 30,
    color: '#fff',
  },
  detailIcon: {
    fontSize: 20,
    width: 20,
    textAlign: 'center',
    marginRight: 10,
  },
  processIcon: {
    fontSize: 24,
    color: '#fff',
  },
});

export default FuelTransactionScreen;
