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
('João Admin', 'ADMINISTRATOR', '00000000000', 'admin@example.com', '(11) 99999-0000', crypt(crypt('aa', gen_salt('bf')), gen_salt('bf')), 'Av. Central', '100', 'Centro', '01000-000', 1);

INSERT INTO user_model (name, role, cpf, email, phone, password, street, number, neighborhood, postal_code, donation_location_id)
VALUES
('Maria Doadora', 'USER', '11111111111', 'maria@example.com', '(11) 98888-1111', crypt(crypt('aa', gen_salt('bf')), gen_salt('bf')), 'Rua das Flores', '200', 'Jardim', '13000-000', NULL);

INSERT INTO user_model (name, role, cpf, email, phone, password, street, number, neighborhood, postal_code, donation_location_id)
VALUES
('Carlos Clínica', 'CLINIC', '22222222222', 'clinica@example.com', '(21) 97777-2222', crypt(crypt('aa', gen_salt('bf')), gen_salt('bf')), 'Rua da Saúde', '300', 'Boa Vista', '20000-000', NULL);

INSERT INTO user_model (name, role, cpf, email, phone, password, street, number, neighborhood, postal_code, donation_location_id)
VALUES
('Gabriel System', 'SYSTEM', '33333333333', 'system@example.com', '(21) 98888-4444', crypt('aa', gen_salt('bf')), 'Rua da Paz', '150', 'Estrela', '15264-111', NULL);

INSERT INTO donor (blood_type, last_donation_date, gender, user_id)
VALUES ('O+', CURRENT_DATE, 'FEMININO', 2);

INSERT INTO clinic (name, cnpj, street, number, neighborhood, postal_code, municipality_id, user_id)
VALUES
('Clínica Vida', '12345678000199', 'Av. Saúde', '400', 'Centro', '20010-000', 3, 3);

INSERT INTO blood (blood_type, quantity, expiration_date, used, donor_id, donation_location_id)
VALUES
('O+', 0.45, CURRENT_DATE + INTERVAL '30 days', FALSE, 1, 1);

INSERT INTO blood_stock (blood_type, minimum_stock, maximum_stock, current_stock, donation_location_id)
VALUES
('O+', 2.00, 10.00, 0.45, 1),
('A+', 2.00, 10.00, 0.00, 1),
('O-', 2.00, 10.00, 0.00, 1),
('A-', 2.00, 10.00, 0.00, 1),
('B+', 2.00, 10.00, 0.00, 1),
('AB+', 2.00, 10.00, 0.00, 1),
('AB-', 2.00, 10.00, 0.00, 1),
('B-', 2.00, 10.00, 0.00, 1);


INSERT INTO donation (quantity, collection_date, expiration_date, donor_id, donation_location_id, blood_id)
VALUES
(0.45, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 1, 1, 1);

INSERT INTO benefit (amount, expiration_date, description, used, donor_id, donation_id)
VALUES
(30.00, CURRENT_DATE + INTERVAL '60 days', 'Desconto em exames', FALSE, 1, 1);

INSERT INTO notification (message, donor_id)
VALUES
('Obrigado por sua doação! Seu sangue pode salvar vidas.', 1);

INSERT INTO user_model (name, role, cpf, email, phone, password, street, number, neighborhood, postal_code, donation_location_id) VALUES
('Ana Souza', 'USER', '44444444444', 'ana@example.com', '(11) 98888-0001', crypt('aa', gen_salt('bf')), 'Rua Bela', '101', 'Centro', '13001-000', NULL),
('Lucas Lima', 'USER', '55555555555', 'lucas@example.com', '(11) 98888-0002', crypt('aa', gen_salt('bf')), 'Av. Brasil', '102', 'Jardins', '13002-000', NULL),
('Fernanda Rocha', 'USER', '66666666666', 'fernanda@example.com', '(11) 98888-0003', crypt('aa', gen_salt('bf')), 'Rua das Árvores', '103', 'Planalto', '13003-000', NULL),
('Tiago Pereira', 'USER', '77777777777', 'tiago@example.com', '(11) 98888-0004', crypt('aa', gen_salt('bf')), 'Rua Nova', '104', 'Centro', '13004-000', NULL);

