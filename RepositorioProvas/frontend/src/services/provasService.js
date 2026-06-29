import api from "./api";

export async function listarProvas(filtros = {}) {
    const params = {};

    if (filtros.materia) params.materia = filtros.materia;
    if (filtros.professor) params.professor = filtros.professor;
    if (filtros.ano) params.ano = filtros.ano;

    const { data } = await api.get("/api/provas", { params });
    return data;
}

export async function criarProva(formData) {
    const { data } = await api.post("/api/provas", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
}

export async function atualizarProva(id, formData) {
    const { data } = await api.put(`/api/provas/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
}

export async function excluirProva(id) {
    await api.delete(`/api/provas/${id}`);
}

export function getArquivoUrl(id) {
    return `${api.defaults.baseURL}/api/provas/${id}/arquivo`;
}