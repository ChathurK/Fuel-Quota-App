import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Camera } from 'expo-camera';
import ApiService from '../services/ApiService';

const { width } = Dimensions.get('window');

const QRScannerScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);

    try {
      // Use the backend API to check quota by QR
      const vehicleData = await ApiService.checkQuotaByQR(data);

      if (vehicleData) {
        navigation.navigate('FuelTransaction', {
          vehicleData: vehicleData,
          qrCode: data,
        });
      } else {
        Alert.alert(
          'Invalid QR Code',
          'This QR code is not associated with any registered vehicle.',
          [{ text: 'Scan Again', onPress: () => setScanned(false) }]
        );
      }
    } catch (error) {
      console.error('QR scan error:', error);
      let errorMessage = 'Failed to validate QR code. Please try again.';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert(
        'Error',
        errorMessage,
        [{ text: 'Scan Again', onPress: () => setScanned(false) }]
      );
    }
  };

  const toggleFlash = () => {
    setFlashOn(!flashOn);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centerContainer}>
        <Text>Requesting for camera permission</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.cameraIcon}>📷</Text>
        <Text style={styles.noPermissionText}>No access to camera</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
          }}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.scanner}
        type={Camera.Constants.Type.back}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        flashMode={flashOn ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off}
      />

      {/* Overlay */}
      <View style={styles.overlay}>
        {/* Top overlay */}
        <View style={styles.overlayTop}>
          <Text style={styles.instructionText}>
            Position the QR code within the frame
          </Text>
        </View>

        {/* Scanner frame */}
        <View style={styles.scannerFrame}>
          <View style={[styles.frameCorner, styles.topLeft]} />
          <View style={[styles.frameCorner, styles.topRight]} />
          <View style={[styles.frameCorner, styles.bottomLeft]} />
          <View style={[styles.frameCorner, styles.bottomRight]} />
        </View>

        {/* Bottom overlay */}
        <View style={styles.overlayBottom}>
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={toggleFlash}
            >
              <Text style={styles.flashIcon}>
                {flashOn ? "🔦" : "💡"}
              </Text>
              <Text style={styles.controlButtonText}>Flash</Text>
            </TouchableOpacity>

            {scanned && (
              <TouchableOpacity
                style={[styles.controlButton, styles.scanAgainButton]}
                onPress={() => setScanned(false)}
              >
                <Text style={styles.refreshIcon}>🔄</Text>
                <Text style={styles.controlButtonText}>Scan Again</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  scanner: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  instructionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  scannerFrame: {
    width: width * 0.7,
    height: width * 0.7,
    alignSelf: 'center',
    position: 'relative',
  },
  frameCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#fff',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 50,
  },
  controlButton: {
    alignItems: 'center',
    padding: 15,
  },
  scanAgainButton: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
  },
  noPermissionText: {
    fontSize: 18,
    color: '#666',
    marginTop: 20,
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  }, permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cameraIcon: {
    fontSize: 50,
    color: '#ccc',
  },
  flashIcon: {
    fontSize: 24,
  },
  refreshIcon: {
    fontSize: 24,
  },
});

export default QRScannerScreen;
