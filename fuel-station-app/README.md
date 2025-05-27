# Fuel Station App Setup

## About

The Fuel Station App is a React Native mobile application built with Expo, designed specifically for fuel station operators (owners). This app allows station owners to:

- **Scan Vehicle QR Codes**: Quickly verify fuel quotas and eligibility
- **Process Fuel Transactions**: Record fuel dispensing with real-time quota updates
- **View Transaction History**: Monitor daily sales and fuel distribution
- **View Station Information**: View station details and operational status
- **Dashboard Analytics**: View today's performance metrics and statistics

The app provides a streamlined interface for fuel station operations, integrating with the backend system to ensure accurate quota management and transaction recording.

## Quick Start

1. **Clone the repository and navigate to the fuel-station-app folder:**
   ```bash
   git clone <repo-url>
   cd fuel-station-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the backend API:**
   - Open `src/services/ApiService.js`
   - Update the base URL to point to your backend server

4. **Start the development server:**
   ```bash
   npm start
   ```

5. **Run on your device:**
   - Install Expo Go app from your app store
   - Scan the QR code displayed in the terminal

## Configuration

- **Backend API**: Update `src/services/ApiService.js` with your server URL

## Requirements

- Node.js
- Expo CLI
- Mobile device with Expo Go app
