<template>
  <div v-if="aberto" class="modal-backdrop-custom">
    <div class="card-soft p-4 modal-box">
      <h5 class="mb-2">{{ titulo }}</h5>
      <p class="small-muted mb-4">{{ mensagem }}</p>

      <div class="d-flex justify-content-end gap-2">
        <button class="btn btn-outline-secondary" @click="$emit('cancelar')">
          Cancelar
        </button>
        <button class="btn btn-danger" @click="$emit('confirmar')">
          Excluir
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  aberto: Boolean,
  titulo: {
    type: String,
    default: "Confirmar ação"
  },
  mensagem: {
    type: String,
    default: "Deseja continuar?"
  }
});

defineEmits(["confirmar", "cancelar"]);
</script>

<style scoped>
.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 1050;
}

.modal-box {
  width: 100%;
  max-width: 420px;
}
</style>