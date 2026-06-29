<template>
    <div class="card-soft p-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
                <h5 class="mb-1">Provas cadastradas</h5>
                <div class="small-muted">{{ provas.length }} registro(s)</div>
            </div>
        </div>

        <div v-if="loading">
            <Loading />
        </div>

        <div v-else class="table-responsive">
            <table class="table table-hover align-middle mb-0">
                <thead>
                    <tr>
                        <th>Matéria</th>
                        <th>Professor</th>
                        <th>Ano</th>
                        <th>Arquivo</th>
                        <th style="width: 160px;">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="!provas.length">
                        <td colspan="5" class="text-center py-4 small-muted">
                            Nenhuma prova encontrada.
                        </td>
                    </tr>

                    <tr v-for="item in provas" :key="item.id">
                        <td>{{ item.materia }}</td>
                        <td>{{ item.professor }}</td>
                        <td>{{ item.ano }}</td>
                        <td>
                            <a :href="getArquivoUrl(item.id)" target="_blank" rel="noreferrer">
                                {{ item.arquivoNome }}
                            </a>
                        </td>
                        <td>
                            <div class="d-flex gap-2">
                                <button class="btn btn-sm btn-outline-primary" @click="$emit('editar', item)">
                                    Editar
                                </button>
                                <button class="btn btn-sm btn-outline-danger" @click="$emit('excluir', item)">
                                    Excluir
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import Loading from "./Loading.vue";
import { getArquivoUrl } from "../services/provasService";

defineProps({
  provas: {
    type: Array,
    default: () => []
  },
  loading: Boolean
});

defineEmits(["editar", "excluir"]);
</script>