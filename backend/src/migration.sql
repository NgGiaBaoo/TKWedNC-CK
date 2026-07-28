-- ============================================================
-- Migration: Khởi tạo Database cho Hệ thống Quản lý Tuyển dụng
-- Target: MySQL 8.x+
-- ============================================================
-- Cách chạy:
--   mysql -u <user> -p < backend/src/migration.sql
-- Hoặc đăng nhập MySQL rồi chạy:
--   source backend/src/migration.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS JOBRECRUITMENT
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE JOBRECRUITMENT;

-- ============================================================
-- Bảng: Users
-- Mục đích: Lưu trữ tài khoản người dùng để xác thực
-- ============================================================
CREATE TABLE IF NOT EXISTS Users (
    UserID       INT           NOT NULL AUTO_INCREMENT,
    Username     VARCHAR(50)   NOT NULL,
    PasswordHash VARCHAR(255)  NOT NULL,
    Role         ENUM('Admin', 'Employer', 'Candidate') NOT NULL DEFAULT 'Candidate',
    PRIMARY KEY (UserID),
    UNIQUE KEY UK_Users_Username (Username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Bảng: Employers
-- Mục đích: Lưu trữ thông tin doanh nghiệp / nhà tuyển dụng
-- ============================================================
CREATE TABLE IF NOT EXISTS Employers (
    EmployerID  INT           NOT NULL AUTO_INCREMENT,
    UserID      INT           NOT NULL,
    CompanyName VARCHAR(255)  NOT NULL,
    Email       VARCHAR(255)  NOT NULL,
    Phone       VARCHAR(20)   DEFAULT NULL,
    Address     VARCHAR(500)  DEFAULT NULL,
    PRIMARY KEY (EmployerID),
    UNIQUE KEY UK_Employers_UserID (UserID),
    KEY IX_Employers_CompanyName (CompanyName),
    CONSTRAINT FK_Employers_UserID FOREIGN KEY (UserID)
        REFERENCES Users (UserID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Bảng: Candidates
-- Mục đích: Lưu trữ thông tin ứng viên
-- ============================================================
CREATE TABLE IF NOT EXISTS Candidates (
    CandidateID INT           NOT NULL AUTO_INCREMENT,
    UserID      INT           NOT NULL,
    FullName    VARCHAR(100)  NOT NULL,
    Email       VARCHAR(255)  NOT NULL,
    Phone       VARCHAR(20)   DEFAULT NULL,
    Skills      TEXT          DEFAULT NULL,
    PRIMARY KEY (CandidateID),
    UNIQUE KEY UK_Candidates_UserID (UserID),
    CONSTRAINT FK_Candidates_UserID FOREIGN KEY (UserID)
        REFERENCES Users (UserID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Bảng: Jobs
-- Mục đích: Lưu trữ tin tuyển dụng do nhà tuyển dụng đăng
-- ============================================================
CREATE TABLE IF NOT EXISTS Jobs (
    JobID       INT            NOT NULL AUTO_INCREMENT,
    JobTitle    VARCHAR(255)   NOT NULL,
    Salary      DECIMAL(12,2)  DEFAULT NULL,
    Location    VARCHAR(255)   DEFAULT NULL,
    Description TEXT           DEFAULT NULL,
    EmployerID  INT            NOT NULL,
    PRIMARY KEY (JobID),
    KEY IX_Jobs_EmployerID (EmployerID),
    KEY IX_Jobs_Location (Location),
    CONSTRAINT FK_Jobs_EmployerID FOREIGN KEY (EmployerID)
        REFERENCES Employers (EmployerID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Bảng: Applications
-- Mục đích: Lưu trữ đơn ứng tuyển của ứng viên cho các tin tuyển dụng
-- ============================================================
CREATE TABLE IF NOT EXISTS Applications (
    ApplicationID INT           NOT NULL AUTO_INCREMENT,
    CandidateID   INT           NOT NULL,
    JobID         INT           NOT NULL,
    ApplyDate     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Status        ENUM('Pending', 'Reviewed', 'Accepted', 'Rejected') NOT NULL DEFAULT 'Pending',
    PRIMARY KEY (ApplicationID),
    KEY IX_Applications_CandidateID (CandidateID),
    KEY IX_Applications_JobID (JobID),
    KEY IX_Applications_Status (Status),
    CONSTRAINT FK_Applications_CandidateID FOREIGN KEY (CandidateID)
        REFERENCES Candidates (CandidateID) ON DELETE CASCADE,
    CONSTRAINT FK_Applications_JobID FOREIGN KEY (JobID)
        REFERENCES Jobs (JobID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
