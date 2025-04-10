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
  `role` enum('ADMIN','APPROVER','USER') DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `is_first_login` bit(1) NOT NULL,
  PRIMARY KEY (`account_id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table ql_datphong.account: ~29 rows (approximately)
INSERT INTO `account` (`account_id`, `password`, `role`, `user_name`, `is_first_login`) VALUES
	(1, '$2a$10$QUe48S5mHlSHAtrEZyLJV.9GIlAUzCt0NfRr63a10J4ftM0N9h0hu', 'ADMIN', '0914653334', b'0'),
	(2, '$2a$10$QUe48S5mHlSHAtrEZyLJV.9GIlAUzCt0NfRr63a10J4ftM0N9h0hu', 'USER', '0724653334', b'0'),
	(3, '$2a$10$QUe48S5mHlSHAtrEZyLJV.9GIlAUzCt0NfRr63a10J4ftM0N9h0hu', 'APPROVER', '0914653332', b'0'),
	(4, '$2a$10$QUe48S5mHlSHAtrEZyLJV.9GIlAUzCt0NfRr63a10J4ftM0N9h0hu', 'APPROVER', '0914653331', b'0'),
	(6, '$2a$10$QUe48S5mHlSHAtrEZyLJV.9GIlAUzCt0NfRr63a10J4ftM0N9h0hu', 'APPROVER', '0914653221', b'0'),
	(7, '$2a$10$QUe48S5mHlSHAtrEZyLJV.9GIlAUzCt0NfRr63a10J4ftM0N9h0hu', 'APPROVER', '0914652221', b'0'),
	(8, '$2a$10$QUe48S5mHlSHAtrEZyLJV.9GIlAUzCt0NfRr63a10J4ftM0N9h0hu', 'APPROVER', '0912652221', b'0'),
	(9, '$2a$10$QUe48S5mHlSHAtrEZyLJV.9GIlAUzCt0NfRr63a10J4ftM0N9h0hu', 'USER', '0912672221', b'0'),
	(10, '$2a$10$QUe48S5mHlSHAtrEZyLJV.9GIlAUzCt0NfRr63a10J4ftM0N9h0hu', 'USER', '0912672921', b'0'),
	(11, '$2a$10$QUe48S5mHlSHAtrEZyLJV.9GIlAUzCt0NfRr63a10J4ftM0N9h0hu', 'USER', '0919672921', b'0'),
	(12, '$2a$10$QUe48S5mHlSHAtrEZyLJV.9GIlAUzCt0NfRr63a10J4ftM0N9h0hu', 'USER', '0919642921', b'0'),
	(15, '$2a$10$QUe48S5mHlSHAtrEZyLJV.9GIlAUzCt0NfRr63a10J4ftM0N9h0hu', 'USER', '0714653334', b'0'),
	(16, '$2a$10$QUe48S5mHlSHAtrEZyLJV.9GIlAUzCt0NfRr63a10J4ftM0N9h0hu', 'USER', '0147152369', b'0'),
	(17, '$2a$10$QUe48S5mHlSHAtrEZyLJV.9GIlAUzCt0NfRr63a10J4ftM0N9h0hu', 'USER', '0147852457', b'0'),
	(18, '$2a$10$QUe48S5mHlSHAtrEZyLJV.9GIlAUzCt0NfRr63a10J4ftM0N9h0hu', 'USER', '0147852475', b'0'),
	(19, '$2a$10$QUe48S5mHlSHAtrEZyLJV.9GIlAUzCt0NfRr63a10J4ftM0N9h0hu', 'USER', '0914654257', b'0'),
	(20, '$2a$10$QUe48S5mHlSHAtrEZyLJV.9GIlAUzCt0NfRr63a10J4ftM0N9h0hu', 'USER', '0147852421', b'0'),
	(21, '$2a$10$QUe48S5mHlSHAtrEZyLJV.9GIlAUzCt0NfRr63a10J4ftM0N9h0hu', 'USER', '0934707412', b'0'),
	(22, '$2a$10$QUe48S5mHlSHAtrEZyLJV.9GIlAUzCt0NfRr63a10J4ftM0N9h0hu', 'USER', '0914653783', b'0'),
	(23, '$2a$10$QUe48S5mHlSHAtrEZyLJV.9GIlAUzCt0NfRr63a10J4ftM0N9h0hu', 'USER', '0914653112', b'0'),
	(24, '$2a$10$QUe48S5mHlSHAtrEZyLJV.9GIlAUzCt0NfRr63a10J4ftM0N9h0hu', 'USER', '0914657534', b'0'),
	(25, '$2a$10$QUe48S5mHlSHAtrEZyLJV.9GIlAUzCt0NfRr63a10J4ftM0N9h0hu', 'USER', '0147852374', b'0'),
	(26, '$2a$10$QUe48S5mHlSHAtrEZyLJV.9GIlAUzCt0NfRr63a10J4ftM0N9h0hu', 'USER', '0914653335', b'0'),
	(27, '$2a$10$QUe48S5mHlSHAtrEZyLJV.9GIlAUzCt0NfRr63a10J4ftM0N9h0hu', 'USER', '0914653754', b'0'),
	(28, '$2a$10$QUe48S5mHlSHAtrEZyLJV.9GIlAUzCt0NfRr63a10J4ftM0N9h0hu', 'USER', '0734707412', b'0'),
	(30, '$2a$10$QUe48S5mHlSHAtrEZyLJV.9GIlAUzCt0NfRr63a10J4ftM0N9h0hu', 'USER', '0734654587', b'0'),
	(31, '$2a$10$QUe48S5mHlSHAtrEZyLJV.9GIlAUzCt0NfRr63a10J4ftM0N9h0hu', 'USER', '0934707416', b'0'),
	(32, '$2a$10$QUe48S5mHlSHAtrEZyLJV.9GIlAUzCt0NfRr63a10J4ftM0N9h0hu', 'USER', '0714653321', b'0'),
	(33, '$2a$10$QUe48S5mHlSHAtrEZyLJV.9GIlAUzCt0NfRr63a10J4ftM0N9h0hu', 'USER', '0794707412', b'0');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
