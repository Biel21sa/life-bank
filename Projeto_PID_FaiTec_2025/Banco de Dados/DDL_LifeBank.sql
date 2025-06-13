 
 BEGIN;

    CREATE TABLE municipio (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        uf CHAR(2) NOT NULL,
        UNIQUE(nome, uf)
    );

    CREATE TABLE usuario (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        cpf VARCHAR(14) NOT NULL UNIQUE,
        tipo VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        telefone VARCHAR(20) NOT NULL,
        senha VARCHAR(100) NOT NULL,
        logradouro VARCHAR(100) NOT NULL,
        numero VARCHAR(10) NOT NULL,
        bairro VARCHAR(100) NOT NULL,
        cep VARCHAR(10) NOT NULL,
        municipio_id INTEGER NOT NULL REFERENCES municipio(id)
    );

    CREATE TABLE doador (
        id SERIAL PRIMARY KEY,
        tipo_sanguineo VARCHAR(3) NOT NULL CHECK (
        tipo_sanguineo IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
        ),
        apto BOOLEAN NOT NULL DEFAULT TRUE,
        usuario_id INTEGER NOT NULL REFERENCES usuario(id),
        UNIQUE(usuario_id)
    );

    CREATE TABLE clinica (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        cnpj CHAR(14) NOT NULL UNIQUE,
        logradouro VARCHAR(100) NOT NULL,
        numero VARCHAR(10) NOT NULL,
        bairro VARCHAR(100) NOT NULL,
        cep VARCHAR(10) NOT NULL,
        municipio_id INTEGER NOT NULL REFERENCES municipio(id)
    );

    CREATE TABLE funcionario (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER NOT NULL REFERENCES usuario(id),
        clinica_id INTEGER NOT NULL REFERENCES clinica(id),
        UNIQUE(usuario_id)
    );

    CREATE TABLE sangue (
        id SERIAL PRIMARY KEY,
        tipo VARCHAR(3) UNIQUE NOT NULL CHECK (
        tipo IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
        ),
        estoque DECIMAL(10,2) NOT NULL,
        nivel_minimo DECIMAL(10,2) NOT NULL,
        nivel_maximo DECIMAL(10,2) NOT NULL
    );

    CREATE TABLE local_doacao (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL UNIQUE,
        logradouro VARCHAR(100) NOT NULL,
        numero VARCHAR(10) NOT NULL,
        bairro VARCHAR(100) NOT NULL,
        cep VARCHAR(10) NOT NULL,
        municipio_id INTEGER NOT NULL REFERENCES municipio(id)
    );

    CREATE TABLE doacao (
        id SERIAL PRIMARY KEY,
        quantidade DECIMAL(10,2) NOT NULL,
        data_coleta DATE NOT NULL DEFAULT NOW(),
        data_validade DATE NOT NULL,
        doador_id INTEGER NOT NULL REFERENCES doador(id),
        local_doacao_id INTEGER NOT NULL REFERENCES local_doacao(id),
        sangue_id INTEGER NOT NULL REFERENCES sangue(id),
        UNIQUE(doador_id, data_coleta)
    );

    CREATE TABLE beneficio (
        id SERIAL PRIMARY KEY,
        valor DECIMAL(10,2) NOT NULL,
        validade DATE NOT NULL,
        descricao TEXT NOT NULL,
        clinica_id INTEGER NOT NULL REFERENCES clinica(id),
        doacao_id INTEGER NOT NULL UNIQUE REFERENCES doacao(id)
    );

    CREATE TABLE notificacao (
        id SERIAL PRIMARY KEY,
        mensagem TEXT NOT NULL,
        data_hora DATE NOT NULL DEFAULT NOW(),
        doador_id INTEGER NOT NULL REFERENCES doador(id),
        UNIQUE(doador_id, data_hora)
    );

 COMMIT;