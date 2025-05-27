# Fuel Quota Management Backend

## Quick Start

1. **Clone the repository and navigate to the backend folder:**
   ```powershell
   git clone <repo-url>
   cd backend
   ```

2. **Setup application properties:**
   ```powershell
   # Rename the backup configuration file
   mv src/main/resources/application.properties.bak src/main/resources/application.properties
   ```

3. **Configure the database:**
   - Create a new database (e.g., `fuel_quota_db`)
   - Open `src/main/resources/application.properties`
   - Update the database connection details:
     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/fuel_quota_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
     spring.datasource.username=your_db_username
     spring.datasource.password=your_db_password
     ```
   - **Note**: Ensure the port (3306) matches your MySQL server configuration

4. **Configure Twilio SMS (Optional but recommended):**
   - Sign up for a Twilio account at [https://www.twilio.com](https://www.twilio.com)
   - Get your Account SID, Auth Token, and phone number from Twilio Console
   - Update the following in `src/main/resources/application.properties`:
     ```properties
     twilio.account.sid=your_twilio_account_sid
     twilio.auth.token=your_twilio_auth_token
     twilio.phone.number=your_twilio_phone_number
     ```

5. **Build the project:**
   ```powershell
   ./mvnw clean install
   ```

6. **Run the application:**
   ```powershell
   ./mvnw spring-boot:run
   ```

   Or run the JAR file directly:
   ```powershell
   java -jar target/fuelQuotaManagementSystem-0.0.1-SNAPSHOT.jar
   ```

   **Important**: On the first run, the application will automatically:
   - Create all necessary database tables
   - Initialize 3 default users for testing:
     - **Admin**: username: `admin`, password: `password`
     - **Station Owner**: username: `station`, password: `password`
     - **Vehicle Owner**: username: `vehicle`, password: `password`


### Important Security Note
The repository includes `application.properties.bak` instead of `application.properties` to avoid exposing sensitive credentials on GitHub. You must rename this file and configure your credentials as shown in the Quick Start guide.


## API Endpoints

The backend provides comprehensive RESTful APIs:

### Authentication & User Management
- `POST /api/auth/signin` - User authentication with JWT tokens
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signout` - User logout

### Vehicle Management
- `GET /api/vehicles/my-vehicles` - List user's vehicles
- `POST /api/vehicles/register` - Register new vehicle with QR generation
- `GET /api/fuel/quota/vehicle/{vehicleId}` - Check vehicle quota
- `GET /api/fuel/quota/scan/{qrData}` - QR code-based quota verification

### Fuel Station Operations
- `POST /api/station/register` - Register new fuel station
- `GET /api/station/{stationId}/dashboard` - Station dashboard with statistics
- `POST /api/fuel/pump` - Record fuel dispensing transaction
- `GET /api/fuel/transactions/station/{stationId}` - Station transaction history

### Administrative Functions
- `GET /api/admin/reports/**` - Various system reports
- `POST /api/admin/quota/bulk-allocate` - Bulk quota allocation
- `POST /api/admin/quota/reset-all` - Emergency quota reset
- `GET /api/admin/system/health` - System health monitoring

### Transaction Processing
- `GET /api/fuel/transactions/vehicle/{vehicleId}` - Vehicle transaction history
- `POST /api/fuel/quota/reset/{vehicleId}` - Admin quota reset (testing)

The API will be available at `http://localhost:8080`

## Requirements

- Java 11 or higher
- Maven (included via wrapper)
- Database (MySQL/PostgreSQL)
