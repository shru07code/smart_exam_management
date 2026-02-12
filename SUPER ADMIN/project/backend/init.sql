-- init.sql
DROP DATABASE IF EXISTS attendance_system;
CREATE DATABASE attendance_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE attendance_system;

-- Super admin users (one admin account)
CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- officers
CREATE TABLE officers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(200),
  phone VARCHAR(50),
  department VARCHAR(150),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- institutes
CREATE TABLE institutes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- distribution centers (DCs)
CREATE TABLE dcs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- officer in-charge details (detailed)
CREATE TABLE officer_details (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  qualification VARCHAR(255),
  designation VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- exam controllers
CREATE TABLE exam_controllers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  qualification VARCHAR(255),
  designation VARCHAR(255),
  institute_code VARCHAR(50),
  institute_name VARCHAR(255),
  msbte_order_no VARCHAR(100),
  order_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- msbte orders
CREATE TABLE msbte_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  msbte_order VARCHAR(255) NOT NULL,
  order_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- rac q papers
CREATE TABLE rac_qpapers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- data entries (generic)
CREATE TABLE data_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- billing records
CREATE TABLE billing_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer VARCHAR(255) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- exam names
CREATE TABLE exam_names (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
