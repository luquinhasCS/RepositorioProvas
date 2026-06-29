CREATE TABLE provas
(
    id SERIAL PRIMARY KEY,

    materia VARCHAR(120) NOT NULL,

    professor VARCHAR(120) NOT NULL,

    ano INTEGER NOT NULL,

    arquivo_nome VARCHAR(260) NOT NULL,

    arquivo_tipo VARCHAR(100) NOT NULL,

    arquivo_dados BYTEA NOT NULL,

    data_criacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    data_atualizacao TIMESTAMP NULL
);