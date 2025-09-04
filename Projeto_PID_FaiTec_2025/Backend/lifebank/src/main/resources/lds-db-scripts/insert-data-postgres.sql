CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO municipality (name, state) VALUES
('São Paulo', 'SP'),
('Campinas', 'SP'),
('Rio de Janeiro', 'RJ');

INSERT INTO donation_location (name, street, number, neighborhood, postal_code, municipality_id)
VALUES
('Hemocentro Campinas', 'Rua das Doações', '123', 'Centro', '13000-100', 2);

INSERT INTO user_model (name, role, cpf, email, phone, password, street, number, neighborhood, postal_code, donation_location_id)
VALUES
('João Admin', 'ADMINISTRATOR', '00000000000', 'admin@example.com', '(11) 99999-0000', 'aa', 'Av. Central', '100', 'Centro', '01000-000', 1);

INSERT INTO user_model (name, role, cpf, email, phone, password, street, number, neighborhood, postal_code, donation_location_id)
VALUES
('Maria Doadora', 'USER', '11111111111', 'maria@example.com', '(11) 98888-1111', 'aa', 'Rua das Flores', '200', 'Jardim', '13000-000', NULL);

INSERT INTO user_model (name, role, cpf, email, phone, password, street, number, neighborhood, postal_code, donation_location_id)
VALUES
('Carlos Clínica', 'CLINIC', '22222222222', 'clinica@example.com', '(21) 97777-2222', 'aa', 'Rua da Saúde', '300', 'Boa Vista', '20000-000', NULL);

INSERT INTO donor (blood_type, eligible, user_id)
VALUES ('O+', TRUE, 2);

INSERT INTO clinic (name, cnpj, street, number, neighborhood, postal_code, municipality_id)
VALUES
('Clínica Vida', '12345678000199', 'Av. Saúde', '400', 'Centro', '20010-000', 3);

INSERT INTO blood (blood_type, quantity, expiration_date)
VALUES
('O+', 5.00, CURRENT_DATE + INTERVAL '30 days'),
('A+', 3.50, CURRENT_DATE + INTERVAL '25 days');

INSERT INTO blood_stock (blood_type, minimum_stock, maximum_stock, current_stock, donation_location)
VALUES
('O+', 2.00, 10.00, 5.00, 1),
('A+', 2.00, 10.00, 3.50, 1);

INSERT INTO donation (quantity, collection_date, expiration_date, donor_id, donation_location_id, blood_id)
VALUES
(0.45, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 1, 1, 1);

INSERT INTO benefit (amount, expiration_date, description, clinic_id, donation_id)
VALUES
(100.00, CURRENT_DATE + INTERVAL '60 days', 'Desconto em exames', 1, 1);

INSERT INTO notification (message, donor_id)
VALUES
('Obrigado por sua doação! Seu sangue pode salvar vidas.', 1);