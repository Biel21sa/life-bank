DROP TABLE IF EXISTS notification;
DROP TABLE IF EXISTS benefit;
DROP TABLE IF EXISTS donation;
DROP TABLE IF EXISTS blood_stock;
DROP TABLE IF EXISTS blood;
DROP TABLE IF EXISTS clinic;
DROP TABLE IF EXISTS donor;
DROP TABLE IF EXISTS user_model;
DROP TABLE IF EXISTS donation_location;
DROP TABLE IF EXISTS municipality;

CREATE TABLE municipality (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    state CHAR(2) NOT NULL,
    UNIQUE(name, state)
);

CREATE TABLE donation_location (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    street VARCHAR(100) NOT NULL,
    number VARCHAR(10) NOT NULL,
    neighborhood VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    municipality_id INTEGER NOT NULL REFERENCES municipality(id)
);

CREATE TABLE user_model (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (
        role IN ('ADMINISTRATOR', 'USER', 'CLINIC', 'SYSTEM')
    ),
    cpf VARCHAR(14) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(100) NOT NULL,
    street VARCHAR(100) NOT NULL,
    number VARCHAR(10) NOT NULL,
    neighborhood VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    donation_location_id INTEGER REFERENCES donation_location(id)
);

CREATE TABLE donor (
    id SERIAL PRIMARY KEY,
    blood_type VARCHAR(3) NOT NULL CHECK (
        blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
    ),
    eligible BOOLEAN NOT NULL DEFAULT TRUE,
    user_id INTEGER NOT NULL REFERENCES user_model(id),
    UNIQUE(user_id)
);

CREATE TABLE clinic (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    cnpj CHAR(14) NOT NULL UNIQUE,
    street VARCHAR(100) NOT NULL,
    number VARCHAR(10) NOT NULL,
    neighborhood VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    municipality_id INTEGER NOT NULL REFERENCES municipality(id)
);

CREATE TABLE blood (
    id SERIAL PRIMARY KEY,
    blood_type VARCHAR(3) UNIQUE NOT NULL CHECK (
        blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
    ),
    quantity DECIMAL(10,2) NOT NULL,
    expiration_date DATE NOT NULL
);

CREATE TABLE blood_stock (
    id SERIAL PRIMARY KEY,
    blood_type VARCHAR(3) NOT NULL CHECK (
        blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
    ),
    minimum_stock DECIMAL(10,2) NOT NULL,
    maximum_stock DECIMAL(10,2) NOT NULL,
    current_stock DECIMAL(10,2) NOT NULL DEFAULT 0,
    donation_location INTEGER NOT NULL REFERENCES donation_location(id),
    UNIQUE(blood_type, donation_location)
);

CREATE TABLE donation (
    id SERIAL PRIMARY KEY,
    quantity DECIMAL(10,2) NOT NULL,
    collection_date DATE NOT NULL DEFAULT NOW(),
    expiration_date DATE NOT NULL,
    donor_id INTEGER NOT NULL REFERENCES donor(id),
    donation_location_id INTEGER NOT NULL REFERENCES donation_location(id),
    blood_id INTEGER NOT NULL REFERENCES blood(id),
    UNIQUE(donor_id, collection_date)
);

CREATE TABLE benefit (
    id SERIAL PRIMARY KEY,
    amount DECIMAL(10,2) NOT NULL,
    expiration_date DATE NOT NULL,
    description TEXT NOT NULL,
    clinic_id INTEGER NOT NULL REFERENCES clinic(id),
    donation_id INTEGER NOT NULL UNIQUE REFERENCES donation(id)
);

CREATE TABLE notification (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    timestamp DATE NOT NULL DEFAULT NOW(),
    donor_id INTEGER NOT NULL REFERENCES donor(id),
    UNIQUE(donor_id, timestamp)
);