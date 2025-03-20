-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.13 - MySQL Community Server - GPL
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
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=latin1;

-- Dumping data for table ql_datphong.account: ~15 rows (approximately)
INSERT INTO `account` (`account_id`, `password`, `role`, `user_name`) VALUES
	(1, '123', b'0', '0724653334'),
	(3, '1234', b'1', '0914653332'),
	(4, '123', b'0', '0914653331'),
	(6, '123', b'0', '0914653221'),
	(7, '123', b'0', '0914652221'),
	(8, '123', b'0', '0912652221'),
	(9, '123', b'0', '0912672221'),
	(10, '123', b'0', '0912672921'),
	(11, '123', b'0', '0919672921'),
	(12, '123', b'0', '0919642921'),
	(15, '1111', b'0', '0714653334'),
	(16, '1111', b'0', '0147152369'),
	(17, '1111', b'0', '0147852457'),
	(18, '1111', b'0', '0147852475'),
	(19, '1111', b'0', '0914654257'),
	(20, '1111', b'0', '0147852421'),
	(21, '1111', b'0', '0934707412'),
	(22, '1111', b'0', '0914653783'),
	(23, '1111', b'0', '0914653112'),
	(24, '1111', b'0', '0914657534'),
	(25, '1111', b'0', '0147852374'),
	(26, '1111', b'0', '0914653334'),
	(27, '1111', b'0', '0914653754'),
	(28, '1111', b'0', '0734707412'),
	(30, '1111', b'1', '0734654587'),
	(31, '1111', b'0', '0934707416'),
	(32, '1111', b'1', '0714653321'),
	(33, '1111', b'0', '0794707412');