INSERT INTO donor (blood_type, last_donation_date, gender, user_id) VALUES
('A+', '2025-03-15', 'FEMININO', 5),
('B+', '2025-06-10', 'MASCULINO', 6),
('AB-', '2025-04-20', 'FEMININO', 7),
('O-', '2025-08-05', 'MASCULINO', 8);

INSERT INTO blood (blood_type, quantity, expiration_date, used, donor_id, donation_location_id) VALUES
('A+', 0.45, '2025-04-14', FALSE, 2, 1),
('B+', 0.45, '2025-07-10', FALSE, 3, 1),
('AB-', 0.45, '2025-05-20', FALSE, 4, 1),
('O-', 0.45, '2025-09-04', FALSE, 5, 1);

UPDATE blood_stock SET current_stock = current_stock + 0.45 WHERE blood_type = 'A+' AND donation_location_id = 1;
UPDATE blood_stock SET current_stock = current_stock + 0.45 WHERE blood_type = 'B+' AND donation_location_id = 1;
UPDATE blood_stock SET current_stock = current_stock + 0.45 WHERE blood_type = 'AB-' AND donation_location_id = 1;
UPDATE blood_stock SET current_stock = current_stock + 0.45 WHERE blood_type = 'O-' AND donation_location_id = 1;

INSERT INTO donation (quantity, collection_date, expiration_date, donor_id, donation_location_id, blood_id) VALUES
(0.45, '2025-03-15', '2025-04-14', 2, 1, 2),
(0.45, '2025-06-10', '2025-07-10', 3, 1, 3),
(0.45, '2025-04-20', '2025-05-20', 4, 1, 4),
(0.45, '2025-08-05', '2025-09-04', 5, 1, 5);

INSERT INTO benefit (amount, expiration_date, description, used, donor_id, donation_id) VALUES
(30.00, '2025-05-15', 'Desconto em farmácias conveniadas', FALSE, 2, 2),
(30.00, '2025-08-10', 'Desconto em exames', FALSE, 3, 3),
(20.00, '2025-06-20', 'Desconto em exames laboratoriais', FALSE, 4, 4),
(30.00, '2025-10-05', 'Desconto em exames', FALSE, 5, 5);

INSERT INTO notification (message, donor_id) VALUES
('Obrigado por doar, Ana! Sua contribuição salva vidas.', 2),
('Lucas, sua doação foi registrada com sucesso. Muito obrigado!', 3),
('Fernanda, agradecemos imensamente sua doação.', 4),
('Tiago, seu gesto é nobre. Obrigado por doar sangue.', 5);

INSERT INTO user_model (name, role, cpf, email, phone, password, street, number, neighborhood, postal_code, donation_location_id) VALUES
('Juliana Alves', 'USER', '88888888888', 'juliana@example.com', '(11) 98888-0005', crypt('aa', gen_salt('bf')), 'Rua Nova Esperança', '105', 'Jardim Esperança', '13005-000', NULL),
('Rafael Costa', 'USER', '99999999999', 'rafael@example.com', '(11) 98888-0006', crypt('aa', gen_salt('bf')), 'Av. das Américas', '106', 'América', '13006-000', NULL),
('Paulo Henrique', 'USER', '10101010101', 'paulo@example.com', '(11) 98888-0007', crypt('aa', gen_salt('bf')), 'Rua Central', '107', 'Centro', '13007-000', NULL);

INSERT INTO donor (blood_type, last_donation_date, gender, user_id) VALUES
('A-', '2025-01-10', 'FEMININO', 9),
('B-', '2025-02-12', 'MASCULINO', 10),
('AB+', '2025-01-25', 'MASCULINO', 11);

