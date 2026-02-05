-- Create users table for authentication (SQL Server)
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
CREATE TABLE users (
  id INT IDENTITY(1,1) PRIMARY KEY,
  username NVARCHAR(50) UNIQUE NOT NULL,
  password NVARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT GETDATE()
);

-- Insert sample users (use proper password hashing in production)
IF NOT EXISTS (SELECT * FROM users WHERE username = 'admin')
INSERT INTO users (username, password) VALUES 
('admin', 'admin123'),
('user1', 'password123');

-- Example BioStar table structure (T_LG202602)
-- Note: These tables should already exist in your BioStar database
-- This is just for reference
/*
CREATE TABLE T_LG202602 (
  EVTLGUID NVARCHAR(50) PRIMARY KEY,
  SRVDT BIGINT,
  DEVDT BIGINT,
  USRID NVARCHAR(50),
  EVT INT,
  DEVUID NVARCHAR(50),
  created_at DATETIME DEFAULT GETDATE()
);
*/