-- Dumping structure for table ql_datphong.branch
CREATE TABLE IF NOT EXISTS `branch` (
  `branch_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `branch_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`branch_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ql_datphong.branch: ~10 rows (approximately)
INSERT INTO `branch` (`branch_id`, `branch_name`) VALUES
	(1, 'TP. Hồ Chí Minh'),
	(2, 'Hà Nội'),
	(3, 'Đà Nẵng'),
	(4, 'Hòa Bình'),
	(5, 'Cần Thơ'),
	(6, 'Tây Ninh'),
	(7, 'Vũng Tàu'),
	(8, 'Hạ Long'),
	(9, 'Nha Trang'),
	(10, 'Bạc Liêu');

-- Dumping structure for table ql_datphong.building
CREATE TABLE IF NOT EXISTS `building` (
  `building_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `building_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `branch_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`building_id`),
  KEY `FKm5b5l1b9f611y750y6uegr4kx` (`branch_id`),
  CONSTRAINT `FKm5b5l1b9f611y750y6uegr4kx` FOREIGN KEY (`branch_id`) REFERENCES `branch` (`branch_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ql_datphong.building: ~17 rows (approximately)
INSERT INTO `building` (`building_id`, `building_name`, `branch_id`) VALUES
	(1, 'A', 1),
	(2, 'B', 1),
	(3, 'C', 1),
	(4, 'D', 1),
	(5, 'E', 1),
	(6, 'B', 2),
	(7, 'A', 2),
	(8, 'C', 2),
	(9, 'D', 2),
	(10, 'E', 2),
	(11, 'A', 3),
	(12, 'B', 3),
	(13, 'C', 3),
	(14, 'D', 3),
	(15, 'F', 1),
	(16, 'A', 6),
	(17, 'B', 6);

-- Dumping structure for table ql_datphong.cancel_reservation
CREATE TABLE IF NOT EXISTS `cancel_reservation` (
  `cancel_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `time` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`cancel_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table ql_datphong.cancel_reservation: ~0 rows (approximately)

-- Dumping structure for table ql_datphong.department
CREATE TABLE IF NOT EXISTS `department` (
  `department_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `dep_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`department_id`),
  UNIQUE KEY `UKe19n7n78ppli0pc6nstem49ya` (`location_id`),
  CONSTRAINT `FKrf9pmd4xvkiuh46soainevapk` FOREIGN KEY (`location_id`) REFERENCES `location` (`location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

-- Dumping data for table ql_datphong.department: ~4 rows (approximately)
INSERT INTO `department` (`department_id`, `dep_name`, `location_id`) VALUES
	(1, 'IT', 1),
	(2, 'MKT', 2),
	(3, 'TE', 3),
	(4, 'BE', 4);

-- Dumping structure for table ql_datphong.device
CREATE TABLE IF NOT EXISTS `device` (
  `device_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `device_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`device_id`),
  KEY `FKrvclitsabx4joc0l97unv1bjc` (`price_id`),
  CONSTRAINT `FKrvclitsabx4joc0l97unv1bjc` FOREIGN KEY (`price_id`) REFERENCES `price` (`price_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ql_datphong.device: ~13 rows (approximately)
INSERT INTO `device` (`device_id`, `description`, `device_name`, `price_id`) VALUES
	(1, 'Độ phân giải từ HD đến 4K, Hỗ trợ HDMI, USB, Wi-Fi, Bluetooth', 'Máy chiếu loại 1', 10),
	(2, ' Có gắn nam châm để ghim tài liệu', 'Bảng trắng', 6),
	(3, ' Hình ảnh sắc nét, tiết kiệm điện', 'Ti vi', 7),
	(6, 'Lớn, 1000B', 'Công cụ loa', 10),
	(7, 'macbook', 'Laptop', 18),
	(8, 'tốt', 'Máy chiếu loại 2', 19),
	(9, 'Loại lớn', 'Máy chiếu loại 3', 20),
	(10, 'Lớn', 'Máy chiếu loại 4', 21),
	(11, '', 'Loại Q', 10),
	(12, ' tốt 1', 'Thiết bị 4', NULL),
	(13, 'tốt', 'Thiết bị 1', NULL),
	(14, 'Lớn, 1000B', 'Thiết bị 5', NULL),
	(15, 'tốt', 'Thiết bị 6', NULL);

-- Dumping structure for table ql_datphong.employee
CREATE TABLE IF NOT EXISTS `employee` (
  `employee_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `employee_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_actived` bit(1) NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_id` bigint(20) DEFAULT NULL,
  `department_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`employee_id`),
  UNIQUE KEY `UKbuf2qp04xpwfp5qq355706h4a` (`phone`),
  UNIQUE KEY `UKlsnx7na4u8ohrhoeag7un4wh3` (`account_id`),
  KEY `FKbejtwvg9bxus2mffsm3swj3u9` (`department_id`),
  CONSTRAINT `FKbejtwvg9bxus2mffsm3swj3u9` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`),
  CONSTRAINT `FKcfg6ajo8oske94exynxpf7tf9` FOREIGN KEY (`account_id`) REFERENCES `account` (`account_id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ql_datphong.employee: ~28 rows (approximately)
INSERT INTO `employee` (`employee_id`, `avatar`, `email`, `employee_name`, `is_actived`, `phone`, `account_id`, `department_id`) VALUES
	(1, 'https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-cute-45.jpg', '123@gmail.com', 'Nguyễn Trọng Đạt', b'1', '0914653334', 1, 1),
	(2, 'https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-cute-45.jpg', '123a@gmail.com', 'Võ Tấn Dũng', b'0', '0714653333', NULL, 1),
	(3, 'https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-cute-45.jpg', '123@gmail.com', 'Nguyễn Gia Huy', b'1', '0914653332', 3, 1),
	(4, 'https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-cute-45.jpg', '123@gmail.com', 'Lê Quang Huy', b'1', '0914653331', 4, 2),
	(5, 'https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-cute-45.jpg', '123@gmail.com', 'Võ Hiếu', b'1', '0714653321', 32, 2),
	(6, 'https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-cute-45.jpg', '123@gmail.com', 'Nguyễn Thị Dung', b'1', '0914653221', 6, 2),
	(7, 'https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-cute-45.jpg', '123@gmail.com', 'Trần Nhật Hưng', b'1', '0914652221', 7, 2),
	(8, 'https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-cute-45.jpg', '123@gmail.com', 'Nguyễn Thái Duy', b'1', '0912652221', 8, 3),
	(9, 'https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-cute-45.jpg', '123@gmail.com', 'Nguyễn Quang Đạt', b'1', '0912672221', 9, 3),
	(10, 'https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-cute-45.jpg', '123@gmail.com', 'Lê Thị Sáu', b'1', '0912672921', 10, 3),
	(11, 'https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-cute-45.jpg', '123@gmail.com', 'Nguyễn Tấn', b'1', '0919672921', 11, 3),
	(12, 'https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-cute-45.jpg', '123@gmail.com', 'Lê Bảo', b'1', '0919642921', 12, 3),
	(17, 'https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-cute-45.jpg', 'dat124@gmail.com', 'Trọng Ba7', b'1', '0934707416', 31, 1),
	(18, 'https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/avatar-cute-45.jpg', '123@gmail.com', 'Kiều', b'1', '0734654587', 30, 4),
	(19, 'https://deviet.vn/wp-content/uploads/2019/04/vuong-quoc-anh.jpg', '1234@gmail.com', 'K', b'1', '0714653334', 15, 4),
	(20, 'https://res.cloudinary.com/drfbxuss6/image/upload/v1742290383/vf1r7ym5d8aq5wfg8r8y.png', '123@gmail.com', 'a', b'1', '0147152369', 16, 3),
	(21, 'https://deviet.vn/wp-content/uploads/2019/04/vuong-quoc-anh.jpg', '1235@gmail.com', 'b', b'1', '0147852457', 17, 4),
	(22, 'https://deviet.vn/wp-content/uploads/2019/04/vuong-quoc-anh.jpg', '123@gmail.com', 'ki', b'0', '0147852475', 18, 1),
	(23, 'https://deviet.vn/wp-content/uploads/2019/04/vuong-quoc-anh.jpg', '123@gmail.com', 'th', b'1', '0914654257', 19, 2),
	(24, 'https://deviet.vn/wp-content/uploads/2019/04/vuong-quoc-anh.jpg', '123@gmail.com', 'ko', b'0', '0147852421', 20, 1),
	(25, 'https://deviet.vn/wp-content/uploads/2019/04/vuong-quoc-anh.jpg', 'dat123@gmail.com', 'Trọng Đạt', b'1', '0934707412', 21, 3),
	(26, 'https://deviet.vn/wp-content/uploads/2019/04/vuong-quoc-anh.jpg', '123@gmail.com', 'Khôi Nguyên', b'1', '0914653783', 22, 4),
	(27, 'https://deviet.vn/wp-content/uploads/2019/04/vuong-quoc-anh.jpg', '123@gmail.com', 'Nguyễn Trọng Đạt', b'1', '0914653112', 23, 4),
	(28, 'https://deviet.vn/wp-content/uploads/2019/04/vuong-quoc-anh.jpg', '123@gmail.com', 'Văn Minh', b'1', '0914657534', 24, 4),
	(29, 'https://res.cloudinary.com/drfbxuss6/image/upload/v1742269586/dplh712llaupvzc8xp66.png', '123@gmail.com', 'Võ Tấn Dương', b'1', '0147852374', 25, 3),
	(30, 'https://res.cloudinary.com/drfbxuss6/image/upload/v1742292982/bteom8rdwnxnxq2hfout.png', 'dung123@gmail.com', 'Võ Dũng', b'1', '0914653754', 27, 3),
	(31, 'https://deviet.vn/wp-content/uploads/2019/04/vuong-quoc-anh.jpg', 'dat123@gmail.com', 'Trọng Đạt', b'1', '0734707412', 28, 1),
	(32, 'https://deviet.vn/wp-content/uploads/2019/04/vuong-quoc-anh.jpg', 'dat123@gmail.com', 'Trọng Đình', b'1', '0794707412', 33, 1);

-- Dumping structure for table ql_datphong.location
CREATE TABLE IF NOT EXISTS `location` (
  `location_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `floor` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `building_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`location_id`),
  KEY `FKc5g968pkh4pjgf69m88cwyx3q` (`building_id`),
  CONSTRAINT `FKc5g968pkh4pjgf69m88cwyx3q` FOREIGN KEY (`building_id`) REFERENCES `building` (`building_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ql_datphong.location: ~24 rows (approximately)
INSERT INTO `location` (`location_id`, `floor`, `building_id`) VALUES
	(1, '1', 1),
	(2, '1', 2),
	(3, '2', 1),
	(4, '1', 7),
	(5, '1', 11),
	(6, '2', 2),
	(7, '2', 3),
	(8, '2', 4),
	(9, '1', 4),
	(11, '3', 1),
	(12, '3', 7),
	(13, '3', 2),
	(14, '3', 3),
	(15, '3', 4),
	(16, '3', 6),
	(17, '3', 12),
	(18, '3', 5),
	(19, '3', 9),
	(20, '3', 14),
	(22, '4', 1),
	(23, '1', 2),
	(24, '1', 16),
	(25, '2', 16),
	(26, '3', 16);

-- Dumping structure for table ql_datphong.log
CREATE TABLE IF NOT EXISTS `log` (
  `log_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `action` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
  `type` enum('DEVICE','ROOM','SERVICE') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `value` int(11) NOT NULL,
  PRIMARY KEY (`price_id`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ql_datphong.price: ~57 rows (approximately)
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
	(17, '2025-03-11 02:24:34.428000', 'SERVICE', 100),
	(18, '2025-03-11 23:20:02.175000', 'DEVICE', 30),
	(19, '2025-03-11 23:26:22.527000', 'DEVICE', 10),
	(20, '2025-03-11 23:27:59.331000', 'DEVICE', 30),
	(21, '2025-03-11 23:29:37.996000', 'DEVICE', 50),
	(22, '2025-03-12 00:00:46.587000', 'SERVICE', 2000),
	(23, '2025-03-12 00:02:34.191000', 'SERVICE', 2010),
	(24, '2025-03-12 00:02:59.238000', 'SERVICE', 2000),
	(25, '2025-03-12 00:03:59.731000', 'SERVICE', 2000),
	(26, '2025-03-12 00:06:10.515000', 'SERVICE', 2000),
	(27, '2025-03-12 00:07:21.110000', 'SERVICE', 2000),
	(28, '2025-03-12 00:08:41.990000', 'SERVICE', 2000),
	(29, '2025-03-12 00:14:56.789000', 'DEVICE', 0),
	(32, '2025-03-13 04:53:57.490000', 'ROOM', 1000),
	(33, '2025-03-13 04:56:01.784000', 'ROOM', 1000),
	(34, '2025-03-13 04:59:21.717000', 'ROOM', 1000),
	(35, '2025-03-13 04:59:40.153000', 'ROOM', 1000),
	(36, '2025-03-13 05:02:08.056000', 'ROOM', 1000),
	(37, '2025-03-13 05:03:52.899000', 'ROOM', 1000),
	(38, '2025-03-13 05:04:53.258000', 'ROOM', 1000),
	(39, '2025-03-13 05:05:16.770000', 'ROOM', 1000),
	(40, '2025-03-13 05:05:34.797000', 'ROOM', 1000),
	(41, '2025-03-13 05:06:03.696000', 'ROOM', 1000),
	(42, '2025-03-13 05:06:20.721000', 'ROOM', 1000),
	(43, '2025-03-13 05:06:37.372000', 'ROOM', 1000),
	(44, '2025-03-13 05:06:50.023000', 'ROOM', 1000),
	(45, '2025-03-13 05:07:04.977000', 'ROOM', 1000),
	(46, '2025-03-15 23:11:58.559000', 'DEVICE', 20),
	(47, '2025-03-18 16:00:02.247000', 'SERVICE', 100000),
	(48, '2025-03-18 19:24:40.927000', 'DEVICE', 0),
	(49, '2025-03-18 20:04:22.792000', 'DEVICE', 0),
	(50, '2025-03-18 20:04:31.140000', 'DEVICE', 0),
	(51, '2025-03-18 20:39:14.919000', 'ROOM', 100),
	(52, '2025-03-19 11:02:58.951000', 'ROOM', 100),
	(53, '2025-03-19 21:43:23.523000', 'ROOM', 1000),
	(54, '2025-03-19 21:43:36.217000', 'ROOM', 1000),
	(55, '2025-03-19 21:44:20.196000', 'ROOM', 1000),
	(56, '2025-03-19 21:44:47.868000', 'ROOM', 1000),
	(57, '2025-03-19 21:48:17.120000', 'ROOM', 1000),
	(58, '2025-03-19 23:33:21.980000', 'ROOM', 130000),
	(59, '2025-03-19 23:43:07.845000', 'ROOM', 300000);

-- Dumping structure for table ql_datphong.request_form
CREATE TABLE IF NOT EXISTS `request_form` (
  `request_form_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `reason_reject` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status_request_form` enum('APPROVED','PENDING','REJECTED') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `time_request` datetime(6) DEFAULT NULL,
  `time_response` datetime(6) DEFAULT NULL,
  `type_request_form` enum('RESERVATION_ONETIME','RESERVATION_RECURRING','UPDATE_RESERVATION') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `request_reservation_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`request_form_id`),
  UNIQUE KEY `UK4wvvelb7ftp0dinjvshie3bqh` (`request_reservation_id`),
  CONSTRAINT `FKgmwfeoqaw7utlpwec164wlu52` FOREIGN KEY (`request_reservation_id`) REFERENCES `request_reservation` (`request_reservation_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ql_datphong.request_form: ~5 rows (approximately)
INSERT INTO `request_form` (`request_form_id`, `reason_reject`, `status_request_form`, `time_request`, `time_response`, `type_request_form`, `request_reservation_id`) VALUES
	(1, NULL, 'APPROVED', '2025-03-20 15:00:00.000000', NULL, 'RESERVATION_ONETIME', 1),
	(2, NULL, 'APPROVED', '2025-03-20 15:00:00.000000', NULL, NULL, 2),
	(3, NULL, 'APPROVED', '2025-03-20 15:00:00.000000', NULL, NULL, 3),
	(4, NULL, 'APPROVED', '2025-03-20 15:00:00.000000', NULL, NULL, 4),
	(5, NULL, 'APPROVED', '2025-03-20 15:00:00.000000', NULL, NULL, 5);

-- Dumping structure for table ql_datphong.request_form_reservations
CREATE TABLE IF NOT EXISTS `request_form_reservations` (
  `request_form_id` bigint(20) NOT NULL,
  `reservation_id` bigint(20) NOT NULL,
  KEY `FKgn43md1jy3c94uyamonvwebcx` (`reservation_id`),
  KEY `FKgqum23i5l7ebxfmd03ox86knc` (`request_form_id`),
  CONSTRAINT `FKgn43md1jy3c94uyamonvwebcx` FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`reservation_id`),
  CONSTRAINT `FKgqum23i5l7ebxfmd03ox86knc` FOREIGN KEY (`request_form_id`) REFERENCES `request_form` (`request_form_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ql_datphong.request_form_reservations: ~6 rows (approximately)
INSERT INTO `request_form_reservations` (`request_form_id`, `reservation_id`) VALUES
	(4, 39),
	(5, 40),
	(5, 41),
	(1, 36),
	(2, 37),
	(3, 38);

-- Dumping structure for table ql_datphong.request_reservation
CREATE TABLE IF NOT EXISTS `request_reservation` (
  `request_reservation_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `booker_id` bigint(20) NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `frequency` tinyint(4) DEFAULT NULL,
  `note` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `room_id` bigint(20) NOT NULL,
  `time` datetime(6) DEFAULT NULL,
  `time_end` datetime(6) DEFAULT NULL,
  `time_start` datetime(6) DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`request_reservation_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ql_datphong.request_reservation: ~5 rows (approximately)
INSERT INTO `request_reservation` (`request_reservation_id`, `booker_id`, `description`, `frequency`, `note`, `room_id`, `time`, `time_end`, `time_start`, `title`) VALUES
	(1, 1, 'kho khan cua hoc', 0, 'mang theo tai lieu tuan truoc', 1, '2025-03-20 15:00:00.000000', '2025-03-22 21:00:00.000000', '2025-03-21 20:00:00.000000', 'gioi thieu ve AI'),
	(2, 1, 'kho khan cua hoc', 0, 'mang theo tai lieu tuan truoc', 1, '2025-03-22 15:00:00.000000', '2025-03-22 21:00:00.000000', '2025-03-23 20:00:00.000000', 'gioi thieu ve AI'),
	(3, 1, 'kho khan cua hoc', 0, 'mang theo tai lieu tuan truoc', 1, '2025-03-22 15:00:00.000000', '2025-03-24 21:00:00.000000', '2025-03-24 20:00:00.000000', 'gioi thieu ve AI'),
	(4, 1, 'kho khan cua hoc', 0, 'mang theo tai lieu tuan truoc', 1, '2025-03-22 15:00:00.000000', '2025-03-24 21:00:00.000000', '2025-03-24 20:00:00.000000', 'gioi thieu ve AI'),
	(5, 1, 'kho khan cua hoc', 2, 'mang theo tai lieu tuan truoc', 1, '2025-03-22 15:00:00.000000', '2025-03-25 21:00:00.000000', '2025-03-25 20:00:00.000000', 'gioi thieu ve AI');

-- Dumping structure for table ql_datphong.request_reservation_employee_ids
CREATE TABLE IF NOT EXISTS `request_reservation_employee_ids` (
  `request_reservation_request_reservation_id` bigint(20) NOT NULL,
  `employee_ids` bigint(20) DEFAULT NULL,
  KEY `FK6mg0270i3c0kisbagweokgy2w` (`request_reservation_request_reservation_id`),
  CONSTRAINT `FK6mg0270i3c0kisbagweokgy2w` FOREIGN KEY (`request_reservation_request_reservation_id`) REFERENCES `request_reservation` (`request_reservation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ql_datphong.request_reservation_employee_ids: ~0 rows (approximately)
INSERT INTO `request_reservation_employee_ids` (`request_reservation_request_reservation_id`, `employee_ids`) VALUES
	(1, 4),
	(1, 2),
	(1, 3),
	(2, 4),
	(2, 2),
	(2, 3),
	(3, 4),
	(3, 2),
	(3, 3),
	(4, 4),
	(4, 2),
	(4, 3),
	(5, 4),
	(5, 2),
	(5, 3);

-- Dumping structure for table ql_datphong.request_reservation_file_paths
CREATE TABLE IF NOT EXISTS `request_reservation_file_paths` (
  `request_reservation_request_reservation_id` bigint(20) NOT NULL,
  `file_paths` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  KEY `FK24et6fkmono2ad04j18nv1o75` (`request_reservation_request_reservation_id`),
  CONSTRAINT `FK24et6fkmono2ad04j18nv1o75` FOREIGN KEY (`request_reservation_request_reservation_id`) REFERENCES `request_reservation` (`request_reservation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ql_datphong.request_reservation_file_paths: ~0 rows (approximately)
INSERT INTO `request_reservation_file_paths` (`request_reservation_request_reservation_id`, `file_paths`) VALUES
	(1, 'file1'),
	(1, 'file2'),
	(2, 'file1'),
	(2, 'file2'),
	(3, 'file1'),
	(3, 'file2'),
	(4, 'file1'),
	(4, 'file2'),
	(5, 'file1'),
	(5, 'file2');

-- Dumping structure for table ql_datphong.request_reservation_service_ids
CREATE TABLE IF NOT EXISTS `request_reservation_service_ids` (
  `request_reservation_request_reservation_id` bigint(20) NOT NULL,
  `service_ids` bigint(20) DEFAULT NULL,
  KEY `FKh8f65v65tge9ikupt91pa2hy8` (`request_reservation_request_reservation_id`),
  CONSTRAINT `FKh8f65v65tge9ikupt91pa2hy8` FOREIGN KEY (`request_reservation_request_reservation_id`) REFERENCES `request_reservation` (`request_reservation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ql_datphong.request_reservation_service_ids: ~0 rows (approximately)
INSERT INTO `request_reservation_service_ids` (`request_reservation_request_reservation_id`, `service_ids`) VALUES
	(1, 1),
	(1, 2),
	(2, 1),
	(2, 2),
	(3, 1),
	(3, 2),
	(4, 1),
	(4, 2),
	(5, 1),
	(5, 2);

-- Dumping structure for table ql_datphong.request_reservation_time_finish_frequency
CREATE TABLE IF NOT EXISTS `request_reservation_time_finish_frequency` (
  `request_reservation_request_reservation_id` bigint(20) NOT NULL,
  `time_finish_frequency` datetime(6) DEFAULT NULL,
  KEY `FKa0p9flnsdheg6oxuu4c7njldx` (`request_reservation_request_reservation_id`),
  CONSTRAINT `FKa0p9flnsdheg6oxuu4c7njldx` FOREIGN KEY (`request_reservation_request_reservation_id`) REFERENCES `request_reservation` (`request_reservation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ql_datphong.request_reservation_time_finish_frequency: ~0 rows (approximately)
INSERT INTO `request_reservation_time_finish_frequency` (`request_reservation_request_reservation_id`, `time_finish_frequency`) VALUES
	(1, '2025-03-22 21:00:00.000000'),
	(2, '2025-03-22 21:00:00.000000'),
	(3, '2025-03-22 21:00:00.000000'),
	(4, '2025-03-22 21:00:00.000000'),
	(5, '2025-03-25 21:00:00.000000'),
	(5, '2025-03-26 21:00:00.000000');

-- Dumping structure for table ql_datphong.reservation
CREATE TABLE IF NOT EXISTS `reservation` (
  `reservation_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `frequency` enum('DAILY','MONTHLY','ONE_TIME','WEEKLY') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status_reservation` enum('CANCELED','CHECKED_IN','COMPLETED','WAITING') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `time` datetime(6) DEFAULT NULL,
  `time_check_in` datetime(6) DEFAULT NULL,
  `time_check_out` datetime(6) DEFAULT NULL,
  `time_end` datetime(6) DEFAULT NULL,
  `time_start` datetime(6) DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total` int(11) NOT NULL,
  `booker_id` bigint(20) DEFAULT NULL,
  `cancle_reservation_id` bigint(20) DEFAULT NULL,
  `room_id` bigint(20) DEFAULT NULL,
  `time_approve` datetime(6) DEFAULT NULL,
  `time_cancel` datetime(6) DEFAULT NULL,
  `time_payment` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`reservation_id`),
  UNIQUE KEY `UKj5gdk59td4xcakbprt8kt1e4m` (`cancle_reservation_id`),
  KEY `FK6p46jda7n10vl4kr1n0c6et6v` (`booker_id`),
  KEY `FKm8xumi0g23038cw32oiva2ymw` (`room_id`),
  CONSTRAINT `FK6p46jda7n10vl4kr1n0c6et6v` FOREIGN KEY (`booker_id`) REFERENCES `employee` (`employee_id`),
  CONSTRAINT `FKlqrdx9b1dwg69ldb480uok3w2` FOREIGN KEY (`cancle_reservation_id`) REFERENCES `cancel_reservation` (`cancel_id`),
  CONSTRAINT `FKm8xumi0g23038cw32oiva2ymw` FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ql_datphong.reservation: ~35 rows (approximately)
INSERT INTO `reservation` (`reservation_id`, `description`, `frequency`, `note`, `status_reservation`, `time`, `time_check_in`, `time_check_out`, `time_end`, `time_start`, `title`, `total`, `booker_id`, `cancle_reservation_id`, `room_id`, `time_approve`, `time_cancel`, `time_payment`) VALUES
	(1, ' ', 'ONE_TIME', '1', 'WAITING', '2025-02-28 01:35:28.000000', '2025-02-28 08:30:00.000000', '2025-02-28 10:00:00.000000', '2025-02-28 10:00:00.000000', '2025-02-28 08:30:00.000000', 'Nghiên cứu khoa học', 400, 1, NULL, 1, '2025-03-17 10:06:10.456000', NULL, NULL),
	(2, ' ', 'ONE_TIME', 'a', 'WAITING', '2025-02-28 01:35:28.000000', '2025-03-01 08:30:00.000000', '2025-03-01 10:00:00.000000', '2025-03-01 10:00:00.000000', '2025-03-01 08:30:00.000000', 'Kế hoạch truyền thông', 300, 2, NULL, 1, '2025-03-17 10:06:10.548000', NULL, NULL),
	(3, ' ', 'ONE_TIME', 'a', 'WAITING', '2025-02-28 01:35:28.000000', '2025-03-02 08:30:00.000000', '2025-03-02 10:00:00.000000', '2025-03-02 10:00:00.000000', '2025-03-02 08:30:00.000000', 'Báo cáo hệ thống', 400, 1, NULL, 1, '2025-02-28 01:39:28.000000', NULL, NULL),
	(4, ' ', 'ONE_TIME', 'a', 'COMPLETED', '2025-02-28 01:35:28.000000', '2025-03-03 08:30:00.000000', '2025-03-03 10:00:00.000000', '2025-03-03 10:00:00.000000', '2025-03-03 08:30:00.000000', 'Báo cáo tuần ', 400, 3, NULL, 4, '2025-02-28 01:39:28.000000', NULL, NULL),
	(5, ' ', 'ONE_TIME', 'a', 'CANCELED', '2025-02-28 01:35:28.000000', '2025-03-04 08:30:00.000000', '2025-03-04 10:00:00.000000', '2025-03-04 10:00:00.000000', '2025-03-04 08:30:00.000000', 'Báo cáo quý', 400, 1, NULL, 1, '2025-02-28 01:39:28.000000', NULL, NULL),
	(6, ' ', 'ONE_TIME', 'a', 'CANCELED', '2025-02-28 01:35:28.000000', '2025-03-05 08:30:00.000000', '2025-03-05 10:00:00.000000', '2025-03-05 10:00:00.000000', '2025-03-05 08:30:00.000000', 'Tổng kết quý', 400, 1, NULL, 2, '2025-02-28 01:39:28.000000', NULL, NULL),
	(7, ' ', 'ONE_TIME', '1', 'WAITING', '2025-02-28 01:35:28.000000', '2025-03-06 08:30:00.000000', '2025-03-06 10:00:00.000000', '2025-03-06 10:00:00.000000', '2025-03-06 08:30:00.000000', 'Lên kế hoạch tổng thu', 400, 4, NULL, 1, '2025-02-28 01:39:28.000000', NULL, NULL),
	(8, ' ', 'ONE_TIME', '1', 'COMPLETED', '2025-02-28 01:35:28.000000', '2025-03-07 08:30:00.000000', '2025-03-07 10:00:00.000000', '2025-03-07 10:00:00.000000', '2025-03-07 08:30:00.000000', 'Chốt vấn đề cần thiết', 400, 1, NULL, 1, '2025-02-28 01:39:28.000000', NULL, NULL),
	(9, ' ', 'ONE_TIME', '11', 'CHECKED_IN', '2025-02-28 01:35:28.000000', '2025-03-08 08:30:00.000000', '2025-03-08 10:00:00.000000', '2025-03-08 10:00:00.000000', '2025-03-08 08:30:00.000000', 'Khó khăn về việc học', 400, 1, NULL, 3, '2025-02-28 01:39:28.000000', NULL, NULL),
	(10, ' ', 'ONE_TIME', '1', 'COMPLETED', '2025-02-28 01:35:28.000000', '2025-03-09 08:30:00.000000', '2025-03-09 10:00:00.000000', '2025-03-09 10:00:00.000000', '2025-03-09 08:30:00.000000', 'Cách tận dụng AI', 400, 1, NULL, 3, '2025-02-28 01:39:28.000000', NULL, NULL),
	(11, ' ', 'ONE_TIME', '1', 'WAITING', '2025-02-28 01:35:28.000000', '2025-03-10 08:30:00.000000', '2025-03-10 10:00:00.000000', '2025-03-10 10:00:00.000000', '2025-03-10 08:30:00.000000', 'Sự mơ hồ trong công việc', 400, 5, NULL, 3, '2025-02-28 01:39:28.000000', NULL, NULL),
	(12, ' ', 'ONE_TIME', '1', 'WAITING', '2025-02-28 01:35:28.000000', '2025-03-11 08:30:00.000000', '2025-03-11 10:00:00.000000', '2025-03-11 10:00:00.000000', '2025-03-11 08:30:00.000000', 'Cách khai thác IDE', 400, 1, NULL, 1, '2025-02-28 01:39:28.000000', NULL, NULL),
	(13, ' ', 'ONE_TIME', '1', 'WAITING', '2025-02-28 01:35:28.000000', '2025-03-12 08:30:00.000000', '2025-03-12 10:00:00.000000', '2025-03-12 10:00:00.000000', '2025-03-12 08:30:00.000000', 'Tổng kết cả năm', 400, 1, NULL, 1, '2025-02-28 01:39:28.000000', NULL, NULL),
	(14, ' ', 'ONE_TIME', '1', 'WAITING', '2025-02-28 01:35:28.000000', '2025-03-12 10:30:00.000000', '2025-03-12 11:00:00.000000', '2025-03-12 11:00:00.000000', '2025-03-12 10:30:00.000000', 'Thường tuần', 400, 1, NULL, 1, '2025-02-28 01:39:28.000000', NULL, NULL),
	(15, ' ', 'ONE_TIME', '1', 'COMPLETED', '2025-02-28 01:35:28.000000', '2025-03-12 14:30:00.000000', '2025-03-12 16:00:00.000000', '2025-03-12 16:00:00.000000', '2025-03-12 14:30:00.000000', 'Lên kế hoạch thu chi', 400, 2, NULL, 1, '2025-02-28 01:39:28.000000', NULL, NULL),
	(16, 'phan bo tai chinh', 'DAILY', NULL, 'WAITING', '2025-03-16 15:00:00.000000', NULL, NULL, '2025-03-16 17:00:00.000000', '2025-03-16 16:00:00.000000', 'Kế hoạch triển khai', 6125, 1, NULL, 1, '2025-03-16 15:06:00.000000', NULL, NULL),
	(17, 'phan bo tai chinh', 'DAILY', NULL, 'WAITING', '2025-03-16 15:00:00.000000', NULL, NULL, '2025-03-17 17:00:00.000000', '2025-03-17 16:00:00.000000', 'Kế hoạch kinh doanh', 6125, 1, NULL, 1, '2025-03-16 15:06:00.000000', NULL, NULL),
	(18, 'phan bo tai chinh', 'DAILY', NULL, 'WAITING', '2025-03-16 15:00:00.000000', NULL, NULL, '2025-03-18 17:00:00.000000', '2025-03-18 16:00:00.000000', 'Tổng kết cả năm', 6125, 1, NULL, 1, '2025-03-16 15:06:00.000000', NULL, NULL),
	(19, 'phan bo tai chinh', 'DAILY', NULL, 'WAITING', '2025-03-16 15:00:00.000000', NULL, NULL, '2025-03-19 17:00:00.000000', '2025-03-19 16:00:00.000000', 'Kế hoạch kinh doanh', 6125, 1, NULL, 1, '2025-03-17 06:10:26.145000', NULL, NULL),
	(20, 'tốt', 'ONE_TIME', NULL, 'WAITING', '2025-03-16 16:52:12.395000', NULL, NULL, '2025-03-19 09:00:00.000000', '2025-03-19 07:30:00.000000', 'Tính chi thu', 92025, 1, NULL, 12, '2025-03-16 16:53:12.395000', NULL, NULL),
	(21, 'tốt', 'ONE_TIME', NULL, 'WAITING', '2025-03-16 16:55:39.204000', NULL, NULL, '2025-03-16 14:00:00.000000', '2025-03-16 07:00:00.000000', 'Họp hội đồng', 420100, 1, NULL, 12, '2025-03-16 16:56:12.395000', NULL, NULL),
	(22, '', 'DAILY', NULL, 'WAITING', '2025-03-17 01:35:44.442000', NULL, NULL, '2025-03-18 17:30:00.000000', '2025-03-18 14:30:00.000000', 'Khảo sát', 182000, 1, NULL, 12, NULL, NULL, NULL),
	(23, '', 'DAILY', NULL, 'WAITING', '2025-03-17 01:35:44.442000', NULL, NULL, '2025-03-19 17:30:00.000000', '2025-03-19 14:30:00.000000', 'Môi trường', 182000, 1, NULL, 12, NULL, NULL, NULL),
	(24, 'kế hoạch cuối kỳ', 'WEEKLY', NULL, 'WAITING', '2025-03-17 08:33:47.664000', NULL, NULL, '2025-03-18 09:00:00.000000', '2025-03-18 07:30:00.000000', 'Thống nhất kế hoạch', 12800, 1, NULL, 2, NULL, NULL, NULL),
	(25, 'kế hoạch cuối kỳ', 'WEEKLY', NULL, 'WAITING', '2025-03-17 08:33:47.664000', NULL, NULL, '2025-03-25 09:00:00.000000', '2025-03-25 07:30:00.000000', 'Thống nhất kế hoạch', 12800, 1, NULL, 2, NULL, NULL, NULL),
	(26, 'tốt', 'DAILY', NULL, 'WAITING', '2025-03-17 10:15:34.872000', NULL, NULL, '2025-03-21 09:00:00.000000', '2025-03-21 08:00:00.000000', 'bao cao', 64000, 1, NULL, 12, NULL, NULL, NULL),
	(27, 'tốt', 'DAILY', NULL, 'WAITING', '2025-03-17 10:15:34.872000', NULL, NULL, '2025-03-22 09:00:00.000000', '2025-03-22 08:00:00.000000', 'bao cao', 64000, 1, NULL, 12, NULL, NULL, NULL),
	(28, 'tốt', 'DAILY', NULL, 'WAITING', '2025-03-17 10:15:34.872000', NULL, NULL, '2025-03-23 09:00:00.000000', '2025-03-23 08:00:00.000000', 'bao cao', 64000, 1, NULL, 12, NULL, NULL, NULL),
	(29, 'tốt', 'ONE_TIME', NULL, 'WAITING', '2025-03-20 09:09:10.946000', NULL, NULL, '2025-03-21 09:00:00.000000', '2025-03-21 07:30:00.000000', 'Họp nhóm', 11700100, 1, NULL, 22, NULL, NULL, NULL),
	(30, 'tốt', 'ONE_TIME', 'đi', 'WAITING', '2025-03-20 12:21:36.674000', NULL, NULL, '2025-03-20 12:30:00.000000', '2025-03-20 08:30:00.000000', 'Họp nhóm', 31202100, 1, NULL, 22, NULL, NULL, NULL),
	(31, 'sa', 'ONE_TIME', NULL, 'WAITING', '2025-03-20 12:25:50.841000', NULL, NULL, '2025-03-20 08:30:00.000000', '2025-03-20 08:00:00.000000', 'học', 32000, 1, NULL, 12, NULL, NULL, NULL),
	(32, ' tốt', 'ONE_TIME', NULL, 'WAITING', '2025-03-20 12:29:03.415000', NULL, NULL, '2025-03-20 09:00:00.000000', '2025-03-20 08:30:00.000000', 'test', 32000, 1, NULL, 21, NULL, NULL, NULL),
	(33, 'ta', 'ONE_TIME', NULL, 'WAITING', '2025-03-20 13:04:27.159000', NULL, NULL, '2025-03-20 09:00:00.000000', '2025-03-20 08:30:00.000000', 'abc', 30025, 1, NULL, 19, NULL, NULL, NULL),
	(34, 'tt', 'ONE_TIME', NULL, 'WAITING', '2025-03-20 13:16:10.429000', NULL, NULL, '2025-03-20 09:30:00.000000', '2025-03-20 09:00:00.000000', 'bcd', 30025, 1, NULL, 19, NULL, NULL, NULL),
	(35, 'iiii', 'ONE_TIME', NULL, 'WAITING', '2025-03-20 14:21:26.400000', NULL, NULL, '2025-03-20 10:00:00.000000', '2025-03-20 09:30:00.000000', 'vui', 3630, 1, NULL, 2, NULL, NULL, NULL),
	(36, 'kho khan cua hoc', 'ONE_TIME', NULL, 'WAITING', '2025-03-20 15:00:00.000000', NULL, NULL, '2025-03-22 21:00:00.000000', '2025-03-21 20:00:00.000000', 'gioi thieu ve AI', 150125, 1, NULL, 1, NULL, NULL, NULL),
	(37, 'kho khan cua hoc', 'ONE_TIME', NULL, 'WAITING', '2025-03-22 15:00:00.000000', NULL, NULL, '2025-03-22 21:00:00.000000', '2025-03-23 20:00:00.000000', 'gioi thieu ve AI', -137875, 1, NULL, 1, NULL, NULL, NULL),
	(38, 'kho khan cua hoc', 'ONE_TIME', NULL, 'WAITING', '2025-03-22 15:00:00.000000', NULL, NULL, '2025-03-24 21:00:00.000000', '2025-03-24 20:00:00.000000', 'gioi thieu ve AI', 6125, 1, NULL, 1, NULL, NULL, NULL),
	(39, 'kho khan cua hoc', 'ONE_TIME', NULL, 'WAITING', '2025-03-22 15:00:00.000000', NULL, NULL, '2025-03-24 21:00:00.000000', '2025-03-24 20:00:00.000000', 'gioi thieu ve AI', 6125, 1, NULL, 1, NULL, NULL, NULL),
	(40, 'kho khan cua hoc', 'WEEKLY', NULL, 'WAITING', '2025-03-22 15:00:00.000000', NULL, NULL, '2025-03-25 21:00:00.000000', '2025-03-25 20:00:00.000000', 'gioi thieu ve AI', 6125, 1, NULL, 1, NULL, NULL, NULL),
	(41, 'kho khan cua hoc', 'WEEKLY', NULL, 'WAITING', '2025-03-22 15:00:00.000000', NULL, NULL, '2025-03-26 21:00:00.000000', '2025-03-26 20:00:00.000000', 'gioi thieu ve AI', 6125, 1, NULL, 1, NULL, NULL, NULL);

-- Dumping structure for table ql_datphong.reservation_employee
CREATE TABLE IF NOT EXISTS `reservation_employee` (
  `reservation_id` bigint(20) NOT NULL,
  `employee_id` bigint(20) NOT NULL,
  KEY `FKmc5vf42lypo9yrgftkonn2bvh` (`employee_id`),
  KEY `FKjy9lleglu0rdpbehgboh1p3r4` (`reservation_id`),
  CONSTRAINT `FKjy9lleglu0rdpbehgboh1p3r4` FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`reservation_id`),
  CONSTRAINT `FKmc5vf42lypo9yrgftkonn2bvh` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ql_datphong.reservation_employee: ~48 rows (approximately)
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
	(1, 6),
	(16, 4),
	(16, 2),
	(16, 3),
	(17, 4),
	(17, 2),
	(17, 3),
	(18, 4),
	(18, 2),
	(18, 3),
	(19, 4),
	(19, 2),
	(19, 3),
	(20, 2),
	(20, 19),
	(21, 4),
	(21, 6),
	(22, 4),
	(23, 4),
	(24, 2),
	(25, 2),
	(26, 2),
	(26, 4),
	(27, 2),
	(27, 4),
	(28, 2),
	(28, 4),
	(29, 3),
	(30, 3),
	(30, 5),
	(31, 4),
	(32, 3),
	(33, 3),
	(34, 5),
	(35, 6),
	(36, 4),
	(36, 2),
	(36, 3),
	(37, 4),
	(37, 2),
	(37, 3),
	(38, 4),
	(38, 2),
	(38, 3),
	(39, 4),
	(39, 2),
	(39, 3),
	(40, 4),
	(40, 2),
	(40, 3),
	(41, 4),
	(41, 2),
	(41, 3);

-- Dumping structure for table ql_datphong.reservation_file_paths
CREATE TABLE IF NOT EXISTS `reservation_file_paths` (
  `reservation_reservation_id` bigint(20) NOT NULL,
  `file_paths` varchar(255) DEFAULT NULL,
  KEY `FKchwrit7lhcf142bui6a74ypv2` (`reservation_reservation_id`),
  CONSTRAINT `FKchwrit7lhcf142bui6a74ypv2` FOREIGN KEY (`reservation_reservation_id`) REFERENCES `reservation` (`reservation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table ql_datphong.reservation_file_paths: ~24 rows (approximately)
INSERT INTO `reservation_file_paths` (`reservation_reservation_id`, `file_paths`) VALUES
	(16, 'file1'),
	(16, 'file2'),
	(17, 'file1'),
	(17, 'file2'),
	(18, 'file1'),
	(18, 'file2'),
	(19, 'file1'),
	(19, 'file2'),
	(20, 'C:\\fakepath\\Screenshot 2025-02-10 195409.png'),
	(21, 'C:\\fakepath\\Screenshot 2025-02-09 105805.png'),
	(22, 'C:\\fakepath\\Screenshot 2025-02-10 195409.png'),
	(23, 'C:\\fakepath\\Screenshot 2025-02-10 195409.png'),
	(24, 'C:\\fakepath\\Screenshot 2025-02-09 090926.png'),
	(25, 'C:\\fakepath\\Screenshot 2025-02-09 090926.png'),
	(26, 'C:\\fakepath\\Screenshot 2025-01-23 203418.png'),
	(27, 'C:\\fakepath\\Screenshot 2025-01-23 203418.png'),
	(28, 'C:\\fakepath\\Screenshot 2025-01-23 203418.png'),
	(29, 'C:\\fakepath\\Screenshot 2025-02-23 222946.png'),
	(30, 'C:\\fakepath\\Screenshot 2025-02-09 091803.png'),
	(31, 'C:\\fakepath\\Screenshot 2025-02-09 091803.png'),
	(32, 'C:\\fakepath\\Screenshot 2025-02-09 105805.png'),
	(33, 'C:\\fakepath\\Screenshot 2025-02-09 090926.png'),
	(34, 'C:\\fakepath\\Screenshot 2025-02-09 091803.png'),
	(35, 'C:\\fakepath\\Screenshot 2025-02-10 195409.png'),
	(36, 'file1'),
	(36, 'file2'),
	(37, 'file1'),
	(37, 'file2'),
	(38, 'file1'),
	(38, 'file2'),
	(39, 'file1'),
	(39, 'file2'),
	(40, 'file1'),
	(40, 'file2'),
	(41, 'file1'),
	(41, 'file2');

-- Dumping structure for table ql_datphong.reservation_service
CREATE TABLE IF NOT EXISTS `reservation_service` (
  `reservation_id` bigint(20) NOT NULL,
  `service_id` bigint(20) NOT NULL,
  KEY `FKjpu82eqbnjxc7sp25jl349obu` (`service_id`),
  KEY `FKky2gr8jk9fw121e8rxogc8ccm` (`reservation_id`),
  CONSTRAINT `FKjpu82eqbnjxc7sp25jl349obu` FOREIGN KEY (`service_id`) REFERENCES `service` (`service_id`),
  CONSTRAINT `FKky2gr8jk9fw121e8rxogc8ccm` FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`reservation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table ql_datphong.reservation_service: ~0 rows (approximately)
INSERT INTO `reservation_service` (`reservation_id`, `service_id`) VALUES
	(1, 1),
	(2, 3),
	(2, 1),
	(16, 1),
	(16, 2),
	(17, 1),
	(17, 2),
	(18, 1),
	(18, 2),
	(19, 1),
	(19, 2),
	(20, 2),
	(20, 7),
	(21, 5),
	(22, 3),
	(23, 3),
	(24, 3),
	(25, 3),
	(26, 7),
	(26, 9),
	(27, 7),
	(27, 9),
	(28, 7),
	(28, 9),
	(29, 1),
	(30, 3),
	(30, 5),
	(31, 3),
	(32, 3),
	(33, 2),
	(34, 2),
	(35, 4),
	(36, 1),
	(36, 2),
	(37, 1),
	(37, 2),
	(38, 1),
	(38, 2),
	(39, 1),
	(39, 2),
	(40, 1),
	(40, 2),
	(41, 1),
	(41, 2);

-- Dumping structure for table ql_datphong.room
CREATE TABLE IF NOT EXISTS `room` (
  `room_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `capacity` int(11) NOT NULL,
  `room_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status_room` enum('AVAILABLE','MAINTAIN','ONGOING','REPAIR') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type_room` enum('CONFERENCEROOM','DEFAULT','VIP') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location_id` bigint(20) DEFAULT NULL,
  `price_id` bigint(20) DEFAULT NULL,
  `approver_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`room_id`),
  KEY `FKeu3mfjn8pcwbb7jh9rb6tcs32` (`price_id`),
  KEY `FKj7m6our9ety1o5mxrmpgen6qp` (`approver_id`),
  KEY `UKfjnal9itsdgfdr3ow1ul532bt` (`location_id`) USING BTREE,
  CONSTRAINT `FKeu3mfjn8pcwbb7jh9rb6tcs32` FOREIGN KEY (`price_id`) REFERENCES `price` (`price_id`),
  CONSTRAINT `FKj7m6our9ety1o5mxrmpgen6qp` FOREIGN KEY (`approver_id`) REFERENCES `employee` (`employee_id`),
  CONSTRAINT `FKrqejnp96gs9ldf7o6fciylxkt` FOREIGN KEY (`location_id`) REFERENCES `location` (`location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ql_datphong.room: ~0 rows (approximately)
INSERT INTO `room` (`room_id`, `capacity`, `room_name`, `status_room`, `type_room`, `location_id`, `price_id`, `approver_id`) VALUES
	(1, 10, 'Maria', 'AVAILABLE', 'DEFAULT', 4, 1, 1),
	(2, 20, 'Vokka', 'AVAILABLE', 'DEFAULT', 6, 3, 1),
	(3, 10, 'Hazel', 'AVAILABLE', 'VIP', 7, 4, 1),
	(4, 20, 'Buffter', 'AVAILABLE', 'DEFAULT', 5, 2, 1),
	(7, 30, 'Phòng họp doanh nghiệp', 'AVAILABLE', 'VIP', 8, 12, 1),
	(8, 10, 'Phòng thứ cấp', 'MAINTAIN', 'VIP', 9, 14, 1),
	(9, 10, 'Phòng họp tài chính', 'AVAILABLE', 'VIP', 13, 36, NULL),
	(10, 15, 'Phòng họp A3.02', 'AVAILABLE', 'VIP', 14, 37, NULL),
	(11, 5, 'Matcha 1A', 'AVAILABLE', 'VIP', 15, 38, NULL),
	(12, 10, 'Visiusss', 'AVAILABLE', 'DEFAULT', 11, 39, NULL),
	(13, 10, 'Salabeto', 'AVAILABLE', 'VIP', 12, 40, NULL),
	(14, 25, 'Alaxender', 'AVAILABLE', 'VIP', 16, 41, NULL),
	(15, 20, 'Napolaon', 'AVAILABLE', 'VIP', 17, 42, NULL),
	(16, 40, 'Nankaasai', 'AVAILABLE', 'VIP', 18, 43, NULL),
	(17, 30, 'Naddascva', 'AVAILABLE', 'VIP', 19, 44, NULL),
	(18, 15, 'JoBatcap', 'AVAILABLE', 'VIP', 20, 45, NULL),
	(19, 4, 'A4.02', 'AVAILABLE', 'VIP', 2, 55, NULL),
	(21, 4, 'A4.02', 'AVAILABLE', 'VIP', 2, 57, NULL),
	(22, 30, 'A13', 'AVAILABLE', 'VIP', 1, 58, NULL),
	(23, 10, 'A03', 'AVAILABLE', 'VIP', 24, 59, NULL);

-- Dumping structure for table ql_datphong.room_device
CREATE TABLE IF NOT EXISTS `room_device` (
  `quantity` int(11) NOT NULL,
  `room_id` bigint(20) NOT NULL,
  `device_id` bigint(20) NOT NULL,
  PRIMARY KEY (`device_id`,`room_id`),
  KEY `FK4v7vq2wyc0gehiyeqj4bnitkt` (`room_id`),
  CONSTRAINT `FK4v7vq2wyc0gehiyeqj4bnitkt` FOREIGN KEY (`room_id`) REFERENCES `room` (`room_id`),
  CONSTRAINT `FKi0ck9pu6eoan6rntpybydtp29` FOREIGN KEY (`device_id`) REFERENCES `device` (`device_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table ql_datphong.room_device: ~25 rows (approximately)
INSERT INTO `room_device` (`quantity`, `room_id`, `device_id`) VALUES
	(1, 1, 1),
	(1, 3, 1),
	(1, 4, 1),
	(2, 7, 1),
	(2, 8, 1),
	(2, 10, 1),
	(2, 11, 1),
	(2, 12, 1),
	(2, 13, 1),
	(2, 14, 1),
	(2, 15, 1),
	(2, 16, 1),
	(2, 17, 1),
	(2, 18, 1),
	(1, 1, 2),
	(2, 2, 2),
	(1, 8, 2),
	(1, 22, 2),
	(2, 2, 3),
	(1, 3, 3),
	(2, 21, 3),
	(1, 22, 3),
	(1, 23, 3),
	(1, 1, 6),
	(1, 1, 7);

-- Dumping structure for table ql_datphong.room_imgs
CREATE TABLE IF NOT EXISTS `room_imgs` (
  `room_room_id` bigint(20) NOT NULL,
  `imgs` varchar(255) DEFAULT NULL,
  KEY `FKrnck0q2se0qpxlgrq4e17b3mi` (`room_room_id`),
  CONSTRAINT `FKrnck0q2se0qpxlgrq4e17b3mi` FOREIGN KEY (`room_room_id`) REFERENCES `room` (`room_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Dumping data for table ql_datphong.room_imgs: ~34 rows (approximately)
INSERT INTO `room_imgs` (`room_room_id`, `imgs`) VALUES
	(7, 'https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-8.jpg'),
	(7, 'https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-8.jpg'),
	(8, 'https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-8.jpg'),
	(8, 'https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-8.jpg'),
	(1, 'https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-8.jpg'),
	(9, 'https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-8.jpg'),
	(9, 'https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-8.jpg'),
	(10, 'https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-8.jpg'),
	(10, 'https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-8.jpg'),
	(11, 'https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-8.jpg'),
	(11, 'https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-8.jpg'),
	(12, 'https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-8.jpg'),
	(12, 'https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-8.jpg'),
	(13, 'https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-8.jpg'),
	(13, 'https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-8.jpg'),
	(14, 'https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-8.jpg'),
	(14, 'https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-8.jpg'),
	(15, 'https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-8.jpg'),
	(15, 'https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-8.jpg'),
	(16, 'https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-8.jpg'),
	(16, 'https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-8.jpg'),
	(17, 'https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-8.jpg'),
	(17, 'https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-8.jpg'),
	(18, 'https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-8.jpg'),
	(18, 'https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-8.jpg'),
	(2, 'https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-8.jpg'),
	(3, 'https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-8.jpg'),
	(4, 'https://smartdecor.vn/wp-content/uploads/2023/12/mau-noi-that-phong-hop-dep-8.jpg'),
	(19, '1'),
	(19, '2'),
	(21, '1'),
	(21, '2'),
	(22, 'https://res.cloudinary.com/drfbxuss6/image/upload/v1742402001/jftojqwoqpqkwccih3sz.png'),
	(23, 'https://res.cloudinary.com/drfbxuss6/image/upload/v1742402587/i2u6wxrt3wmw3dxuobem.png');

-- Dumping structure for table ql_datphong.service
CREATE TABLE IF NOT EXISTS `service` (
  `service_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `service_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`service_id`),
  KEY `FKlseq2n8malh1ngayy79q62kal` (`price_id`),
  CONSTRAINT `FKlseq2n8malh1ngayy79q62kal` FOREIGN KEY (`price_id`) REFERENCES `price` (`price_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ql_datphong.service: ~15 rows (approximately)
INSERT INTO `service` (`service_id`, `description`, `service_name`, `price_id`) VALUES
	(1, 'Nước suối đóng chai', 'Nước suối', 13),
	(2, ' ', 'Cà phê', 9),
	(3, ' ', 'Trà ô lông', 28),
	(4, ' ', 'Xịt thơm phòng', 11),
	(5, 'Nhanh', 'Loai A11', 17),
	(7, 'tốt', 'Loại B', 22),
	(8, '', 'Loại C', 23),
	(9, 'tốt', 'Loại D', 24),
	(10, '', 'Loại E', 25),
	(11, '', 'Loại F', 26),
	(12, '', 'Loại I', 27),
	(13, '', 'Loại H', 28),
	(14, ' ', 'small', 10),
	(15, ' tốt', 'small', 20),
	(16, 'Hoa và trái cây tươi mua trong ngày', 'Hoa quả', 47);

-- Dumping structure for table ql_datphong.token
CREATE TABLE IF NOT EXISTS `token` (
  `token_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `expired` bit(1) NOT NULL,
  `expiry_date` datetime(6) DEFAULT NULL,
  `revoked` bit(1) NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `token_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