INSERT INTO blood (blood_type, quantity, expiration_date, used, donor_id, donation_location_id) VALUES
('A-', 0.45, '2025-02-09', FALSE, 6, 1),
('O+', 0.45, '2025-02-09', FALSE, 1, 1),
('B+', 0.45, '2025-02-09', FALSE, 3, 1);

UPDATE blood_stock SET current_stock = current_stock + 0.45 WHERE blood_type = 'A-' AND donation_location_id = 1;
UPDATE blood_stock SET current_stock = current_stock + 0.45 WHERE blood_type = 'O+' AND donation_location_id = 1;
UPDATE blood_stock SET current_stock = current_stock + 0.45 WHERE blood_type = 'B+' AND donation_location_id = 1;

INSERT INTO donation (quantity, collection_date, expiration_date, donor_id, donation_location_id, blood_id) VALUES
(0.45, '2025-01-10', '2025-02-09', 6, 1, 6),
(0.45, '2025-01-15', '2025-02-09', 1, 1, 7),
(0.45, '2025-01-20', '2025-02-09', 3, 1, 8);

INSERT INTO blood (blood_type, quantity, expiration_date, used, donor_id, donation_location_id) VALUES
('B-', 0.45, '2025-03-12', FALSE, 7, 1),
('AB+', 0.45, '2025-03-20', FALSE, 8, 1),
('A+', 0.45, '2025-03-18', FALSE, 2, 1);

UPDATE blood_stock SET current_stock = current_stock + 0.45 WHERE blood_type = 'B-' AND donation_location_id = 1;
UPDATE blood_stock SET current_stock = current_stock + 0.45 WHERE blood_type = 'AB+' AND donation_location_id = 1;
UPDATE blood_stock SET current_stock = current_stock + 0.45 WHERE blood_type = 'A+' AND donation_location_id = 1;

INSERT INTO donation (quantity, collection_date, expiration_date, donor_id, donation_location_id, blood_id) VALUES
(0.45, '2025-02-12', '2025-03-12', 7, 1, 9),
(0.45, '2025-02-20', '2025-03-20', 8, 1, 10),
(0.45, '2025-02-18', '2025-03-18', 2, 1, 11);

INSERT INTO blood (blood_type, quantity, expiration_date, used, donor_id, donation_location_id) VALUES
('O-', 0.45, '2025-04-25', FALSE, 5, 1),
('A-', 0.45, '2025-04-28', FALSE, 6, 1);

UPDATE blood_stock SET current_stock = current_stock + 0.45 WHERE blood_type = 'O-' AND donation_location_id = 1;
UPDATE blood_stock SET current_stock = current_stock + 0.45 WHERE blood_type = 'A-' AND donation_location_id = 1;

INSERT INTO donation (quantity, collection_date, expiration_date, donor_id, donation_location_id, blood_id) VALUES
(0.45, '2025-03-25', '2025-04-25', 5, 1, 12),
(0.45, '2025-03-28', '2025-04-28', 6, 1, 13);


INSERT INTO blood (blood_type, quantity, expiration_date, used, donor_id, donation_location_id) VALUES
('O+', 0.45, '2025-05-15', FALSE, 1, 1),
('A+', 0.45, '2025-05-20', FALSE, 2, 1);

UPDATE blood_stock SET current_stock = current_stock + 0.45 WHERE blood_type = 'O+' AND donation_location_id = 1;
UPDATE blood_stock SET current_stock = current_stock + 0.45 WHERE blood_type = 'A+' AND donation_location_id = 1;

INSERT INTO donation (quantity, collection_date, expiration_date, donor_id, donation_location_id, blood_id) VALUES
(0.45, '2025-04-15', '2025-05-15', 1, 1, 14),
(0.45, '2025-04-20', '2025-05-20', 2, 1, 15);
