<template>
    <div class="container py-4 py-md-5">
        <div class="mb-4">
            <h1 class="page-title mb-2">Repositório de Provas</h1>
            <p class="small-muted mb-0">
                Sistema simples para cadastrar, consultar, editar e excluir provas antigas.
            </p>
        </div>

        <div v-if="mensagem" class="alert" :class="tipoMensagemClass">
            {{ mensagem }}
        </div>

        <div class="card-soft p-4 mb-4">
            <h5 class="mb-3">Filtros</h5>
            <FilterBar v-model="filtros" />
            <div class="d-flex gap-2 mt-3">
                <button class="btn btn-primary" @click="carregarProvas">Pesquisar</button>
                <button class="btn btn-outline-secondary" @click="limparFiltros">Limpar filtros</button>
            </div>
        </div>

        <div class="mb-4">
            <ProvaForm ref="formRef"
                       :modo-edicao="!!idEditando"
                       :loading="salvando"
                       @salvar="salvarProva"
                       @limpar="limparFormulario" />
        </div>

        <ProvaTable :provas="provas"
                    :loading="carregando"
                    @editar="prepararEdicao"
                    @excluir="abrirConfirmacao" />

        <ModalConfirm :aberto="confirmacaoAberta"
                      titulo="Excluir prova"
                      :mensagem="`Deseja excluir a prova '${provaParaExcluir?.materia || ''}'?`"
                      @cancelar="confirmacaoAberta = false"
                      @confirmar="confirmarExclusao" />
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import FilterBar from "../components/FilterBar.vue";
import ProvaForm from "../components/ProvaForm.vue";
import ProvaTable from "../components/ProvaTable.vue";
import ModalConfirm from "../components/ModalConfirm.vue";
import {
  listarProvas,
  criarProva,
  atualizarProva,
  excluirProva
} from "../services/provasService";

const provas = ref([]);
const carregando = ref(false);
const salvando = ref(false);
const mensagem = ref("");
const tipoMensagem = ref("success");

const idEditando = ref(null);
const provaParaExcluir = ref(null);
const confirmacaoAberta = ref(false);

const filtros = ref({
  materia: "",
  professor: "",
  ano: ""
});

const formRef = ref(null);

const tipoMensagemClass = computed(() => {
  return tipoMensagem.value === "success" ? "alert-success" : "alert-danger";
});

function mostrarMensagem(texto, tipo = "success") {
  mensagem.value = texto;
  tipoMensagem.value = tipo;
  setTimeout(() => {
    mensagem.value = "";
  }, 3000);
}

async function carregarProvas() {
  carregando.value = true;

  try {
    provas.value = await listarProvas(filtros.value);
  } catch (error) {
    mostrarMensagem(error.response?.data?.message || "Erro ao carregar provas.", "danger");
  } finally {
    carregando.value = false;
  }
}

function limparFiltros() {
  filtros.value = {
    materia: "",
    professor: "",
    ano: ""
  };
  carregarProvas();
}

function limparFormulario() {
  idEditando.value = null;
  if (formRef.value) {
    formRef.value.limpar();
  }
}

function prepararEdicao(prova) {
  idEditando.value = prova.id;
  if (formRef.value) {
    formRef.value.preencherComProva(prova);
  }
  mostrarMensagem(`Editando a prova ID ${prova.id}.`, "success");
}

async function salvarProva(form) {
  salvando.value = true;

  try {
    const formData = new FormData();
    formData.append("Materia", form.materia);
    formData.append("Professor", form.professor);
    formData.append("Ano", form.ano);

    if (form.arquivo) {
      formData.append("Arquivo", form.arquivo);
    }

    if (idEditando.value) {
      await atualizarProva(idEditando.value, formData);
      mostrarMensagem("Prova atualizada com sucesso.");
    } else {
      await criarProva(formData);
      mostrarMensagem("Prova cadastrada com sucesso.");
    }

    limparFormulario();
    await carregarProvas();
  } catch (error) {
    mostrarMensagem(error.response?.data?.message || "Erro ao salvar prova.", "danger");
  } finally {
    salvando.value = false;
  }
}

function abrirConfirmacao(prova) {
  provaParaExcluir.value = prova;
  confirmacaoAberta.value = true;
}

async function confirmarExclusao() {
  if (!provaParaExcluir.value) return;

  try {
    await excluirProva(provaParaExcluir.value.id);
    mostrarMensagem("Prova excluída com sucesso.");
    confirmacaoAberta.value = false;
    provaParaExcluir.value = null;
    await carregarProvas();
  } catch (error) {
    mostrarMensagem(error.response?.data?.message || "Erro ao excluir prova.", "danger");
  }
}

onMounted(() => {
  carregarProvas();
});
</script>