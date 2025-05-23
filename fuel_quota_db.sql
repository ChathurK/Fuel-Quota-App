CREATE SCHEMA IF NOT EXISTS fuel_quota_db;
USE fuel_quota_db;

-- Clean Fuel Quota Database Script
-- Run this script to create and populate all tables

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

-- Insert data into users table
INSERT INTO users VALUES 
(1,1747904509516,'dulan@gmail.com','Dulan Samarasingha','$2a$10$jzppZlFQpxoph13gGMolg.FhK21FZnWt4t/zcat.vqm5Orhv0aI46','',1747904509516,'dulan'),
(2,1747904598856,'tharindu@gmail.com','Tharindu Padmasiri','$2a$10$c1QUlLygvJykj4cneKzk2e1V3cqOYuEsNjAa70qpZ463Hjof131dO','0764007562',1747904598856,'tharindu'),
(3,1747904838370,'admin@gmail.com','Admin User','$2a$10$TPWU0TLSLOITGfvVcO5OuuMaiugllG9voaqVUNgTZFVd2JoZnlWQy','0764007462',1747904838370,'admin'),
(4,1747921755830,'chathura@gmail.com','Chathura Putha','$2a$10$HQH04U9tjVRXfCqITo.XSe9XSCklxTsWyBeIgRRdnEJ9TUVL3wzKm','+94702923943',1747944189374,'chathura');

-- Insert data into user_roles table
INSERT INTO user_roles VALUES 
(1,'ROLE_VEHICLE_OWNER'),
(2,'ROLE_STATION_OWNER'),
(3,'ROLE_ADMIN'),
(4,'ROLE_VEHICLE_OWNER');

-- Insert data into vehicles table
INSERT INTO vehicles VALUES 
(1,'MZGA22L3L3001234',1747925192738,1800,'Petrol','eyJyZWdObyI6IlNHUC1DQUItNjkyNyIsImVuZ2luZSI6MTgwMC4wLCJmdWVsIjoiUGV0cm9sIiwiY2hhc3NpcyI6Ik1aR0EyMkwzTDMwMDEyMzQiLCJ0eXBlIjoiQ2FyIiwiaGFzaCI6InJQVjJCdUR0WVVwZkFUL3cvVXVISyszTjNMTkdBTWxIYldtNTJVN0tSaGM9IiwidGltZXN0YW1wIjoxNzQ3OTI1MTkyNzI1fQ==','SGP-CAB-6927',1747925192738,'Car',4),
(2,'TATLD22L3M4001234',1747934773604,3000,'Diesel','eyJyZWdObyI6IldQLUxELTEyMzQiLCJlbmdpbmUiOjMwMDAuMCwiZnVlbCI6IkRpZXNlbCIsImNoYXNzaXMiOiJUQVRMRDIyTDNNNDAwMTIzNCIsInR5cGUiOiJMb3JyeSIsImhhc2giOiIxTEN4T0VYd3B1WFpGV09aUSsyTHQ0akFrR2IrNUtSTEFBb29EM3lzdkxnPSIsInRpbWVzdGFtcCI6MTc0NzkzNDc3MzU5OH0=','WP-LD-1234',1747934773604,'Lorry',1);

-- Insert data into fuel_stations table
INSERT INTO fuel_stations VALUES 
(1,'No18, Kapugalla Housing Scheme, Horana.','Horana','0764007562',1747928479514,b'1',b'1',b'1','Higurakgoda Filling Station','SR-ABC-2025',1747937213382,2);

-- Insert data into fuel_quotas table
INSERT INTO fuel_quotas VALUES 
(1,60,'MONTHLY',1747925195852,1748716199000,'Petrol',0.5,1746037800000,1747944243085,1),
(2,200,'MONTHLY',1747934776661,1748716199000,'Diesel',100,1746037800000,1747934800171,2);

-- Insert data into fuel_transactions table
INSERT INTO fuel_transactions VALUES 
(1,50,'Petrol',b'1',10,60,1747932756522,1,1),
(2,5,'Petrol',b'1',5,10,1747934635595,1,1),
(3,100,'Diesel',b'1',100,200,1747934800176,1,2),
(4,2,'Petrol',b'1',3,5,1747937162579,1,1),
(5,1,'Petrol',b'1',2,3,1747943028058,1,1),
(6,1,'Petrol',b'0',1,2,1747943472407,1,1),
(7,0.5,'Petrol',b'1',0.5,1,1747944243107,1,1);