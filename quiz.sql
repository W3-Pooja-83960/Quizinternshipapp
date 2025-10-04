-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: quiz
-- ------------------------------------------------------
-- Server version	8.0.43-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `StudentQuiz`
--

DROP TABLE IF EXISTS `StudentQuiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `StudentQuiz` (
  `attempt_id` int NOT NULL AUTO_INCREMENT,
  `student_id` int DEFAULT NULL,
  `quiz_id` int DEFAULT NULL,
  `score` int DEFAULT NULL,
  `group_name` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`attempt_id`),
  KEY `fk_StudentQuiz_student` (`student_id`),
  KEY `fk_StudentQuiz_quiz` (`quiz_id`),
  CONSTRAINT `fk_StudentQuiz_quiz` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`quiz_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_StudentQuiz_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `StudentQuiz`
--

LOCK TABLES `StudentQuiz` WRITE;
/*!40000 ALTER TABLE `StudentQuiz` DISABLE KEYS */;
INSERT INTO `StudentQuiz` VALUES (1,2,1,18,'W1'),(2,2,2,14,'W1');
/*!40000 ALTER TABLE `StudentQuiz` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assigned_quiz`
--

DROP TABLE IF EXISTS `assigned_quiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assigned_quiz` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quiz_id` int NOT NULL,
  `group_name` varchar(255) NOT NULL,
  `assigned_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_quiz_group` (`quiz_id`,`group_name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assigned_quiz`
--

LOCK TABLES `assigned_quiz` WRITE;
/*!40000 ALTER TABLE `assigned_quiz` DISABLE KEYS */;
INSERT INTO `assigned_quiz` VALUES (1,1,'W1','2025-10-03 16:33:09'),(2,2,'W1','2025-10-03 16:33:22');
/*!40000 ALTER TABLE `assigned_quiz` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `batch`
--

DROP TABLE IF EXISTS `batch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `batch` (
  `batch_id` varchar(10) NOT NULL,
  `batch_name` varchar(30) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  PRIMARY KEY (`batch_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `batch`
--

LOCK TABLES `batch` WRITE;
/*!40000 ALTER TABLE `batch` DISABLE KEYS */;
INSERT INTO `batch` VALUES ('0323','Mar 23','2023-03-01','2023-08-31'),('0324','Sep 23','2023-08-01','2024-03-31'),('0924','Mar 24','2024-09-09','2025-01-05');
/*!40000 ALTER TABLE `batch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `batch_course`
--

DROP TABLE IF EXISTS `batch_course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `batch_course` (
  `batch_id` int NOT NULL,
  `course_id` int NOT NULL,
  PRIMARY KEY (`batch_id`,`course_id`),
  KEY `batch_course_fk` (`course_id`),
  CONSTRAINT `batch_course_fk` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `batch_course`
--

LOCK TABLES `batch_course` WRITE;
/*!40000 ALTER TABLE `batch_course` DISABLE KEYS */;
INSERT INTO `batch_course` VALUES (1,1001),(2,1001),(3,1001),(5,1001),(6,1001),(1,2001),(2,2001),(3,2001),(4,2001),(5,2001),(6,2001),(1,3001),(2,3001),(3,3001),(4,3001),(5,3001),(6,3001),(1,4001),(2,4001),(3,4001),(4,4001),(5,4001),(6,4001),(1,5001),(2,5001),(3,5001),(4,5001),(5,5001),(6,5001);
/*!40000 ALTER TABLE `batch_course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course` (
  `course_id` int NOT NULL AUTO_INCREMENT,
  `course_name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6002 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
INSERT INTO `course` VALUES (1001,'DMC'),(2001,'DAC'),(3001,'DBDA'),(4001,'DITISS'),(5001,'DESD');
/*!40000 ALTER TABLE `course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_module`
--

DROP TABLE IF EXISTS `course_module`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_module` (
  `course_id` int NOT NULL,
  `module_id` int NOT NULL,
  `course_name` varchar(20) DEFAULT NULL,
  `module_name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`course_id`,`module_id`),
  KEY `fk_course_module` (`module_id`),
  CONSTRAINT `course_module_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_course_module` FOREIGN KEY (`module_id`) REFERENCES `module` (`module_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_module`
--

LOCK TABLES `course_module` WRITE;
/*!40000 ALTER TABLE `course_module` DISABLE KEYS */;
INSERT INTO `course_module` VALUES (1001,101,'DMC','Java'),(1001,102,'DMC','MySQL'),(1001,103,'DMC','Android'),(1001,104,'DMC','Hybrid'),(1001,105,'DMC','iOS'),(1001,106,'DMC','OS'),(1001,107,'DMC','DSA'),(1001,115,'DMC','React'),(2001,101,'DAC','Java'),(2001,102,'DAC','MySQL'),(2001,104,'DAC','Hybrid'),(2001,107,'DAC','DSA'),(2001,111,'DAC','WebJava'),(3001,101,'DBDA','Java'),(3001,102,'DBDA','MySQL'),(3001,108,'DBDA','Machine Learning'),(3001,109,'DBDA','Python'),(3001,110,'DBDA','Cloud'),(4001,109,'DITISS','Python'),(4001,112,'DITISS','Networking'),(4001,114,'DITISS','Microprocessor'),(5001,113,'DESD','Cpp');
/*!40000 ALTER TABLE `course_module` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `module`
--

DROP TABLE IF EXISTS `module`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `module` (
  `module_id` int NOT NULL,
  `module_name` varchar(50) DEFAULT NULL,
  `course_id` int DEFAULT NULL,
  PRIMARY KEY (`module_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `module`
--

LOCK TABLES `module` WRITE;
/*!40000 ALTER TABLE `module` DISABLE KEYS */;
INSERT INTO `module` VALUES (101,'Java',NULL),(102,'MySQL',NULL),(103,'Android',NULL),(104,'Hybrid',NULL),(105,'iOS',NULL),(106,'OS',NULL),(107,'DSA',NULL),(108,'Machine Learning',NULL),(109,'Python',NULL),(110,'Cloud',NULL),(111,'WebJava',NULL),(112,'Networking',NULL),(113,'cpp',NULL),(114,'Microprocessor',NULL),(115,'React',NULL);
/*!40000 ALTER TABLE `module` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question_bank`
--

DROP TABLE IF EXISTS `question_bank`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question_bank` (
  `question_id` int NOT NULL AUTO_INCREMENT,
  `quiz_id` int NOT NULL,
  `question_text` text NOT NULL,
  `option_a` varchar(255) DEFAULT NULL,
  `option_b` varchar(255) DEFAULT NULL,
  `option_c` varchar(255) DEFAULT NULL,
  `option_d` varchar(255) DEFAULT NULL,
  `answer` varchar(255) DEFAULT NULL,
  `marks` int DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`question_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question_bank`
--

LOCK TABLES `question_bank` WRITE;
/*!40000 ALTER TABLE `question_bank` DISABLE KEYS */;
INSERT INTO `question_bank` VALUES (1,1,'What is the default value of a boolean variable in Java?','true','false','0','null','false',2,'2025-10-01 12:52:02'),(2,1,'Which of the following is a valid declaration of a Java array?','int arr;','int arr[] = {1, 2, 3};','int arr = [1, 2, 3];','int arr{};','int arr[] = {1, 2, 3};',2,'2025-10-01 12:52:02'),(3,1,'Which of these is not a Java keyword?','static','Boolean','class','try','Boolean',2,'2025-10-01 12:52:02'),(4,1,'What will be the output of the following code? System.out.println(10 + 20 + \'30\');','3030','102030','129','303','1',2,'2025-10-01 12:52:02'),(5,1,'Which of these is used to handle exceptions in Java?','try-catch','do-while','if-else','switch','try-catch',2,'2025-10-01 12:52:02'),(6,1,'What is the size of int in Java?','4 bytes','2 bytes','8 bytes','Depends on OS','4 bytes',2,'2025-10-01 12:52:02'),(7,1,'Which method is used to start a thread in Java?','run()','start()','execute()','init()','start()',2,'2025-10-01 12:52:02'),(8,1,'Which of these cannot be used for a switch expression in Java?','int','String','boolean','char','boolean',2,'2025-10-01 12:52:02'),(9,1,'What is the parent class of all classes in Java?','Object','Class','Main','System','Object',2,'2025-10-01 12:52:02'),(10,1,'Which of these is the correct way to create a Java object?','MyClass obj = new MyClass();','MyClass obj = MyClass();','new MyClass obj;','MyClass obj();','MyClass obj = new MyClass();',2,'2025-10-01 12:52:02'),(11,2,'Which command is used to create a new database?','CREATE TABLE','CREATE DATABASE','NEW DATABASE','MAKE DATABASE','CREATE DATABASE',1,'2025-10-03 14:41:04'),(12,2,'Which command is used to remove a table?','DROP DATABASE','DELETE TABLE','DROP TABLE','REMOVE TABLE','DROP TABLE',1,'2025-10-03 14:41:04'),(13,2,'Which of these is the correct way to select all records from a table named users?','SELECT * FROM users;','GET * FROM users;','SELECT ALL FROM users;','SELECT users FROM *;','SELECT * FROM users;',1,'2025-10-03 14:41:04'),(14,2,'Which keyword is used to filter records in a SELECT statement?','WHERE','HAVING','FILTER','IF','WHERE',1,'2025-10-03 14:41:04'),(15,2,'Which operator is used to select records within a range?','BETWEEN','IN','LIKE','RANGE','BETWEEN',1,'2025-10-03 14:41:04'),(16,2,'Which SQL statement is used to update existing records?','MODIFY','UPDATE','CHANGE','ALTER','UPDATE',1,'2025-10-03 14:41:04'),(17,2,'Which SQL statement is used to delete all records from a table?','DELETE FROM table_name;','REMOVE table_name;','DROP table_name;','CLEAR table_name;','DELETE FROM table_name;',1,'2025-10-03 14:41:04'),(18,2,'Which clause is used to sort the result-set?','ORDER BY','SORT BY','GROUP BY','FILTER BY','ORDER BY',1,'2025-10-03 14:41:04'),(19,2,'Which SQL function returns the number of rows?','SUM()','COUNT()','MAX()','ROWS()','COUNT()',1,'2025-10-03 14:41:04'),(20,2,'Which of these is used to combine rows from two tables based on a related column?','JOIN','UNION','CONNECT','MERGE','JOIN',1,'2025-10-03 14:41:04'),(21,2,'Which type of JOIN returns all records from the left table and matched records from the right table?','INNER JOIN','LEFT JOIN','RIGHT JOIN','FULL JOIN','LEFT JOIN',1,'2025-10-03 14:41:04'),(22,2,'Which keyword is used to remove duplicate records from a SELECT result?','DISTINCT','UNIQUE','NO DUPLICATES','FILTER','DISTINCT',1,'2025-10-03 14:41:04'),(23,2,'Which clause is used to group rows that have the same values?','GROUP BY','ORDER BY','WHERE','HAVING','GROUP BY',1,'2025-10-03 14:41:04'),(24,2,'Which SQL statement is used to add a new column to a table?','ADD COLUMN','ALTER TABLE','INSERT COLUMN','MODIFY TABLE','ALTER TABLE',1,'2025-10-03 14:41:04'),(25,2,'Which SQL keyword is used to prevent duplicate entries in a column?','PRIMARY KEY','FOREIGN KEY','UNIQUE','CHECK','UNIQUE',1,'2025-10-03 14:41:04'),(26,2,'Which SQL data type is used to store a date?','DATETIME','DATE','TIMESTAMP','All of the above','All of the above',1,'2025-10-03 14:41:04'),(27,2,'Which SQL statement is used to create an index on a table?','CREATE INDEX','ADD INDEX','MAKE INDEX','SET INDEX','CREATE INDEX',1,'2025-10-03 14:41:04'),(28,2,'Which SQL keyword is used to retrieve only unique records?','DISTINCT','UNIQUE','UNION','GROUP','DISTINCT',1,'2025-10-03 14:41:04'),(29,2,'Which SQL clause is used to specify conditions in aggregate functions?','HAVING','WHERE','FILTER','IF','HAVING',1,'2025-10-03 14:41:04'),(30,2,'Which command is used to remove a database?','DELETE DATABASE','DROP DATABASE','REMOVE DATABASE','TRUNCATE DATABASE','DROP DATABASE',1,'2025-10-03 14:41:04');
/*!40000 ALTER TABLE `question_bank` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz`
--

DROP TABLE IF EXISTS `quiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quiz` (
  `quiz_id` int NOT NULL AUTO_INCREMENT,
  `quiz_title` varchar(50) DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `marks` int DEFAULT NULL,
  `module_id` int DEFAULT NULL,
  `staff_id` int DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `course_id` int DEFAULT NULL,
  `group_name` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`quiz_id`),
  KEY `fk_quiz_module` (`module_id`),
  KEY `fk_quiz_staff` (`staff_id`),
  CONSTRAINT `fk_quiz_module` FOREIGN KEY (`module_id`) REFERENCES `module` (`module_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_quiz_staff` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`staff_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz`
--

LOCK TABLES `quiz` WRITE;
/*!40000 ALTER TABLE `quiz` DISABLE KEYS */;
INSERT INTO `quiz` VALUES (1,'Java',20,20,101,1,1,1001,'W1'),(2,'Mysql',20,20,102,1,1,1001,'W1'),(3,'Android',20,20,103,1,1,1001,'W1');
/*!40000 ALTER TABLE `quiz` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff` (
  `staff_id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(30) DEFAULT NULL,
  `lastName` varchar(30) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `role` enum('admin','coordinator','mentor') DEFAULT 'mentor',
  PRIMARY KEY (`staff_id`),
  UNIQUE KEY `unique_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff`
--

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
INSERT INTO `staff` VALUES (1,'Admin','Admin','admin@gmail.com','$2b$10$2K4EtWkvsxEaen2Pi/LABOommh9NcjdY.3c7Kt.UbFPV07ZZlqEl2','admin'),(2,'Anita','Desai','anita.desai@gmail.com','$2b$10$S8mbaEbdBy16sksgd16yBOcFhgAGngMzkJGXpM5mv3t0X5ts8Ypzm','coordinator');
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `studentAnswer`
--

DROP TABLE IF EXISTS `studentAnswer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `studentAnswer` (
  `studentAnswer_id` int NOT NULL AUTO_INCREMENT,
  `attempt_id` int DEFAULT NULL,
  `questions_id` int DEFAULT NULL,
  `answer` varchar(255) DEFAULT NULL,
  `is_correct` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`studentAnswer_id`),
  KEY `fk_attempt` (`attempt_id`),
  KEY `fk_studentAnswer_questionBank` (`questions_id`),
  CONSTRAINT `fk_attempt` FOREIGN KEY (`attempt_id`) REFERENCES `StudentQuiz` (`attempt_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_studentAnswer_questionBank` FOREIGN KEY (`questions_id`) REFERENCES `question_bank` (`question_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studentAnswer`
--

LOCK TABLES `studentAnswer` WRITE;
/*!40000 ALTER TABLE `studentAnswer` DISABLE KEYS */;
INSERT INTO `studentAnswer` VALUES (1,1,1,'false',1),(2,1,2,'int arr[] = {1, 2, 3};',1),(3,1,3,'Boolean',1),(4,1,5,'try-catch',1),(5,1,4,'3030',0),(6,1,6,'4 bytes',1),(7,1,7,'start()',1),(8,1,8,'boolean',1),(9,1,9,'Object',1),(10,1,10,'MyClass obj = new MyClass();',1),(11,2,12,'DROP DATABASE',0),(12,2,21,'LEFT JOIN',1),(13,2,11,'CREATE DATABASE',1),(14,2,22,'DISTINCT',1),(15,2,24,'ADD COLUMN',0),(16,2,23,'HAVING',0),(17,2,25,'PRIMARY KEY',0),(18,2,26,'All of the above',1),(19,2,27,'CREATE INDEX',1),(20,2,28,'DISTINCT',1),(21,2,29,'WHERE',0),(22,2,30,'DROP DATABASE',1),(23,2,13,'SELECT * FROM users;',1),(24,2,14,'WHERE',1),(25,2,15,'BETWEEN',1),(26,2,17,'DELETE FROM table_name;',1),(27,2,18,'ORDER BY',1),(28,2,19,'ROWS()',0),(29,2,20,'JOIN',1),(30,2,16,'UPDATE',1);
/*!40000 ALTER TABLE `studentAnswer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_group`
--

DROP TABLE IF EXISTS `student_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_group` (
  `group_id` int NOT NULL AUTO_INCREMENT,
  `group_name` varchar(100) DEFAULT NULL,
  `student_id` int DEFAULT NULL,
  `course_id` int DEFAULT NULL,
  PRIMARY KEY (`group_id`),
  UNIQUE KEY `unique_student` (`student_id`),
  CONSTRAINT `fk_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_studentGroup_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_group`
--

LOCK TABLES `student_group` WRITE;
/*!40000 ALTER TABLE `student_group` DISABLE KEYS */;
INSERT INTO `student_group` VALUES (2,'W1',2,1001);
/*!40000 ALTER TABLE `student_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `student_id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(30) DEFAULT NULL,
  `lastName` varchar(30) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `prnNo` int DEFAULT NULL,
  `course_id` int DEFAULT NULL,
  `batch_id` varchar(10) DEFAULT NULL,
  `group_name` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `unique_email` (`email`),
  KEY `fk_students_course` (`course_id`),
  CONSTRAINT `fk_students_course` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (2,'sammy','sharma','sam@gmail.com','$2b$10$fKXbZeH2y1ojQL9MCUJpfucDVhH2gcIQUHHPJgvGNxzFb6wFzSpKu',12345678,1001,'0924','W1'),(4,'riya','sharma','riya@gmail.com','$2b$10$akjQXFYv5MhF1rRLkNDlxurKvN8ZTDKJD44PHBT3RbcZxT65Z6MJi',NULL,NULL,NULL,NULL),(5,'Abc','Abc','abc@gmail.com','$2b$10$A/D/ENKLJXdK2Iu1BMZ.OOJeuzQiLfrca/RphuCnzEB1rClKuomS6',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_student_update` AFTER UPDATE ON `students` FOR EACH ROW BEGIN
    
    IF NEW.group_name IS NOT NULL THEN
        INSERT INTO student_group (student_id, group_name, course_id)
        VALUES (NEW.student_id, NEW.group_name, NEW.course_id)
        ON DUPLICATE KEY UPDATE
            group_name = VALUES(group_name),
            course_id = VALUES(course_id);
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-04 18:33:56
