-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 26, 2024 at 03:31 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `general_repairing`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_approve`
--

CREATE TABLE `tbl_approve` (
  `approve_id` int(11) NOT NULL,
  `app_mgr` varchar(50) DEFAULT NULL,
  `app_hrga` varchar(50) DEFAULT NULL,
  `app_admin` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_dept`
--

CREATE TABLE `tbl_dept` (
  `dept_id` int(11) NOT NULL,
  `dept_name` varchar(255) NOT NULL,
  `dept_status` tinyint(1) NOT NULL DEFAULT 1 COMMENT '1=Active, 0=Inactive'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tbl_dept`
--

INSERT INTO `tbl_dept` (`dept_id`, `dept_name`, `dept_status`) VALUES
(0, 'Die Casting', 1),
(1, 'Plastic  Operation', 1),
(2, 'Painting', 1),
(3, 'Assembly-1', 1),
(4, 'Assembly-2', 1),
(5, 'Production Control', 1),
(6, 'Procurement', 1),
(7, 'Production Engineering', 1),
(8, 'Die Making', 1),
(9, 'Quality Management System & Training', 1),
(10, 'Human Resource & General Affairs', 1),
(11, 'Accounting', 1),
(12, 'New Model Promotion', 1),
(13, 'Purchasing', 1),
(14, 'Business Control', 1),
(15, 'Quality Assurance', 1),
(16, 'Sale', 1),
(17, 'Factory Management Control', 1),
(18, 'Safety&Environmental Control', 1),
(19, 'Thai Management', 1),
(20, 'Parts Quality & Measurement', 1),
(21, 'Nct Dream', 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_requests`
--

CREATE TABLE `tbl_requests` (
  `req_id` int(11) NOT NULL,
  `u_id` int(11) DEFAULT NULL,
  `repair_item` text NOT NULL,
  `sympton_def` text NOT NULL,
  `location_n` text NOT NULL,
  `repair_type` enum('Facility (อาคารสถานที่)','Utility (สาธารณูปโภค)','Electrical System (ระบบไฟฟ้า)','Other (อื่น ๆ)') NOT NULL,
  `other_type` text DEFAULT NULL,
  `date_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `r_pic1` longblob NOT NULL,
  `r_pic2` longblob DEFAULT NULL,
  `r_pic3` longblob DEFAULT NULL,
  `worker_id` int(11) DEFAULT NULL,
  `approve_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_role`
--

CREATE TABLE `tbl_role` (
  `role_id` int(11) NOT NULL,
  `role_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tbl_role`
--

INSERT INTO `tbl_role` (`role_id`, `role_name`) VALUES
(1, 'admin'),
(2, 'mgr_admin'),
(3, 'user'),
(4, 'Manager');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_users`
--

CREATE TABLE `tbl_users` (
  `u_id` int(11) NOT NULL,
  `u_name` varchar(50) NOT NULL,
  `u_pass` varchar(255) NOT NULL,
  `u_mail` varchar(255) DEFAULT NULL,
  `f_name` varchar(100) NOT NULL,
  `l_name` varchar(100) NOT NULL,
  `dept_id` int(11) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL,
  `u_status` tinyint(1) DEFAULT 1 COMMENT '1=Active, 0=Inactive'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tbl_users`
--

INSERT INTO `tbl_users` (`u_id`, `u_name`, `u_pass`, `u_mail`, `f_name`, `l_name`, `dept_id`, `role_id`, `u_status`) VALUES
(1, 'admin_test', '1234', '64160194@go.buu.ac.th', 'admin', 'test', 10, 1, 1),
(2, 'mgr_admin', '1234', 'grosspornpailin@gmail.com', 'mgradmin', 'test', 10, 2, 1),
(3, 'user_test', '1234', 'testuserrepair1@gmail.com', 'user', 'test', 7, 3, 1),
(4, 'mgr_user', '1234', 'manager_user@gmail.com', 'mgr', 'user', 7, 4, 1),
(5, 'JM', '1234', 'jaeminnana@gmail.com', 'Jaemin', 'Na', 21, 1, 1),
(6, 'kris', '1234', 'topza@gmail.com', 'Wannabe', 'Ontop', 10, 3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_worker`
--

CREATE TABLE `tbl_worker` (
  `worker_id` int(11) NOT NULL,
  `survey_results` enum('can be fix','can''t fix') DEFAULT NULL,
  `edit_details` text DEFAULT NULL,
  `date_by` date DEFAULT NULL,
  `finish_time` varchar(50) DEFAULT NULL,
  `req_id` int(11) DEFAULT NULL,
  `worker_status` tinyint(1) DEFAULT 0,
  `edit_by` varchar(50) DEFAULT NULL,
  `budget_by` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_approve`
--
ALTER TABLE `tbl_approve`
  ADD PRIMARY KEY (`approve_id`);

--
-- Indexes for table `tbl_dept`
--
ALTER TABLE `tbl_dept`
  ADD PRIMARY KEY (`dept_id`);

--
-- Indexes for table `tbl_requests`
--
ALTER TABLE `tbl_requests`
  ADD PRIMARY KEY (`req_id`),
  ADD KEY `u_id` (`u_id`),
  ADD KEY `fk_worker_id` (`worker_id`),
  ADD KEY `fk_approve_id` (`approve_id`);

--
-- Indexes for table `tbl_role`
--
ALTER TABLE `tbl_role`
  ADD PRIMARY KEY (`role_id`);

--
-- Indexes for table `tbl_users`
--
ALTER TABLE `tbl_users`
  ADD PRIMARY KEY (`u_id`),
  ADD KEY `dept_id` (`dept_id`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `tbl_worker`
--
ALTER TABLE `tbl_worker`
  ADD PRIMARY KEY (`worker_id`),
  ADD KEY `fk_req_id` (`req_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_requests`
--
ALTER TABLE `tbl_requests`
  ADD CONSTRAINT `fk_approve_id` FOREIGN KEY (`approve_id`) REFERENCES `tbl_approve` (`approve_id`),
  ADD CONSTRAINT `fk_worker_id` FOREIGN KEY (`worker_id`) REFERENCES `tbl_worker` (`worker_id`),
  ADD CONSTRAINT `tbl_requests_ibfk_1` FOREIGN KEY (`u_id`) REFERENCES `tbl_users` (`u_id`);

--
-- Constraints for table `tbl_users`
--
ALTER TABLE `tbl_users`
  ADD CONSTRAINT `tbl_users_ibfk_1` FOREIGN KEY (`dept_id`) REFERENCES `tbl_dept` (`dept_id`),
  ADD CONSTRAINT `tbl_users_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `tbl_role` (`role_id`);

--
-- Constraints for table `tbl_worker`
--
ALTER TABLE `tbl_worker`
  ADD CONSTRAINT `fk_req_id` FOREIGN KEY (`req_id`) REFERENCES `tbl_requests` (`req_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
