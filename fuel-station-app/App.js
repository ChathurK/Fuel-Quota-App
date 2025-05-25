import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';

// Import screens
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import QRScannerScreen from './src/screens/QRScannerScreen';
import FuelTransactionScreen from './src/screens/FuelTransactionScreen';
import TransactionHistoryScreen from './src/screens/TransactionHistoryScreen';
import { Colors } from './src/constants/Colors';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.textWhite,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Fuel Station Dashboard' }}
        />
        <Stack.Screen 
          name="QRScanner" 
          component={QRScannerScreen} 
          options={{ title: 'Scan Vehicle QR' }}
        />
        <Stack.Screen 
          name="FuelTransaction" 
          component={FuelTransactionScreen} 
          options={{ title: 'Fuel Transaction' }}
        />
        <Stack.Screen 
          name="TransactionHistory" 
          component={TransactionHistoryScreen} 
          options={{ title: 'Transaction History' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
