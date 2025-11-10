
-- MySQL Database for Election System

CREATE DATABASE IF NOT EXISTS election_system;
USE election_system;

CREATE TABLE locations (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    location_name VARCHAR(100) NOT NULL,
    region_type ENUM('district','zone','ward','state') NOT NULL DEFAULT 'zone',
    population INT DEFAULT NULL,
    officer_id INT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE election_officers (
    officer_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    contact VARCHAR(15),
    location_id INT,
    status ENUM('active','inactive') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (location_id) REFERENCES locations(location_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE voters (
    voter_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT,
    gender ENUM('M','F','O'),
    id_card VARCHAR(50) UNIQUE,
    location_id INT,
    verified_by INT,
    verification_status ENUM('pending','approved','rejected') DEFAULT 'pending',
    login_username VARCHAR(50) UNIQUE,
    login_password VARCHAR(100),
    has_voted BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (location_id) REFERENCES locations(location_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES election_officers(officer_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE elections (
    election_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status ENUM('upcoming','ongoing','completed') DEFAULT 'upcoming',
    location_id INT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (location_id) REFERENCES locations(location_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE candidates (
    candidate_id INT AUTO_INCREMENT PRIMARY KEY,
    election_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    party VARCHAR(100),
    location_id INT,
    total_votes INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (election_id) REFERENCES elections(election_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (location_id) REFERENCES locations(location_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE votes (
    vote_id INT AUTO_INCREMENT PRIMARY KEY,
    election_id INT NOT NULL,
    voter_id INT NOT NULL UNIQUE,
    candidate_id INT NOT NULL,
    location_id INT,
    vote_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (election_id) REFERENCES elections(election_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (voter_id) REFERENCES voters(voter_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (candidate_id) REFERENCES candidates(candidate_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (location_id) REFERENCES locations(location_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB;
