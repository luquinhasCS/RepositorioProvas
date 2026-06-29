const pool = require("../config/database");

async function listar({ materia, professor, ano }) {

    let query = `
        SELECT
            id,
            materia,
            professor,
            ano,
            arquivo_nome,
            arquivo_tipo,
            data_criacao,
            data_atualizacao
        FROM provas
        WHERE 1=1
    `;

    const parametros = [];
    let indice = 1;

    if (materia) {
        query += ` AND materia ILIKE $${indice++}`;
        parametros.push(`%${materia}%`);
    }

    if (professor) {
        query += ` AND professor ILIKE $${indice++}`;
        parametros.push(`%${professor}%`);
    }

    if (ano) {
        query += ` AND ano = $${indice++}`;
        parametros.push(Number(ano));
    }

    query += `
        ORDER BY
            ano DESC,
            materia ASC,
            professor ASC
    `;

    const { rows } = await pool.query(query, parametros);

    return rows;
}

async function buscarPorId(id) {

    const { rows } = await pool.query(
        `
        SELECT
            id,
            materia,
            professor,
            ano,
            arquivo_nome,
            arquivo_tipo,
            arquivo_dados,
            data_criacao,
            data_atualizacao
        FROM provas
        WHERE id = $1
        `,
        [id]
    );

    return rows[0] || null;
}

async function criar({
    materia,
    professor,
    ano,
    arquivoNome,
    arquivoTipo,
    arquivoDados
}) {

    const { rows } = await pool.query(
        `
        INSERT INTO provas
        (
            materia,
            professor,
            ano,
            arquivo_nome,
            arquivo_tipo,
            arquivo_dados
        )
        VALUES
        (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6
        )
        RETURNING
            id,
            materia,
            professor,
            ano,
            arquivo_nome,
            arquivo_tipo,
            data_criacao,
            data_atualizacao
        `,
        [
            materia,
            professor,
            Number(ano),
            arquivoNome,
            arquivoTipo,
            arquivoDados
        ]
    );

    return rows[0];
}

async function atualizar(
    id,
    {
        materia,
        professor,
        ano,
        arquivoNome,
        arquivoTipo,
        arquivoDados
    }
) {

    const parametros = [
        materia,
        professor,
        Number(ano)
    ];

    let indice = 4;

    let query = `
        UPDATE provas
        SET
            materia = $1,
            professor = $2,
            ano = $3,
            data_atualizacao = NOW()
    `;

    if (arquivoDados) {

        query += `
            ,
            arquivo_nome = $${indice++},
            arquivo_tipo = $${indice++},
            arquivo_dados = $${indice++}
        `;

        parametros.push(
            arquivoNome,
            arquivoTipo,
            arquivoDados
        );
    }

    parametros.push(id);

    query += `
        WHERE id = $${indice}

        RETURNING
            id,
            materia,
            professor,
            ano,
            arquivo_nome,
            arquivo_tipo,
            data_criacao,
            data_atualizacao
    `;

    const { rows } = await pool.query(query, parametros);

    return rows[0] || null;
}

async function remover(id) {

    const { rowCount } = await pool.query(
        `
        DELETE FROM provas
        WHERE id = $1
        `,
        [id]
    );

    return rowCount > 0;
}

module.exports = {
    listar,
    buscarPorId,
    criar,
    atualizar,
    remover
};