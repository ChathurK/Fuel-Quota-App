CREATE SCHEMA IF NOT EXISTS fuel_quota_db;
USE fuel_quota_db;


-- Create users table
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id bigint NOT NULL AUTO_INCREMENT,
  created_at bigint DEFAULT NULL,
  email varchar(255) NOT NULL,
  full_name varchar(255) DEFAULT NULL,
  password varchar(255) NOT NULL,
  phone_number varchar(255) DEFAULT NULL,
  updated_at bigint DEFAULT NULL,
  username varchar(255) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY UK_email (email),
  UNIQUE KEY UK_username (username)
);

-- Create user_roles table
DROP TABLE IF EXISTS user_roles;
CREATE TABLE user_roles (
  user_id bigint NOT NULL,
  roles enum('ROLE_ADMIN','ROLE_STATION_OWNER','ROLE_VEHICLE_OWNER') DEFAULT NULL,
  KEY FK_user_roles_user_id (user_id),
  CONSTRAINT FK_user_roles_user_id FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Create vehicles table
DROP TABLE IF EXISTS vehicles;
CREATE TABLE vehicles (
  id bigint NOT NULL AUTO_INCREMENT,
  chassis_number varchar(255) NOT NULL,
  created_at bigint DEFAULT NULL,
  engine_capacity double DEFAULT NULL,
  fuel_type varchar(255) NOT NULL,
  qr_code text,
  registration_number varchar(255) NOT NULL,
  updated_at bigint DEFAULT NULL,
  vehicle_type varchar(255) NOT NULL,
  owner_id bigint NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY UK_registration_number (registration_number),
  KEY FK_vehicles_owner_id (owner_id),
  CONSTRAINT FK_vehicles_owner_id FOREIGN KEY (owner_id) REFERENCES users (id)
);

-- Create fuel_stations table
DROP TABLE IF EXISTS fuel_stations;
CREATE TABLE fuel_stations (
  id bigint NOT NULL AUTO_INCREMENT,
  address varchar(255) DEFAULT NULL,
  city varchar(255) DEFAULT NULL,
  contact_number varchar(255) DEFAULT NULL,
  created_at bigint DEFAULT NULL,
  has_diesel bit(1) NOT NULL,
  has_petrol bit(1) NOT NULL,
  is_active bit(1) NOT NULL,
  name varchar(255) NOT NULL,
  registration_number varchar(255) NOT NULL,
  updated_at bigint DEFAULT NULL,
  owner_id bigint NOT NULL,
  PRIMARY KEY (id),
  KEY FK_fuel_stations_owner_id (owner_id),
  CONSTRAINT FK_fuel_stations_owner_id FOREIGN KEY (owner_id) REFERENCES users (id)
);

-- Create fuel_quotas table
DROP TABLE IF EXISTS fuel_quotas;
CREATE TABLE fuel_quotas (
  id bigint NOT NULL AUTO_INCREMENT,
  allocated_quota double NOT NULL,
  allocation_period varchar(255) DEFAULT NULL,
  created_at bigint DEFAULT NULL,
  end_date bigint DEFAULT NULL,
  fuel_type varchar(255) NOT NULL,
  remaining_quota double NOT NULL,
  start_date bigint DEFAULT NULL,
  updated_at bigint DEFAULT NULL,
  vehicle_id bigint NOT NULL,
  PRIMARY KEY (id),
  KEY FK_fuel_quotas_vehicle_id (vehicle_id),
  CONSTRAINT FK_fuel_quotas_vehicle_id FOREIGN KEY (vehicle_id) REFERENCES vehicles (id)
);

-- Create fuel_transactions table
DROP TABLE IF EXISTS fuel_transactions;
CREATE TABLE fuel_transactions (
  id bigint NOT NULL AUTO_INCREMENT,
  amount double NOT NULL,
  fuel_type varchar(255) NOT NULL,
  notification_sent bit(1) NOT NULL,
  quota_after_transaction double NOT NULL,
  quota_before_transaction double NOT NULL,
  timestamp bigint DEFAULT NULL,
  station_id bigint NOT NULL,
  vehicle_id bigint NOT NULL,
  PRIMARY KEY (id),
  KEY FK_fuel_transactions_station_id (station_id),
  KEY FK_fuel_transactions_vehicle_id (vehicle_id),
  CONSTRAINT FK_fuel_transactions_station_id FOREIGN KEY (station_id) REFERENCES fuel_stations (id),
  CONSTRAINT FK_fuel_transactions_vehicle_id FOREIGN KEY (vehicle_id) REFERENCES vehicles (id)
);