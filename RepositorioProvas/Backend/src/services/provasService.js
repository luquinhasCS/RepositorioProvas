const repository = require("../repositories/provasRepository");

function validarCamposBase({ materia, professor, ano }) {
    if (!materia || !materia.trim()) {
        throw new Error("Matéria é obrigatória.");
    }

    if (!professor || !professor.trim()) {
        throw new Error("Professor é obrigatório.");
    }

    if (!ano || Number.isNaN(Number(ano))) {
        throw new Error("Ano é obrigatório e deve ser numérico.");
    }
}

function validarArquivo(file, obrigatorio = true) {
    if (!file && obrigatorio) {
        throw new Error("Arquivo é obrigatório.");
    }

    if (!file) return;

    const nome = file.originalname || "";
    const mimetype = file.mimetype || "";

    if (!nome) {
        throw new Error("Nome do arquivo inválido.");
    }

    if (!mimetype) {
        throw new Error("Tipo do arquivo inválido.");
    }
}

function montarPayload(req) {
    const body = req.body || {};
    const file = req.file || null;

    return {
        materia: body.Materia || body.materia || "",
        professor: body.Professor || body.professor || "",
        ano: body.Ano || body.ano || "",
        file
    };
}

function toDto(item) {
    if (!item) return null;

    return {
        id: item.id,
        materia: item.materia,
        professor: item.professor,
        ano: item.ano,
        arquivoNome: item.arquivo_nome,
        arquivoTipo: item.arquivo_tipo,
        dataCriacao: item.data_criacao,
        dataAtualizacao: item.data_atualizacao,
        arquivoUrl: `/api/provas/${item.id}/arquivo`
    };
}

async function listar(filtros) {
    const itens = await repository.listar(filtros);
    return itens.map(toDto);
}

async function buscarPorId(id) {
    const item = await repository.buscarPorId(id);

    if (!item) {
        return null;
    }

    return toDto(item);
}

async function criar(req) {
    const { materia, professor, ano, file } = montarPayload(req);

    validarCamposBase({ materia, professor, ano });
    validarArquivo(file, true);

    const criado = await repository.criar({
        materia: materia.trim(),
        professor: professor.trim(),
        ano: Number(ano),
        arquivoNome: file.originalname,
        arquivoTipo: file.mimetype,
        arquivoDados: file.buffer
    });

    return toDto(criado);
}

async function atualizar(id, req) {
    const { materia, professor, ano, file } = montarPayload(req);

    validarCamposBase({ materia, professor, ano });
    validarArquivo(file, false);

    const atualizado = await repository.atualizar(id, {
        materia: materia.trim(),
        professor: professor.trim(),
        ano: Number(ano),
        arquivoNome: file ? file.originalname : null,
        arquivoTipo: file ? file.mimetype : null,
        arquivoDados: file ? file.buffer : null
    });

    return toDto(atualizado);
}

async function remover(id) {
    return repository.remover(id);
}

async function obterArquivo(id) {
    const item = await repository.buscarPorId(id);

    if (!item) {
        return null;
    }

    return {
        nome: item.arquivo_nome,
        tipo: item.arquivo_tipo,
        dados: item.arquivo_dados
    };
}

module.exports = {
    listar,
    buscarPorId,
    criar,
    atualizar,
    remover,
    obterArquivo
};