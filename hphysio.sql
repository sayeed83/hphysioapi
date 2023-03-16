-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 15, 2023 at 07:58 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hphysio`
--

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `my_subscription`
--

CREATE TABLE `my_subscription` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `subscription_id` bigint(20) NOT NULL,
  `validity` varchar(255) NOT NULL,
  `price` varchar(255) NOT NULL,
  `start_date` varchar(255) NOT NULL,
  `end_date` varchar(255) NOT NULL,
  `transaction_id` bigint(20) NOT NULL,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `professional_info`
--

CREATE TABLE `professional_info` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `specialization_id` bigint(20) NOT NULL,
  `state_of_practice` varchar(255) NOT NULL,
  `reg_no` varchar(255) NOT NULL,
  `validity` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `professional_info`
--

INSERT INTO `professional_info` (`id`, `user_id`, `specialization_id`, `state_of_practice`, `reg_no`, `validity`, `created_at`, `updated_at`) VALUES
(1, 7, 1, 'test', 'SFSDF1213', '3 YEARS', '2023-03-13 22:00:00', '2023-03-13 22:00:00'),
(2, 7, 1, 'test', 'SFSDF1213', '3 YEARS', '2023-03-13 22:00:00', '2023-03-13 22:00:00'),
(3, 7, 1, 'test', 'SFSDF1213', '3 YEARS', '2023-03-13 22:00:00', '2023-03-13 22:00:00'),
(4, 7, 1, 'test', 'SFSDF1213', '3 YEARS', '2023-03-13 22:00:00', '2023-03-13 22:00:00'),
(5, 7, 1, 'test', 'SFSDF1213', '3 YEARS', '2023-03-13 22:00:00', '2023-03-13 22:00:00'),
(6, 7, 1, 'test', 'SFSDF1213', '3 YEARS', '2023-03-13 22:00:00', '2023-03-13 22:00:00'),
(7, 7, 1, 'test', 'SFSDF1213', '3 YEARS', '2023-03-13 22:00:00', '2023-03-13 22:00:00'),
(8, 7, 1, 'test', 'SFSDF1213', '3 YEARS', '2023-03-13 22:00:00', '2023-03-13 22:00:00'),
(9, 7, 1, 'test', 'SFSDF1213', '3 YEARS', '2023-03-13 22:00:00', '2023-03-13 22:00:00'),
(10, 7, 1, 'test', 'SFSDF1213', '3 YEARS', '2023-03-13 22:00:00', '2023-03-13 22:00:00'),
(11, 7, 1, 'test', 'SFSDF1213', '3 YEARS', '2023-03-13 22:00:00', '2023-03-13 22:00:00'),
(12, 7, 1, 'test', 'SFSDF1213', '3 YEARS', '2023-03-13 22:00:00', '2023-03-13 22:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` bigint(20) NOT NULL,
  `service_name` varchar(255) NOT NULL,
  `status` int(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `specialization`
--

CREATE TABLE `specialization` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `status` int(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `specialization`
--

INSERT INTO `specialization` (`id`, `name`, `status`, `created_at`) VALUES
(1, 'Neuro', 1, '2023-03-12 10:14:41'),
(2, 'Ortho', 1, '2023-03-13 18:26:25'),
(3, 'pediatric', 1, '2023-03-13 18:26:25'),
(4, 'Geriatric', 1, '2023-03-13 18:26:25'),
(5, 'Cardio', 1, '2023-03-13 18:26:25'),
(6, 'Sports', 1, '2023-03-13 18:26:25');

-- --------------------------------------------------------

--
-- Table structure for table `status`
--

CREATE TABLE `status` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `status`
--

INSERT INTO `status` (`id`, `name`) VALUES
(1, 'Not Verified'),
(2, 'Verified'),
(3, 'rejected'),
(4, 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `subscription_plan`
--

CREATE TABLE `subscription_plan` (
  `id` bigint(20) NOT NULL,
  `plan_name` varchar(255) NOT NULL,
  `price` varchar(255) NOT NULL,
  `validity` varchar(255) NOT NULL,
  `status` int(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `therapist_pref`
--

CREATE TABLE `therapist_pref` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `service_id` bigint(20) NOT NULL,
  `service_charge` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `subscription_id` bigint(20) NOT NULL,
  `txn_id` varchar(255) NOT NULL,
  `payment_id` varchar(255) NOT NULL,
  `txn_ref_no` varchar(255) NOT NULL,
  `txn_date` varchar(255) NOT NULL,
  `txn_type` varchar(255) NOT NULL,
  `txn_status` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(45) DEFAULT NULL,
  `fullName` varchar(45) DEFAULT NULL,
  `password` varchar(45) DEFAULT NULL,
  `userType` varchar(45) DEFAULT NULL,
  `mobileNumber` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `fullName`, `password`, `userType`, `mobileNumber`) VALUES
(5, 'test@gmail.com', 'test1', '123454', '1', 8000000001);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mobile_no` varchar(255) NOT NULL,
  `dob` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `state` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status_id` bigint(20) NOT NULL,
  `usertype_id` bigint(20) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `mobile_no`, `dob`, `city`, `state`, `address`, `password`, `status_id`, `usertype_id`, `created_at`, `updated_at`, `deleted_at`) VALUES
(7, 'test1', 'test1@gail.com', '9111111111', '1989-12-23', 'Mumbai', 'Maharashtra', 'Mumbai Maharashtra', '123456789', 1, 2, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(8, 'test1', 'test1@gail.com', '9111111111', '1989-12-23', 'Mumbai', 'Maharashtra', 'Mumbai Maharashtra', '123456789', 1, 2, '2023-03-12 13:00:00', '2023-03-12 13:00:00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `usertype`
--

CREATE TABLE `usertype` (
  `id` bigint(20) NOT NULL,
  `type` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `usertype`
--

INSERT INTO `usertype` (`id`, `type`) VALUES
(1, 'Client'),
(2, 'Therapist');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `my_subscription`
--
ALTER TABLE `my_subscription`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `subscription_id` (`subscription_id`),
  ADD KEY `transaction_id` (`transaction_id`);

--
-- Indexes for table `professional_info`
--
ALTER TABLE `professional_info`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `specialization_id` (`specialization_id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `specialization`
--
ALTER TABLE `specialization`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `status`
--
ALTER TABLE `status`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `subscription_plan`
--
ALTER TABLE `subscription_plan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `therapist_pref`
--
ALTER TABLE `therapist_pref`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `service_id` (`service_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `subscription_id` (`subscription_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mobile_no` (`mobile_no`),
  ADD KEY `status_id` (`status_id`),
  ADD KEY `user_type` (`usertype_id`),
  ADD KEY `usertype_id` (`usertype_id`);

--
-- Indexes for table `usertype`
--
ALTER TABLE `usertype`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `documents`
--
ALTER TABLE `documents`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `my_subscription`
--
ALTER TABLE `my_subscription`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `professional_info`
--
ALTER TABLE `professional_info`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `specialization`
--
ALTER TABLE `specialization`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `status`
--
ALTER TABLE `status`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `subscription_plan`
--
ALTER TABLE `subscription_plan`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `therapist_pref`
--
ALTER TABLE `therapist_pref`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `usertype`
--
ALTER TABLE `usertype`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `my_subscription`
--
ALTER TABLE `my_subscription`
  ADD CONSTRAINT `my_subscription_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `my_subscription_ibfk_2` FOREIGN KEY (`subscription_id`) REFERENCES `subscription_plan` (`id`),
  ADD CONSTRAINT `my_subscription_ibfk_3` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`);

--
-- Constraints for table `professional_info`
--
ALTER TABLE `professional_info`
  ADD CONSTRAINT `professional_info_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `professional_info_ibfk_2` FOREIGN KEY (`specialization_id`) REFERENCES `specialization` (`id`);

--
-- Constraints for table `therapist_pref`
--
ALTER TABLE `therapist_pref`
  ADD CONSTRAINT `therapist_pref_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `therapist_pref_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`);

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`subscription_id`) REFERENCES `subscription_plan` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`status_id`) REFERENCES `status` (`id`),
  ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`usertype_id`) REFERENCES `usertype` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
