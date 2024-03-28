-- MySQL Script generated by MySQL Workbench
-- Wed Mar 27 10:30:40 2024
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema manageroftasks
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema manageroftasks
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `manageroftasks` DEFAULT CHARACTER SET utf8 ;
USE `manageroftasks` ;

-- -----------------------------------------------------
-- Table `manageroftasks`.`task`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `manageroftasks`.`task` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `description` VARCHAR(1000) NULL,
  `dateofcreation` DATETIME NOT NULL,
  `priority` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `manageroftasks`.`mark`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `manageroftasks`.`mark` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NULL,
  `task_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_mark_task_idx` (`task_id` ASC) VISIBLE,
  CONSTRAINT `fk_mark_task`
    FOREIGN KEY (`task_id`)
    REFERENCES `manageroftasks`.`task` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
