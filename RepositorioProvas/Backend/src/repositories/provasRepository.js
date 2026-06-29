const { sql, getPool } = require("../config/database");

async function listar({ materia, professor, ano }) {
    const pool = await getPool();

    let query = `
    SELECT 
      Id, Materia, Professor, Ano, ArquivoNome, ArquivoTipo, DataCriacao, DataAtualizacao
    FROM Provas
    WHERE 1=1
  `;

    const request = pool.request();

    if (materia) {
        query += " AND Materia LIKE @Materia";
        request.input("Materia", sql.NVarChar, `%${materia}%`);
    }

    if (professor) {
        query += " AND Professor LIKE @Professor";
        request.input("Professor", sql.NVarChar, `%${professor}%`);
    }

    if (ano) {
        query += " AND Ano = @Ano";
        request.input("Ano", sql.Int, Number(ano));
    }

    query += " ORDER BY Ano DESC, Materia ASC, Professor ASC";

    const result = await request.query(query);
    return result.recordset;
}

async function buscarPorId(id) {
    const pool = await getPool();

    const result = await pool
        .request()
        .input("Id", sql.Int, Number(id))
        .query(`
      SELECT 
        Id, Materia, Professor, Ano, ArquivoNome, ArquivoTipo, ArquivoDados,
        DataCriacao, DataAtualizacao
      FROM Provas
      WHERE Id = @Id
    `);

    return result.recordset[0] || null;
}

async function criar({ materia, professor, ano, arquivoNome, arquivoTipo, arquivoDados }) {
    const pool = await getPool();

    const result = await pool
        .request()
        .input("Materia", sql.NVarChar, materia)
        .input("Professor", sql.NVarChar, professor)
        .input("Ano", sql.Int, Number(ano))
        .input("ArquivoNome", sql.NVarChar, arquivoNome)
        .input("ArquivoTipo", sql.NVarChar, arquivoTipo)
        .input("ArquivoDados", sql.VarBinary(sql.MAX), arquivoDados)
        .query(`
      INSERT INTO Provas (Materia, Professor, Ano, ArquivoNome, ArquivoTipo, ArquivoDados)
      OUTPUT INSERTED.Id, INSERTED.Materia, INSERTED.Professor, INSERTED.Ano, INSERTED.ArquivoNome, INSERTED.ArquivoTipo, INSERTED.DataCriacao, INSERTED.DataAtualizacao
      VALUES (@Materia, @Professor, @Ano, @ArquivoNome, @ArquivoTipo, @ArquivoDados)
    `);

    return result.recordset[0];
}

async function atualizar(id, { materia, professor, ano, arquivoNome, arquivoTipo, arquivoDados }) {
    const pool = await getPool();

    const request = pool
        .request()
        .input("Id", sql.Int, Number(id))
        .input("Materia", sql.NVarChar, materia)
        .input("Professor", sql.NVarChar, professor)
        .input("Ano", sql.Int, Number(ano));

    let query = `
    UPDATE Provas
    SET 
      Materia = @Materia,
      Professor = @Professor,
      Ano = @Ano,
      DataAtualizacao = SYSDATETIME()
  `;

    if (arquivoDados && arquivoNome && arquivoTipo) {
        query += `,
      ArquivoNome = @ArquivoNome,
      ArquivoTipo = @ArquivoTipo,
      ArquivoDados = @ArquivoDados
    `;

        request
            .input("ArquivoNome", sql.NVarChar, arquivoNome)
            .input("ArquivoTipo", sql.NVarChar, arquivoTipo)
            .input("ArquivoDados", sql.VarBinary(sql.MAX), arquivoDados);
    }

    query += `
    OUTPUT INSERTED.Id, INSERTED.Materia, INSERTED.Professor, INSERTED.Ano, INSERTED.ArquivoNome, INSERTED.ArquivoTipo, INSERTED.DataCriacao, INSERTED.DataAtualizacao
    WHERE Id = @Id
  `;

    const result = await request.query(query);
    return result.recordset[0] || null;
}

async function remover(id) {
    const pool = await getPool();

    const result = await pool
        .request()
        .input("Id", sql.Int, Number(id))
        .query(`
      DELETE FROM Provas
      OUTPUT DELETED.Id
      WHERE Id = @Id
    `);

    return result.recordset.length > 0;
}

module.exports = {
    listar,
    buscarPorId,
    criar,
    atualizar,
    remover
};