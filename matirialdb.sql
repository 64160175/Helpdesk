-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 29, 2024 at 06:24 AM
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
-- Database: `matirialdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_add_item`
--

CREATE TABLE `tbl_add_item` (
  `id_add_item` int(11) NOT NULL,
  `i_brand` varchar(255) NOT NULL,
  `i_picture` longblob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_emp_section`
--

CREATE TABLE `tbl_emp_section` (
  `id_emp_section` int(11) NOT NULL,
  `section` varchar(255) NOT NULL,
  `status` enum('active','inactive') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tbl_emp_section`
--

INSERT INTO `tbl_emp_section` (`id_emp_section`, `section`, `status`) VALUES
(1, 'Die Casting', 'active'),
(2, 'Plastic Operation', 'active'),
(3, 'Painting', 'active'),
(4, 'Assembly-1', 'active'),
(5, 'Assembly-2', 'active'),
(6, 'Production Control', 'active'),
(7, 'Procurement', 'active'),
(8, 'Production Engineering', 'active'),
(9, 'Die Making', 'active'),
(10, 'Quality Management System & Training', 'active'),
(11, 'Human Resource & General Affairs', 'active'),
(12, 'Accounting', 'active'),
(13, 'New Model Promotion', 'active'),
(14, 'Purchasing', 'active'),
(15, 'Business Control', 'active'),
(16, 'Quality Assurance', 'active'),
(17, 'Sale', 'active'),
(18, 'Factory Management Control', 'active'),
(19, 'Safety & Environmental Control', 'active'),
(20, 'Thai Management', 'active'),
(21, 'Parts Quality & Measurement', 'active'),
(22, 'HONDA LOCK THAI CO., LTD', 'active'),
(23, 'admin', 'inactive');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_item_stock`
--

CREATE TABLE `tbl_item_stock` (
  `id_item_stock` int(11) NOT NULL,
  `id_add_item` int(11) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user`
--

CREATE TABLE `tbl_user` (
  `id_user` int(11) NOT NULL,
  `u_name` varchar(255) NOT NULL,
  `u_pass` varchar(255) NOT NULL,
  `f_name` varchar(255) DEFAULT NULL,
  `l_name` varchar(255) DEFAULT NULL,
  `u_type` enum('admin','manager','user') NOT NULL,
  `id_emp_section` int(11) NOT NULL,
  `u_status` enum('active','inactive') NOT NULL,
  `email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `tbl_user`
--

INSERT INTO `tbl_user` (`id_user`, `u_name`, `u_pass`, `f_name`, `l_name`, `u_type`, `id_emp_section`, `u_status`, `email`) VALUES
(0, 'diecast_mgr', '1234', 'die', 'mgr', 'manager', 1, 'active', 'diecast@minebea-as.com'),
(1, 'admin', '1234', 'นายแอดมิน', 'ปริ้นเตอร์', 'admin', 23, 'active', '64160175@go.buu.ac.th'),
(2, 'hrgen_mgr', '1234', 'นายเมเนเจอร์', 'ปริ้นเตอร์', 'manager', 11, 'active', 'masth0user1@gmail.com'),
(3, 'hrgen_user', '1234', NULL, NULL, 'user', 11, 'active', NULL),
(4, 'diecast_user', '1234', NULL, NULL, 'user', 1, 'active', NULL),
(5, 'plasticop_mgr', '1234', 'plastic', 'oop', 'manager', 2, 'active', 'plastic@minebea-as.com'),
(6, 'plasticop_user', '1234', NULL, NULL, 'user', 2, 'inactive', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_add_item`
--
ALTER TABLE `tbl_add_item`
  ADD PRIMARY KEY (`id_add_item`);

--
-- Indexes for table `tbl_emp_section`
--
ALTER TABLE `tbl_emp_section`
  ADD PRIMARY KEY (`id_emp_section`);

--
-- Indexes for table `tbl_item_stock`
--
ALTER TABLE `tbl_item_stock`
  ADD PRIMARY KEY (`id_item_stock`),
  ADD KEY `id_add_item_fk` (`id_add_item`);

--
-- Indexes for table `tbl_user`
--
ALTER TABLE `tbl_user`
  ADD PRIMARY KEY (`id_user`),
  ADD KEY `id_emp_section_fk` (`id_emp_section`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_add_item`
--
ALTER TABLE `tbl_add_item`
  MODIFY `id_add_item` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `tbl_emp_section`
--
ALTER TABLE `tbl_emp_section`
  MODIFY `id_emp_section` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `tbl_item_stock`
--
ALTER TABLE `tbl_item_stock`
  MODIFY `id_item_stock` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_item_stock`
--
ALTER TABLE `tbl_item_stock`
  ADD CONSTRAINT `id_add_item_fk` FOREIGN KEY (`id_add_item`) REFERENCES `tbl_add_item` (`id_add_item`);

--
-- Constraints for table `tbl_user`
--
ALTER TABLE `tbl_user`
  ADD CONSTRAINT `id_emp_section_fk` FOREIGN KEY (`id_emp_section`) REFERENCES `tbl_emp_section` (`id_emp_section`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
