IF DB_ID('ai_micro_health') IS NULL
BEGIN
  CREATE DATABASE ai_micro_health;
END
GO

USE ai_micro_health;
GO

IF OBJECT_ID('dbo.notifications', 'U') IS NOT NULL DROP TABLE dbo.notifications;
IF OBJECT_ID('dbo.recommendations', 'U') IS NOT NULL DROP TABLE dbo.recommendations;
IF OBJECT_ID('dbo.health_data', 'U') IS NOT NULL DROP TABLE dbo.health_data;
IF OBJECT_ID('dbo.users', 'U') IS NOT NULL DROP TABLE dbo.users;
GO

CREATE TABLE users (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name NVARCHAR(100) NOT NULL,
  email NVARCHAR(150) NOT NULL UNIQUE,
  password NVARCHAR(255) NOT NULL,
  created_at DATETIME2 DEFAULT SYSDATETIME()
);
GO

CREATE TABLE health_data (
  id INT IDENTITY(1,1) PRIMARY KEY,
  user_id INT NOT NULL,
  sleep_hours DECIMAL(4,2) NOT NULL,
  step_count INT NOT NULL,
  water_amount DECIMAL(4,2) NOT NULL,
  stress_level INT NOT NULL,
  created_at DATETIME2 DEFAULT SYSDATETIME(),
  CONSTRAINT fk_health_user FOREIGN KEY (user_id) REFERENCES users(id)
);
GO

CREATE TABLE recommendations (
  id INT IDENTITY(1,1) PRIMARY KEY,
  user_id INT NOT NULL,
  recommendation_text NVARCHAR(MAX) NOT NULL,
  created_at DATETIME2 DEFAULT SYSDATETIME(),
  CONSTRAINT fk_recommendation_user FOREIGN KEY (user_id) REFERENCES users(id)
);
GO

CREATE TABLE notifications (
  id INT IDENTITY(1,1) PRIMARY KEY,
  user_id INT NOT NULL,
  notification_text NVARCHAR(MAX) NOT NULL,
  is_read BIT DEFAULT 0,
  created_at DATETIME2 DEFAULT SYSDATETIME(),
  CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id)
);
GO

-- Fake ornek veri (sifre: 123456)
IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'demo@healthcoach.com')
BEGIN
  INSERT INTO users (name, email, password)
  VALUES ('Demo User', 'demo@healthcoach.com', '$2a$10$QfXD4F5sLhA0JxE3lA5eQ.g5z7FZ5Yx5i6T4J0C8Q8xq9eA3xk3fG');
END
GO

IF EXISTS (SELECT 1 FROM users WHERE id = 1)
BEGIN
  INSERT INTO health_data (user_id, sleep_hours, step_count, water_amount, stress_level)
  VALUES (1, 5.5, 4200, 1.2, 8);
END
GO
