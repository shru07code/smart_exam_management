-- Database Client 8.4.4
-- Host: localhost Port: 3306 Database: attendance_system 
-- Dump is still an early version, please use the dumped SQL with caution

/*!40101 SET NAMES utf8 */;
/*!40014 SET FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET SQL_NOTES=0 */;
DROP DATABASE IF EXISTS attendance_system;
CREATE DATABASE attendance_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE attendance_system;

CREATE TABLE IF NOT EXISTS `absent_records` (
  `id` int NOT NULL AUTO_INCREMENT,
  `exam_date` date DEFAULT NULL,
  `session` varchar(20) DEFAULT NULL,
  `subject_code` varchar(20) DEFAULT NULL,
  `seat_no` varchar(20) DEFAULT NULL,
  `block_id` int DEFAULT NULL,
  `marked_by` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `answer_book_bundles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `exam_date` date DEFAULT NULL,
  `session` varchar(20) DEFAULT NULL,
  `bundle_number` varchar(10) DEFAULT NULL,
  `course_name` varchar(50) DEFAULT NULL,
  `subject_code` varchar(20) DEFAULT NULL,
  `answer_book_count` int DEFAULT NULL,
  `marksheet_no` varchar(50) DEFAULT NULL,
  `submitted_by` varchar(100) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Submitted',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `billing_records` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `username` varchar(255) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `block_allocation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `exam_date` date NOT NULL,
  `session` varchar(20) NOT NULL,
  `block_id` int DEFAULT NULL,
  `institute_code` varchar(50) DEFAULT NULL,
  `course` varchar(50) DEFAULT NULL,
  `subject_name` varchar(100) DEFAULT NULL,
  `subject_code` varchar(20) DEFAULT NULL,
  `start_seat_no` varchar(20) DEFAULT NULL,
  `end_seat_no` varchar(20) DEFAULT NULL,
  `total_students` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `blocks1` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `location` varchar(100) NOT NULL,
  `col1` int DEFAULT '0',
  `col2` int DEFAULT '0',
  `col3` int DEFAULT '0',
  `col4` int DEFAULT '0',
  `col5` int DEFAULT '0',
  `col6` int DEFAULT '0',
  `col7` int DEFAULT '0',
  `col8` int DEFAULT '0',
  `col9` int DEFAULT '0',
  `col10` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `bundle_receipts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `receipt_type` varchar(20) DEFAULT NULL,
  `exam_date` date DEFAULT NULL,
  `session` varchar(20) DEFAULT NULL,
  `institute_code` varchar(10) DEFAULT NULL,
  `subject_code` varchar(20) DEFAULT NULL,
  `bundle_no` varchar(20) DEFAULT NULL,
  `packets_received` int DEFAULT NULL,
  `received_by` varchar(100) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Received',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `data_entries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `username` varchar(255) NOT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `dcs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `detained_students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `seat_no` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `exam_controllers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `qualification` varchar(255) DEFAULT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `institute_code` varchar(50) DEFAULT NULL,
  `institute_name` varchar(255) DEFAULT NULL,
  `msbte_order_no` varchar(100) DEFAULT NULL,
  `order_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `exam_timetable` (
  `session_type` varchar(100) DEFAULT NULL,
  `exam_date` date DEFAULT NULL,
  `day` varchar(10) DEFAULT NULL,
  `session` varchar(20) DEFAULT NULL,
  `time_slot` varchar(30) DEFAULT NULL,
  `subject_code` varchar(30) DEFAULT NULL,
  `subject_name` varchar(50) DEFAULT NULL,
  `scheme` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `extra_paper` (
  `subject_code` varchar(20) DEFAULT NULL,
  `quantity` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `marksheet` (
  `id` int NOT NULL AUTO_INCREMENT,
  `marksheet_no` varchar(50) DEFAULT NULL,
  `subject_abb` varchar(100) DEFAULT NULL,
  `course` varchar(50) DEFAULT NULL,
  `subject_code` varchar(50) DEFAULT NULL,
  `institute_code` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `paper_inventory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subject_code` varchar(20) DEFAULT NULL,
  `subject_name` varchar(100) DEFAULT NULL,
  `quantity` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `subject_code` (`subject_code`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `qp_usage_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `exam_date` date DEFAULT NULL,
  `session` varchar(20) DEFAULT NULL,
  `subject_code` varchar(20) DEFAULT NULL,
  `total_received` int DEFAULT NULL,
  `used_count` int DEFAULT NULL,
  `scrapped_count` int DEFAULT '0',
  `balance_count` int DEFAULT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `submitted_by` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `seating_chart` (
  `sr_no` int(10) unsigned zerofill DEFAULT NULL,
  `seat_no` varchar(50) DEFAULT NULL,
  `course` varchar(30) DEFAULT NULL,
  `subject_code` varchar(30) DEFAULT NULL,
  `institute_code` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `special_code_assignments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `exam_date` date DEFAULT NULL,
  `session` varchar(20) DEFAULT NULL,
  `seat_no` varchar(20) DEFAULT NULL,
  `subject_code` varchar(20) DEFAULT NULL,
  `special_code` varchar(10) DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) DEFAULT NULL,
  `enrollment_no` varchar(20) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `seat_no` varchar(20) DEFAULT NULL,
  `scheme` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `enrollment_no` (`enrollment_no`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `subject_sections` (
  `subject_code` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `supervisor_allocation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `exam_date` date DEFAULT NULL,
  `session` varchar(50) DEFAULT NULL,
  `block_id` int DEFAULT NULL,
  `supervisor_id` int DEFAULT NULL,
  `reliever_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `block_id` (`block_id`),
  KEY `supervisor_id` (`supervisor_id`),
  KEY `reliever_id` (`reliever_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `supervisors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `system_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(50) DEFAULT NULL,
  `setting_value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- NEW TABLES ADDED FOR UPDATES
CREATE TABLE IF NOT EXISTS `officers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `staff` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `role` varchar(100),
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `officer_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `qualification` varchar(255),
  `designation` varchar(255),
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `msbte_orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `msbte_order` varchar(255) NOT NULL,
  `order_date` date,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `rac_qpapers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `count` int NOT NULL DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `exam_names` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `institutes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL UNIQUE,
  `name` varchar(255) NOT NULL,
  `address` TEXT,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- INSERT INTO billing_records(id,`date`,created_at,username,password_hash) VALUES('1','NULL','''2025-12-24 08:38:47''','''aaditi''','''c'''),('2','NULL','''2025-12-24 15:59:09''','''aaaaa''','''aa''');

-- INSERT INTO block_allocation(id,exam_date,session,block_id,institute_code,course,subject_name,subject_code,start_seat_no,end_seat_no,total_students) VALUES('2','''2026-01-12''','''Morning''','15','''1644''','''K-Scheme''','''SOFTWARE ENGINEERING''','''315324''','''1''','''10''','10'),('4','''2026-01-12''','''Morning''','15','''1644''','''K-Scheme''','''Computer Networks''','''315326''','''1''','''10''','10'),('6','''2026-01-15''','''Afternoon''','7','''1644''','''K-Scheme''','''Database Management''','''315324''','''1''','''10''','10');

-- INSERT INTO blocks1(id,name,location,col1,col2,col3,col4,col5,col6,col7,col8,col9,col10) VALUES('9','''xyz''','''location''','2','23','7','3','0','0','0','0','0','0'),('1','''F''','''location2''','8','2','4','1','4','0','0','0','0','0'),('4','''A''','''class room 2''','9','5','6','0','0','0','0','0','0','0'),('18','''L''','''class2''','5','5','5','5','5','5','5','5','5','5'),('45','''I''','''class3''','8','8','8','8','8','0','0','0','0','0');

-- INSERT INTO bundle_receipts(id,receipt_type,exam_date,session,institute_code,subject_code,bundle_no,packets_received,received_by,status) VALUES('1','NULL','''2026-01-12''','''Morning''','''1644''','''315323''','''1001''','5','''Admin''','''Received'''),('2','NULL','''2026-01-12''','''Morning''','''1644''','''315323''','''1002''','4','''Admin''','''Received'''),('3','NULL','''2026-01-12''','''Morning''','''1644''','''315323''','''1003''','6','''Admin''','''Received'''),('4','NULL','''2026-01-12''','''Afternoon''','''1644''','''315321''','''2001''','3','''Admin''','''Received''');

-- INSERT INTO data_entries(id,created_at,username,password_hash) VALUES('1','''2025-12-24 08:33:35''','''ed''','''fd'''),('2','''2025-12-26 10:35:14''','''ed''','''d'''),('3','''2025-12-26 10:35:14''','''ed''','''d'''),('4','''2025-12-26 10:35:14''','''ed''','''d'''),('5','''2026-01-05 08:31:46''','''sanchita''','''$2b$10$DzhGUoa33nttmfSWIBvFUedTyEjeTEd/kLLDfPKq9IXYgyVUd2/4C''');

-- INSERT INTO dcs(id,code,name,address,created_at) VALUES('1','''32''','''fds''','X''64''','''2025-12-24 08:24:31''');

-- INSERT INTO detained_students(id,seat_no) VALUES('2','''3256365''');

-- INSERT INTO exam_controllers(id,name,qualification,designation,institute_code,institute_name,msbte_order_no,order_date,created_at) VALUES('1','''s''','''a''','''b''','''2''','''s''','''4''','''0005-06-25''','''2025-12-24 08:24:50'''),('2','''s''','''a''','''b''','''2''','''99''','''4''','''0005-06-25''','''2025-12-30 14:12:14''');

-- INSERT INTO exam_timetable(session_type,exam_date,day,session,time_slot,subject_code,subject_name,scheme) VALUES('''Morning Session''','''2026-01-12''','''4''','''A''','''09:00 A.M. to 12:00 P.M.''','''315323''','''SOFTWARE ENGINEERING''','''CWI-6-K'''),('''Afternoon Seesion''','''2026-01-12''','''1''','''A''','''02:00 P.M. to 05:00 P.M.''','''315321''','''ADVANCE COMPUTER NETWORK''','''CWI-5-K'''),('''Morning Session''','''2026-01-13''','''2''','''A''','''09:00 A.M. to 12:00 P.M.''','''315325''','''CLOUD COMPUTING''','''CWI-5-K'''),('''Afternoon Seesion''','''2026-01-13''','''2''','''A''','''02:00 P.M. to 05:00 P.M.''','''315326''','''DATA ANALYTICS''','''CWI-6-K'''),('''Morning Session''','''2026-01-14''','''3''','''A''','''09:00 A.M. to 12:00 P.M.''','''315319''','''OPERATING SYSTEM''','''CWI-6-K''');

-- INSERT INTO extra_paper(subject_code,quantity) VALUES('''20317''','''1''');

-- INSERT INTO marksheet(id,marksheet_no,subject_abb,course,subject_code,institute_code) VALUES('13','''MSBTE001''','''Software Engineering''','''K-Scheme''','''315323''','''1644\\"'''),('14','''MSBTE002''','''Database Management''','''K-Scheme''','''315324''','''1644\\"'''),('15','''MSBTE003''','''Java Programming''','''K-Scheme''','''315325''','''1644\\"'''),('16','''MSBTE004''','''Computer Networks''','''K-Scheme''','''315326''','''1644\\"''');

-- INSERT INTO paper_inventory(id,subject_code,subject_name,quantity) VALUES('1','''315323''','''Estimating and Costing''','2'),('2','''22101''','''English''','5');


-- INSERT INTO seating_chart(sr_no,seat_no,course,subject_code,institute_code) VALUES('0000000001','''361280''','''SD''','''315323''','''1644'''),('0000000002','''361281''','''SD''','''315323''','''1644''');

-- INSERT INTO special_code_assignments(id,exam_date,session,seat_no,subject_code,special_code,reason,created_at) VALUES('3','''2026-01-12''','''Morning Session''','''361281''','''315323''','''401''','NULL','''2026-01-11 19:26:54'''),('5','''2026-01-12''','''Morning Session''','''361280''','''315323''','''401''','NULL','''2026-01-13 13:10:21''');

-- INSERT INTO students(id,full_name,enrollment_no,password_hash,seat_no,scheme) VALUES('1','''Demo Student''','''student1''','''12345''','''361280''','''K-Scheme'''),('2','''demo2''','''stude2''','''12345''','''361281''','''K-Scheme''');

-- INSERT INTO subject_sections(subject_code) VALUES('''21233''');

-- INSERT INTO supervisor_allocation(id,exam_date,session,block_id,supervisor_id,reliever_id) VALUES('1','''2026-01-11''',''' Morning Session''','15','2','1'),('2','''2026-01-11''','''Morning Session''','15','2','1'),('3','''2026-01-12''','''Morning Session''','15','2','1');

-- INSERT INTO supervisors(id,name,designation) VALUES('1','''Prof. S. V. Chavan''','''HOD'''),('2','''Prof. S. R. Patil''','''Lecturer'''),('3','''Prof. M. V. Joshi''','''Lecturer'''),('4','''Prof. P. P. Kulkarni''','''Sr. Lecturer'''),('5','''Prof. R. D. Deshmukh''','''Lab Assistant''');
-- INSERT INTO system_settings(id,setting_key,setting_value) VALUES('1','''center_name''','''SGI'''),('2','''center_code''','''1644'''),('3','''exam_season''','''Summer-2026''');
SET FOREIGN_KEY_CHECKS = 0;

-- ================= billing_records =================
INSERT INTO billing_records(`date`, created_at, username, password_hash) VALUES
(NULL,'2025-12-24 08:38:47','aaditi','c'),
(NULL,'2025-12-24 15:59:09','aaaaa','aa');

-- ================= block_allocation =================
INSERT INTO block_allocation(exam_date,session,block_id,institute_code,course,subject_name,subject_code,start_seat_no,end_seat_no,total_students) VALUES
('2026-01-12','Morning',15,'1644','K-Scheme','SOFTWARE ENGINEERING','315324',1,10,10),
('2026-01-12','Morning',15,'1644','K-Scheme','Computer Networks','315326',1,10,10),
('2026-01-15','Afternoon',7,'1644','K-Scheme','Database Management','315324',1,10,10);

-- ================= blocks1 =================
INSERT INTO blocks1(name,location,col1,col2,col3,col4,col5,col6,col7,col8,col9,col10) VALUES
('xyz','location',2,23,7,3,0,0,0,0,0,0),
('F','location2',8,2,4,1,4,0,0,0,0,0),
('A','class room 2',9,5,6,0,0,0,0,0,0,0),
('L','class2',5,5,5,5,5,5,5,5,5,5),
('I','class3',8,8,8,8,8,0,0,0,0,0);

-- ================= bundle_receipts =================
INSERT INTO bundle_receipts(receipt_type,exam_date,session,institute_code,subject_code,bundle_no,packets_received,received_by,status) VALUES
(NULL,'2026-01-12','Morning','1644','315323','1001',5,'Admin','Received'),
(NULL,'2026-01-12','Morning','1644','315323','1002',4,'Admin','Received'),
(NULL,'2026-01-12','Morning','1644','315323','1003',6,'Admin','Received'),
(NULL,'2026-01-12','Afternoon','1644','315321','2001',3,'Admin','Received');

-- ================= data_entries =================
INSERT INTO data_entries(created_at,username,password_hash) VALUES
('2025-12-24 08:33:35','ed','fd'),
('2025-12-26 10:35:14','ed','d'),
('2025-12-26 10:35:14','ed','d'),
('2025-12-26 10:35:14','ed','d'),
('2026-01-05 08:31:46','sanchita','$2b$10$DzhGUoa33nttmfSWIBvFUedTyEjeTEd/kLLDfPKq9IXYgyVUd2/4C');

-- ================= dcs =================
INSERT INTO dcs(code,name,address,created_at) VALUES
('32','fds','X64','2025-12-24 08:24:31');

-- ================= detained_students =================
INSERT INTO detained_students(seat_no) VALUES
('3256365');

-- ================= exam_controllers =================
INSERT INTO exam_controllers(name,qualification,designation,institute_code,institute_name,msbte_order_no,order_date,created_at) VALUES
('s','a','b','2','s','4','0005-06-25','2025-12-24 08:24:50'),
('s','a','b','2','99','4','0005-06-25','2025-12-30 14:12:14');

-- ================= exam_timetable =================
INSERT INTO exam_timetable(session_type,exam_date,day,session,time_slot,subject_code,subject_name,scheme) VALUES
('Morning Session','2026-01-12','4','A','09:00 A.M. to 12:00 P.M.','315323','SOFTWARE ENGINEERING','CWI-6-K'),
('Afternoon Session','2026-01-12','1','A','02:00 P.M. to 05:00 P.M.','315321','ADVANCE COMPUTER NETWORK','CWI-5-K'),
('Morning Session','2026-01-13','2','A','09:00 A.M. to 12:00 P.M.','315325','CLOUD COMPUTING','CWI-5-K'),
('Afternoon Session','2026-01-13','2','A','02:00 P.M. to 05:00 P.M.','315326','DATA ANALYTICS','CWI-6-K'),
('Morning Session','2026-01-14','3','A','09:00 A.M. to 12:00 P.M.','315319','OPERATING SYSTEM','CWI-6-K');

-- ================= extra_paper =================
INSERT INTO extra_paper(subject_code,quantity) VALUES
('20317',1);

-- ================= marksheet =================
INSERT INTO marksheet(marksheet_no,subject_abb,course,subject_code,institute_code) VALUES
('MSBTE001','Software Engineering','K-Scheme','315323','1644'),
('MSBTE002','Database Management','K-Scheme','315324','1644'),
('MSBTE003','Java Programming','K-Scheme','315325','1644'),
('MSBTE004','Computer Networks','K-Scheme','315326','1644');

-- ================= paper_inventory =================
INSERT INTO paper_inventory(subject_code,subject_name,quantity) VALUES
('315323','Estimating and Costing',2),
('22101','English',5);

-- ================= seating_chart =================
INSERT INTO seating_chart(sr_no,seat_no,course,subject_code,institute_code) VALUES
('0000000001','361280','SD','315323','1644'),
('0000000002','361281','SD','315323','1644');

-- ================= special_code_assignments =================
INSERT INTO special_code_assignments(exam_date,session,seat_no,subject_code,special_code,reason,created_at) VALUES
('2026-01-12','Morning Session','361281','315323','401',NULL,'2026-01-11 19:26:54'),
('2026-01-12','Morning Session','361280','315323','401',NULL,'2026-01-13 13:10:21');

-- ================= students =================
INSERT INTO students(full_name,enrollment_no,password_hash,seat_no,scheme) VALUES
('Demo Student','student1','12345','361280','K-Scheme'),
('demo2','stude2','12345','361281','K-Scheme');

-- ================= subject_sections =================
INSERT INTO subject_sections(subject_code) VALUES
('21233');

-- ================= supervisor_allocation =================
INSERT INTO supervisor_allocation(exam_date,session,block_id,supervisor_id,reliever_id) VALUES
('2026-01-11','Morning Session',15,2,1),
('2026-01-11','Morning Session',15,2,1),
('2026-01-12','Morning Session',15,2,1);

-- ================= supervisors =================
INSERT INTO supervisors(name,designation) VALUES
('Prof. S. V. Chavan','HOD'),
('Prof. S. R. Patil','Lecturer'),
('Prof. M. V. Joshi','Lecturer'),
('Prof. P. P. Kulkarni','Sr. Lecturer'),
('Prof. R. D. Deshmukh','Lab Assistant');

-- ================= system_settings =================
INSERT INTO system_settings(setting_key,setting_value) VALUES
('center_name','SGI'),
('center_code','1644'),
('exam_season','Summer-2026');

SET FOREIGN_KEY_CHECKS = 1;
