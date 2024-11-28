-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 28, 2024 at 10:01 AM
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
-- Table structure for table `tbl_dept`
--

CREATE TABLE `tbl_dept` (
  `dept_id` int(11) NOT NULL,
  `dept_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tbl_dept`
--

INSERT INTO `tbl_dept` (`dept_id`, `dept_name`) VALUES
(1, 'Die Casting'),
(2, 'Plastic Operation'),
(3, 'Painting'),
(4, 'Assembly-1'),
(5, 'Assembly-2'),
(6, 'Production Control'),
(7, 'Procurement'),
(8, 'Production Engineering'),
(9, 'Die Making'),
(10, 'Quality Management System & Training'),
(11, 'Human Resource & General Affairs'),
(12, 'Accounting'),
(13, 'New Model Promotion'),
(14, 'Purchasing'),
(15, 'Business Control'),
(16, 'Quality Assurance'),
(17, 'Sale'),
(18, 'Factory Management Control'),
(19, 'Safety&Environmental Control'),
(20, 'Thai Management'),
(21, 'Parts Quality & Measurement');

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
  `repair_type` enum('Facility','Utility','Electrical System','Other') NOT NULL,
  `other_type` text DEFAULT NULL,
  `date_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `r_pic1` longblob NOT NULL,
  `r_pic2` longblob DEFAULT NULL,
  `r_pic3` longblob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tbl_requests`
--

INSERT INTO `tbl_requests` (`req_id`, `u_id`, `repair_item`, `sympton_def`, `location_n`, `repair_type`, `other_type`, `date_time`, `r_pic1`, `r_pic2`, `r_pic3`) VALUES
(1, 3, 'หลังเป็นสนิม', 'ผุกร่อน', 'หน้าแผนก PO', 'Facility', NULL, '2024-11-28 08:56:34', 0x6631636633613665323036393036336133396538353164306234666233303839, NULL, NULL);

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
(4, 'mgr_user');

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
  `role_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tbl_users`
--

INSERT INTO `tbl_users` (`u_id`, `u_name`, `u_pass`, `u_mail`, `f_name`, `l_name`, `dept_id`, `role_id`) VALUES
(1, 'admin_test', '1234', '64160194@go.buu.ac.th', 'admin', 'test', 11, 1),
(2, 'mgr_admin', '1234', 'grosspornpailin@gmail.com', 'mgradmin', 'test', 11, 2),
(3, 'user_test', '1234', 'testuserrepair1@gmail.com', 'user', 'test', 8, 3),
(4, 'mgr_user', '1234', 'manager_user@gmail.com', 'mgr', 'user', 8, 4);

--
-- Indexes for dumped tables
--

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
  ADD KEY `u_id` (`u_id`);

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
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_dept`
--
ALTER TABLE `tbl_dept`
  MODIFY `dept_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `tbl_requests`
--
ALTER TABLE `tbl_requests`
  MODIFY `req_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tbl_users`
--
ALTER TABLE `tbl_users`
  MODIFY `u_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_requests`
--
ALTER TABLE `tbl_requests`
  ADD CONSTRAINT `tbl_requests_ibfk_1` FOREIGN KEY (`u_id`) REFERENCES `tbl_users` (`u_id`);

--
-- Constraints for table `tbl_users`
--
ALTER TABLE `tbl_users`
  ADD CONSTRAINT `tbl_users_ibfk_1` FOREIGN KEY (`dept_id`) REFERENCES `tbl_dept` (`dept_id`),
  ADD CONSTRAINT `tbl_users_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `tbl_role` (`role_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
