 
 BEGIN;

    CREATE TABLE sangue (
        id SERIAL PRIMARY KEY,
        tipo VARCHAR(3) UNIQUE NOT NULL CHECK (
        tipo IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
            ),
        quantidade INTEGER NOT NULL
    );

    CREATE TABLE clinica (
        id SERIAL PRIMARY KEY,
        cnpj VARCHAR(18) UNIQUE NOT NULL,
        nome VARCHAR(100) NOT NULL,
        endereco VARCHAR(150),
        telefone VARCHAR(20)
    );

    CREATE TABLE doador (
        id SERIAL PRIMARY KEY,
        cpf VARCHAR(14) UNIQUE NOT NULL,
        nome VARCHAR(100) NOT NULL,
        endereco VARCHAR(150),
        telefone VARCHAR(20),
        email VARCHAR(100)
    );

    CREATE TABLE doacao (
        id SERIAL PRIMARY KEY,
        data DATE NOT NULL,
        local VARCHAR(100) NOT NULL,
        sangue_id INTEGER NOT NULL REFERENCES sangue(id),
        doador_id INTEGER NOT NULL REFERENCES doador(id),
        UNIQUE(sangue_id, doador_id, data)
    );

    CREATE TABLE notificacao (
        id SERIAL PRIMARY KEY,
        mensagem TEXT NOT NULL,
        data_hora DATE NOT NULL DEFAULT NOW(),
        doador_id INTEGER NOT NULL REFERENCES doador(id),
        UNIQUE(doador_id, mensagem, data_hora)
    );

    CREATE TABLE beneficio (
        id SERIAL PRIMARY KEY,
        tipo VARCHAR(50) NOT NULL,
        valor NUMERIC(10, 2) NOT NULL,
        data_validade DATE NOT NULL,
        doador_id INTEGER NOT NULL REFERENCES doador(id),
        clinica_id INTEGER NOT NULL REFERENCES clinica(id),
        UNIQUE(doador_id, clinica_id, data_validade)
    );


 COMMIT;