const service = require("../services/provasService");

async function listar(req, res, next) {
    try {
        const { materia, professor, ano } = req.query;
        const provas = await service.listar({ materia, professor, ano });
        return res.json(provas);
    } catch (error) {
        next(error);
    }
}

async function buscarPorId(req, res, next) {
    try {
        const prova = await service.buscarPorId(req.params.id);

        if (!prova) {
            return res.status(404).json({ message: "Prova não encontrada." });
        }

        return res.json(prova);
    } catch (error) {
        next(error);
    }
}

async function criar(req, res, next) {
    try {
        const prova = await service.criar(req);
        return res.status(201).json(prova);
    } catch (error) {
        next(error);
    }
}

async function atualizar(req, res, next) {
    try {
        const prova = await service.atualizar(req.params.id, req);

        if (!prova) {
            return res.status(404).json({ message: "Prova não encontrada." });
        }

        return res.json(prova);
    } catch (error) {
        next(error);
    }
}

async function remover(req, res, next) {
    try {
        const ok = await service.remover(req.params.id);

        if (!ok) {
            return res.status(404).json({ message: "Prova não encontrada." });
        }

        return res.status(204).send();
    } catch (error) {
        next(error);
    }
}

async function baixarArquivo(req, res, next) {
    try {
        const arquivo = await service.obterArquivo(req.params.id);

        if (!arquivo) {
            return res.status(404).json({ message: "Arquivo não encontrado." });
        }

        res.setHeader("Content-Type", arquivo.tipo || "application/octet-stream");
        res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(arquivo.nome)}"`);

        return res.send(Buffer.from(arquivo.dados));
    } catch (error) {
        next(error);
    }
}

module.exports = {
    listar,
    buscarPorId,
    criar,
    atualizar,
    remover,
    baixarArquivo
};