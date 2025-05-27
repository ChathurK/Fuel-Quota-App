# Fuel Quota Management System - Frontend

A React-based web application for managing fuel quotas, providing interfaces for administrators, station owners, and vehicle owners.

## Quick Start

1. **Clone the repository and navigate to the frontend folder:**
   ```powershell
   git clone <repo-url>
   cd frontend
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Configure the backend API:**
   - Open `src/services/ApiService.js`
   - Update the base URL to point to your backend server:
     ```javascript
     export const API_BASE_URL = 'http://localhost:8080/api';
     ```
   - **Note**: Ensure the port (8080) matches your backend server configuration

4. **Start the development server:**
   ```powershell
   npm start
   ```
   - The app will automatically open in your browser at [http://localhost:3000](http://localhost:3000)
   - The page will reload when you make changes

5. **Verify backend connection:**
   - Make sure your backend server is running before starting the frontend
   - Check the browser console for any API connection errors

## Configuration

### Backend API Configuration
The frontend needs to communicate with the backend API. Configure the connection in:
```javascript
// src/services/ApiService.js
export const API_BASE_URL = 'http://your-backend-server:8080/api';
```

### Default User Roles
The application supports three user roles:
- **Admin**: Full system management
- **Station Owner**: Station and transaction management  
- **Vehicle Owner**: Vehicle registration and quota checking

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Main application pages
│   ├── AdminDashboard.js
│   ├── StationDashboard.js
│   ├── VehicleDashboard.js
│   └── ...
├── services/           # API and authentication services
└── utils/              # Utility functions
```

## Requirements

- Node.js (v14 or higher)
- npm or yarn
- Running backend server (see backend README for setup)

## Troubleshooting

### Common Issues

1. **API Connection Errors:**
   - Verify backend server is running
   - Check API_BASE_URL in `src/services/ApiService.js`
   - Ensure CORS is properly configured in backend

2. **Login Issues:**
   - Verify database is running and populated
   - Check backend logs for authentication errors

3. **Build Errors:**
   ```powershell
   # Clear node_modules and reinstall
   Remove-Item -Recurse -Force node_modules
   Remove-Item package-lock.json
   npm install
   ```

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm test`
Launches the test runner in interactive watch mode

### `npm run build`
Builds the app for production to the `build` folder.\
The build is minified and optimized for best performance.

### `npm run eject`
**Note: This is a one-way operation. Once you `eject`, you can't go back!**

## Additional Resources

- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React Documentation](https://reactjs.org/)
- Backend Setup: See `../backend/README.md`

---

*This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).*
