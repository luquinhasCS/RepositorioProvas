<template>
    <div class="card-soft p-4">
        <div class="d-flex justify-content-between align-items-start mb-3">
            <div>
                <h5 class="mb-1">{{ modoEdicao ? "Editar prova" : "Cadastrar prova" }}</h5>
                <div class="small-muted">Preencha os dados e anexe o arquivo da prova.</div>
            </div>
        </div>

        <form @submit.prevent="submit">
            <div class="row g-3">
                <div class="col-md-4">
                    <label class="form-label">Matéria</label>
                    <input v-model="form.materia" class="form-control" required />
                </div>

                <div class="col-md-4">
                    <label class="form-label">Professor</label>
                    <input v-model="form.professor" class="form-control" required />
                </div>

                <div class="col-md-2">
                    <label class="form-label">Ano</label>
                    <input v-model="form.ano" type="number" class="form-control" required />
                </div>

                <div class="col-md-2">
                    <label class="form-label">Arquivo</label>
                    <input class="form-control" type="file" @change="onFileChange" :required="!modoEdicao" />
                </div>
            </div>

            <div class="d-flex gap-2 mt-4">
                <button type="submit" class="btn btn-primary" :disabled="loading">
                    {{ loading ? "Salvando..." : "Salvar" }}
                </button>

                <button type="button" class="btn btn-outline-secondary" @click="$emit('limpar')">
                    Limpar
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { reactive } from "vue";

const props = defineProps({
  modoEdicao: Boolean,
  loading: Boolean,
  provaEditando: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(["salvar", "limpar"]);

const form = reactive({
  materia: "",
  professor: "",
  ano: new Date().getFullYear(),
  arquivo: null
});

function preencherComProva(prova) {
  if (!prova) return;
  form.materia = prova.materia;
  form.professor = prova.professor;
  form.ano = prova.ano;
  form.arquivo = null;
}

function limpar() {
  form.materia = "";
  form.professor = "";
  form.ano = new Date().getFullYear();
  form.arquivo = null;
}

function onFileChange(event) {
  form.arquivo = event.target.files?.[0] || null;
}

function submit() {
  emit("salvar", { ...form });
}

defineExpose({ preencherComProva, limpar });
</script>