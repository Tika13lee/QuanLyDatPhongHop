-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               11.4.5-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for ql_datphong
CREATE DATABASE IF NOT EXISTS `ql_datphong` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `ql_datphong`;

-- Dumping structure for table ql_datphong.account
CREATE TABLE IF NOT EXISTS `account` (
  `account_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `password` varchar(255) DEFAULT NULL,
  `role` bit(1) NOT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`account_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table ql_datphong.account: ~12 rows (approximately)
INSERT INTO `account` (`account_id`, `password`, `role`, `user_name`) VALUES
	(1, '123', b'0', '0914653334'),
	(2, '1234', b'1', '0914653333'),
	(3, '1234', b'1', '0914653332'),
	(4, '123', b'0', '0914653331'),
	(5, '123', b'0', '0914653321'),
	(6, '123', b'0', '0914653221'),
	(7, '123', b'0', '0914652221'),
	(8, '123', b'0', '0912652221'),
	(9, '123', b'0', '0912672221'),
	(10, '123', b'0', '0912672921'),
	(11, '123', b'0', '0919672921'),
	(12, '123', b'0', '0919642921');

-- Dumping structure for table ql_datphong.cancel_reservation
CREATE TABLE IF NOT EXISTS `cancel_reservation` (
  `cancel_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `time` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`cancel_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table ql_datphong.cancel_reservation: ~0 rows (approximately)

-- Dumping structure for table ql_datphong.department
CREATE TABLE IF NOT EXISTS `department` (
  `department_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `dep_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`department_id`),
  UNIQUE KEY `UKe19n7n78ppli0pc6nstem49ya` (`location_id`),
  CONSTRAINT `FKrf9pmd4xvkiuh46soainevapk` FOREIGN KEY (`location_id`) REFERENCES `location` (`location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table ql_datphong.department: ~3 rows (approximately)
INSERT INTO `department` (`department_id`, `dep_name`, `location_id`) VALUES
	(1, 'IT', 1),
	(2, 'MKT', 2),
	(3, 'TE', 3);

-- Dumping structure for table ql_datphong.device
CREATE TABLE IF NOT EXISTS `device` (
  `device_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `device_name` varchar(255) DEFAULT NULL,
  `price_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`device_id`),
  KEY `FKrvclitsabx4joc0l97unv1bjc` (`price_id`),
  CONSTRAINT `FKrvclitsabx4joc0l97unv1bjc` FOREIGN KEY (`price_id`) REFERENCES `price` (`price_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ql_datphong.device: ~4 rows (approximately)
INSERT INTO `device` (`device_id`, `description`, `device_name`, `price_id`) VALUES
	(1, ' ', 'projector', 5),
	(2, ' ', 'whiteboard', 6),
	(3, ' ', 'tv', 7),
	(6, 'Lớn, 1000B', 'Công cụ loa', 16);

-- Dumping structure for table ql_datphong.employee
CREATE TABLE IF NOT EXISTS `employee` (
  `employee_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `avatar` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `employee_name` varchar(255) DEFAULT NULL,
  `is_actived` bit(1) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `account_id` bigint(20) DEFAULT NULL,
  `department_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`employee_id`),
  UNIQUE KEY `UKbuf2qp04xpwfp5qq355706h4a` (`phone`),
  UNIQUE KEY `UKlsnx7na4u8ohrhoeag7un4wh3` (`account_id`),
  KEY `FKbejtwvg9bxus2mffsm3swj3u9` (`department_id`),
  CONSTRAINT `FKbejtwvg9bxus2mffsm3swj3u9` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`),
  CONSTRAINT `FKcfg6ajo8oske94exynxpf7tf9` FOREIGN KEY (`account_id`) REFERENCES `account` (`account_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ql_datphong.employee: ~12 rows (approximately)
INSERT INTO `employee` (`employee_id`, `avatar`, `email`, `employee_name`, `is_actived`, `phone`, `account_id`, `department_id`) VALUES
	(1, NULL, '123@gmail.com', 'Dat1', b'1', '0914653334', 1, 1),
	(2, NULL, '123@gmail.com', 'Dat2', b'1', '0914653333', 2, 1),
	(3, NULL, '123@gmail.com', 'Dat3', b'1', '0914653332', 3, 1),
	(4, NULL, '123@gmail.com', 'Kieu', b'1', '0914653331', 4, 2),
	(5, NULL, '123@gmail.com', 'Hieu', b'1', '0914653321', 5, 2),
	(6, NULL, '123@gmail.com', 'Bao', b'1', '0914653221', 6, 2),
	(7, NULL, '123@gmail.com', 'Dung', b'1', '0914652221', 7, 2),
	(8, NULL, '123@gmail.com', 'Huy', b'1', '0912652221', 8, 3),
	(9, NULL, '123@gmail.com', 'Huong', b'1', '0912672221', 9, 3),
	(10, NULL, '123@gmail.com', 'Hue', b'1', '0912672921', 10, 3),
	(11, NULL, '123@gmail.com', 'Hao', b'1', '0919672921', 11, 3),
	(12, NULL, '123@gmail.com', 'Ki', b'1', '0919642921', 12, 3);

-- Dumping structure for table ql_datphong.location
CREATE TABLE IF NOT EXISTS `location` (
  `location_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `branch` varchar(255) DEFAULT NULL,
  `building` varchar(255) DEFAULT NULL,
  `floor` varchar(255) DEFAULT NULL,
  `number` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ql_datphong.location: ~9 rows (approximately)
INSERT INTO `location` (`location_id`, `branch`, `building`, `floor`, `number`) VALUES
	(1, 'HN', 'A', '1', '01'),
	(2, 'HN', 'B', '1', '01'),
	(3, 'SG', 'A', '2', '01'),
	(4, 'SG', 'B', '1', '01'),
	(5, 'SG', 'A', '1', '01'),
	(6, 'SG', 'B', '2', '01'),
	(7, 'SG', 'A', '2', '03'),
	(8, 'HN', 'A', '2', '02'),
	(9, 'SG', 'B', '1', '02');

-- Dumping structure for table ql_datphong.log
CREATE TABLE IF NOT EXISTS `log` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `action` varchar(255) DEFAULT NULL,
  `time` datetime(6) DEFAULT NULL,
  `account_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`log_id`),
  UNIQUE KEY `UK7vj7qw714561rssch090tw994` (`account_id`),
  CONSTRAINT `FK503ama154cr4d3cyc7741l4b7` FOREIGN KEY (`account_id`) REFERENCES `account` (`account_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ql_datphong.log: ~0 rows (approximately)

-- Dumping structure for table ql_datphong.price
CREATE TABLE IF NOT EXISTS `price` (
  `price_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `time_apply` datetime(6) DEFAULT NULL,
  `type` enum('DEVICE','ROOM','SERVICE') DEFAULT NULL,
  `value` int(11) NOT NULL,
  PRIMARY KEY (`price_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ql_datphong.price: ~17 rows (approximately)
INSERT INTO `price` (`price_id`, `time_apply`, `type`, `value`) VALUES
	(1, '2025-02-28 00:39:47.000000', 'ROOM', 100),
	(2, '2025-02-28 00:39:47.000000', 'ROOM', 110),
	(3, '2025-02-28 00:39:47.000000', 'ROOM', 120),
	(4, '2025-02-28 00:39:47.000000', 'ROOM', 130),
	(5, '2025-02-28 00:39:47.000000', 'DEVICE', 30),
	(6, '2025-02-28 00:39:47.000000', 'DEVICE', 40),
	(7, '2025-02-28 00:39:47.000000', 'DEVICE', 50),
	(8, '2025-02-28 00:39:47.000000', 'SERVICE', 20),
	(9, '2025-02-28 00:39:47.000000', 'SERVICE', 25),
	(10, '2025-02-28 00:39:47.000000', 'SERVICE', 28),
	(11, '2025-02-28 00:39:47.000000', 'SERVICE', 30),
	(12, '2025-02-28 04:30:17.306000', 'ROOM', 100),
	(13, '2025-02-28 04:58:29.651000', 'ROOM', 100),
	(14, '2025-02-28 05:01:32.108000', 'ROOM', 100),
	(15, '2025-03-11 00:44:20.757000', 'DEVICE', 100),
	(16, '2025-03-11 00:45:34.401000', 'DEVICE', 100),
	(17, '2025-03-11 02:24:34.428000', 'SERVICE', 100);

-- Dumping structure for table ql_datphong.reservation
CREATE TABLE IF NOT EXISTS `reservation` (
  `reservation_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `frequency` enum('DAILY','MONTHLY','ONE_TIME','WEEKLY') DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `status_reservation` enum('CANCELED','CHECKED_IN','COMPLETED','PENDING','WAITING','WAITING_PAYMENT') DEFAULT NULL,
  `time` datetime(6) DEFAULT NULL,
  `time_check_in` datetime(6) DEFAULT NULL,
  `time_check_out` datetime(6) DEFAULT NULL,
  `time_end` datetime(6) DEFAULT NULL,
  `time_start` datetime(6) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `total` int(11) NOT NULL,
  `booker_id` bigint(20) DEFAULT NULL,
  `cancle_reservation_id` bigint(20) DEFAULT NULL,
  `room_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`reservation_id`),
  UNIQUE KEY `UKj5gdk59td4xcakbprt8kt1e4m` (`cancle_reservation_id`),
  KEY `FK6p46jda7n10vl4kr1n0c6et6v` (`booker_id`),
  KEY `FKm8xumi0g23038cw32oiva2ymw` (`room_id`),
  CONSTRAINT `FK6p46jda7n10vl4kr1n0c6et6v` FOREIGN KEY (`booker_id`) REFERENCES `employee` (`employee_id`),
  CONSTRAINT `FKlqrdx9b1dwg69ldb480uok3w2` FOREIGN KEY (`cancle_reservation_id`) REFERENCES `cancel_reservation` (`cancel_id`),
  CONSTRAINT `FKm8xumi0g23038cw32oiva2ymw` FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ql_datphong.reservation: ~13 rows (approximately)
INSERT INTO `reservation` (`reservation_id`, `description`, `frequency`, `note`, `status_reservation`, `time`, `time_check_in`, `time_check_out`, `time_end`, `time_start`, `title`, `total`, `booker_id`, `cancle_reservation_id`, `room_id`) VALUES
	(1, ' ', 'ONE_TIME', ' ', 'COMPLETED', '2025-02-28 01:35:28.000000', '2025-02-28 01:35:29.000000', '2025-02-28 01:35:30.000000', '2025-02-28 01:35:31.000000', '2025-02-28 01:35:34.000000', 'Khoa hoc', 400, 1, NULL, 1),
	(2, ' ', 'ONE_TIME', ' ', 'COMPLETED', '2025-02-28 01:35:28.000000', '2025-02-28 01:35:29.000000', '2025-02-28 01:35:30.000000', '2025-02-28 01:35:31.000000', '2025-02-28 01:35:34.000000', 'Ke hoach truyen thong', 400, 2, NULL, 1),
	(3, ' ', 'ONE_TIME', ' ', 'COMPLETED', '2025-02-28 01:35:28.000000', '2025-02-28 01:35:29.000000', '2025-02-28 01:35:30.000000', '2025-02-28 01:35:31.000000', '2025-02-28 01:35:34.000000', 'suy duong', 400, 1, NULL, 1),
	(4, ' ', 'ONE_TIME', ' ', 'COMPLETED', '2025-02-28 01:35:28.000000', '2025-02-28 01:35:29.000000', '2025-02-28 01:35:30.000000', '2025-02-28 01:35:31.000000', '2025-02-28 01:35:34.000000', 'bao cao ', 400, 3, NULL, 4),
	(5, ' ', 'ONE_TIME', ' ', 'COMPLETED', '2025-02-28 01:35:28.000000', '2025-02-28 01:35:29.000000', '2025-02-28 01:35:30.000000', '2025-02-28 01:35:31.000000', '2025-02-28 01:35:34.000000', 'Tong ket quy', 400, 1, NULL, 1),
	(6, ' ', 'ONE_TIME', ' ', 'COMPLETED', '2025-02-28 01:35:28.000000', '2025-02-28 01:35:29.000000', '2025-02-28 01:35:30.000000', '2025-02-28 01:35:31.000000', '2025-02-28 01:35:34.000000', 'Thuyet trinh', 400, 1, NULL, 2),
	(7, ' ', 'ONE_TIME', ' ', 'COMPLETED', '2025-02-28 01:35:28.000000', '2025-02-28 01:35:29.000000', '2025-02-28 01:35:30.000000', '2025-02-28 01:35:31.000000', '2025-02-28 01:35:34.000000', 'tt1', 400, 4, NULL, 1),
	(8, ' ', 'ONE_TIME', ' ', 'COMPLETED', '2025-02-28 01:35:28.000000', '2025-02-28 01:35:29.000000', '2025-02-28 01:35:30.000000', '2025-02-28 01:35:31.000000', '2025-02-28 01:35:34.000000', 'tt2', 400, 1, NULL, 1),
	(9, ' ', 'ONE_TIME', ' ', 'COMPLETED', '2025-02-28 01:35:28.000000', '2025-02-28 01:35:29.000000', '2025-02-28 01:35:30.000000', '2025-02-28 01:35:31.000000', '2025-02-28 01:35:34.000000', 'tt3', 400, 1, NULL, 3),
	(10, ' ', 'ONE_TIME', ' ', 'COMPLETED', '2025-02-28 01:35:28.000000', '2025-02-28 01:35:29.000000', '2025-02-28 01:35:30.000000', '2025-02-28 01:35:31.000000', '2025-02-28 01:35:34.000000', 'tt4', 400, 1, NULL, 3),
	(11, ' ', 'ONE_TIME', ' ', 'COMPLETED', '2025-02-28 01:35:28.000000', '2025-02-28 01:35:29.000000', '2025-02-28 01:35:30.000000', '2025-02-28 01:35:31.000000', '2025-02-28 01:35:34.000000', 'tt5', 400, 5, NULL, 3),
	(12, ' ', 'ONE_TIME', ' ', 'COMPLETED', '2025-02-28 01:35:28.000000', '2025-02-28 01:35:29.000000', '2025-02-28 01:35:30.000000', '2025-02-28 01:35:31.000000', '2025-02-28 01:35:34.000000', 'tt6', 400, 1, NULL, 1),
	(13, ' ', 'ONE_TIME', ' ', 'COMPLETED', '2025-02-28 01:35:28.000000', '2025-02-28 01:35:29.000000', '2025-02-28 01:35:30.000000', '2025-02-28 01:35:31.000000', '2025-02-28 01:35:34.000000', 'tt7', 400, 1, NULL, 1);

-- Dumping structure for table ql_datphong.reservation_employee
CREATE TABLE IF NOT EXISTS `reservation_employee` (
  `reservation_id` bigint(20) NOT NULL,
  `employee_id` bigint(20) NOT NULL,
  KEY `FKmc5vf42lypo9yrgftkonn2bvh` (`employee_id`),
  KEY `FKjy9lleglu0rdpbehgboh1p3r4` (`reservation_id`),
  CONSTRAINT `FKjy9lleglu0rdpbehgboh1p3r4` FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`reservation_id`),
  CONSTRAINT `FKmc5vf42lypo9yrgftkonn2bvh` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ql_datphong.reservation_employee: ~14 rows (approximately)
INSERT INTO `reservation_employee` (`reservation_id`, `employee_id`) VALUES
	(1, 8),
	(4, 11),
	(2, 7),
	(2, 2),
	(2, 11),
	(3, 3),
	(3, 9),
	(3, 7),
	(1, 11),
	(4, 2),
	(5, 7),
	(5, 12),
	(5, 6),
	(1, 6);

-- Dumping structure for table ql_datphong.ɳdservation_file_pat  
IF NOT EXISTS ;

-- Dumping data for table ql_datphong.ɳdservation_file_pat  : ~0 rows (approximately)
-- Dumping structure for table ql_datphong.reservation_service
CREATE TABLE IF NOT EXISTS `reservation_service` (
  `reservation_id` bigint(20) NOT NULL,
  `service_id` bigint(20) NOT NULL,
  KEY `FKjpu82eqbnjxc7sp25jl349obu` (`service_id`),
  KEY `FKky2gr8jk9fw121e8rxogc8ccm` (`reservation_id`),
  CONSTRAINT `FKjpu82eqbnjxc7sp25jl349obu` FOREIGN KEY (`service_id`) REFERENCES `service` (`service_id`),
  CONSTRAINT `FKky2gr8jk9fw121e8rxogc8ccm` FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`reservation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table ql_datphong.reservation_service: ~3 rows (approximately)
INSERT INTO `reservation_service` (`reservation_id`, `service_id`) VALUES
	(1, 1),
	(2, 3),
	(2, 1);

-- Dumping structure for table ql_datphong.room
CREATE TABLE IF NOT EXISTS `room` (
  `room_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `capacity` int(11) NOT NULL,
  `room_name` varchar(255) DEFAULT NULL,
  `status_room` enum('AVAILABLE','MAINTAIN','ONGOING','REPAIR') DEFAULT NULL,
  `type_room` enum('CONFERENCEROOM','DEFAULT','VIP') DEFAULT NULL,
  `location_id` bigint(20) DEFAULT NULL,
  `price_id` bigint(20) DEFAULT NULL,
  `approver_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`room_id`),
  UNIQUE KEY `UKfjnal9itsdgfdr3ow1ul532bt` (`location_id`),
  KEY `FKeu3mfjn8pcwbb7jh9rb6tcs32` (`price_id`),
  KEY `FKj7m6our9ety1o5mxrmpgen6qp` (`approver_id`),
  CONSTRAINT `FKeu3mfjn8pcwbb7jh9rb6tcs32` FOREIGN KEY (`price_id`) REFERENCES `price` (`price_id`),
  CONSTRAINT `FKj7m6our9ety1o5mxrmpgen6qp` FOREIGN KEY (`approver_id`) REFERENCES `employee` (`employee_id`),
  CONSTRAINT `FKrqejnp96gs9ldf7o6fciylxkt` FOREIGN KEY (`location_id`) REFERENCES `location` (`location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ql_datphong.room: ~6 rows (approximately)
INSERT INTO `room` (`room_id`, `capacity`, `room_name`, `status_room`, `type_room`, `location_id`, `price_id`, `approver_id`) VALUES
	(1, 4, 'SS', 'AVAILABLE', 'DEFAULT', 4, 1, 1),
	(2, 4, 'VV', 'AVAILABLE', 'DEFAULT', 6, 3, 1),
	(3, 4, 'KK', 'AVAILABLE', 'VIP', 7, 4, 1),
	(4, 4, 'SW', 'AVAILABLE', 'DEFAULT', 5, 2, NULL),
	(7, 4, 'NS', 'AVAILABLE', 'VIP', 8, 12, NULL),
	(8, 4, 'Duy trì', 'MAINTAIN', 'VIP', 9, 14, NULL);

-- Dumping structure for table ql_datphong.room_device
CREATE TABLE IF NOT EXISTS `room_device` (
  `quantity` int(11) NOT NULL,
  `room_id` bigint(20) NOT NULL,
  `device_id` bigint(20) NOT NULL,
  PRIMARY KEY (`device_id`,`room_id`),
  KEY `FK4v7vq2wyc0gehiyeqj4bnitkt` (`room_id`),
  CONSTRAINT `FK4v7vq2wyc0gehiyeqj4bnitkt` FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`),
  CONSTRAINT `FKi0ck9pu6eoan6rntpybydtp29` FOREIGN KEY (`device_id`) REFERENCES `device` (`device_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table ql_datphong.room_device: ~10 rows (approximately)
INSERT INTO `room_device` (`quantity`, `room_id`, `device_id`) VALUES
	(1, 1, 1),
	(1, 3, 1),
	(1, 4, 1),
	(2, 7, 1),
	(2, 8, 1),
	(1, 1, 2),
	(2, 2, 2),
	(1, 8, 2),
	(2, 2, 3),
	(1, 3, 3);

-- Dumping structure for table ql_datphong.room_imgs
CREATE TABLE IF NOT EXISTS `room_imgs` (
  `room_room_id` bigint(20) NOT NULL,
  `imgs` varchar(255) DEFAULT NULL,
  KEY `FKrnck0q2se0qpxlgrq4e17b3mi` (`room_room_id`),
  CONSTRAINT `FKrnck0q2se0qpxlgrq4e17b3mi` FOREIGN KEY (`room_room_id`) REFERENCES `room` (`room_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- Dumping data for table ql_datphong.room_imgs: ~4 rows (approximately)
INSERT INTO `room_imgs` (`room_room_id`, `imgs`) VALUES
	(7, '1'),
	(7, '2'),
	(8, '1'),
	(8, '2');

-- Dumping structure for table ql_datphong.service
CREATE TABLE IF NOT EXISTS `service` (
  `service_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `service_name` varchar(255) DEFAULT NULL,
  `price_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`service_id`),
  KEY `FKlseq2n8malh1ngayy79q62kal` (`price_id`),
  CONSTRAINT `FKlseq2n8malh1ngayy79q62kal` FOREIGN KEY (`price_id`) REFERENCES `price` (`price_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ql_datphong.service: ~5 rows (approximately)
INSERT INTO `service` (`service_id`, `description`, `service_name`, `price_id`) VALUES
	(1, ' ', 'small', 8),
	(2, ' ', 'big', 9),
	(3, ' ', 'vip', 10),
	(4, ' ', 'con', 11),
	(5, 'Nhanh', 'Loai A', 17);

-- Dumping structure for table ql_datphong.token
CREATE TABLE IF NOT EXISTS `token` (
  `token_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `expired` bit(1) NOT NULL,
  `expiry_date` datetime(6) DEFAULT NULL,
  `revoked` bit(1) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `token_type` varchar(255) DEFAULT NULL,
  `account_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`token_id`),
  KEY `FKftkstvcfb74ogw02bo5261kno` (`account_id`),
  CONSTRAINT `FKftkstvcfb74ogw02bo5261kno` FOREIGN KEY (`account_id`) REFERENCES `account` (`account_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ql_datphong.token: ~0 rows (approximately)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
