<template>
    <div class="row g-3">
        <div class="col-md-4">
            <label class="form-label">Matéria</label>
            <input class="form-control"
                   type="text"
                   :value="modelValue.materia"
                   @input="update('materia', $event.target.value)"
                   placeholder="Ex.: Matemática" />
        </div>

        <div class="col-md-4">
            <label class="form-label">Professor</label>
            <input class="form-control"
                   type="text"
                   :value="modelValue.professor"
                   @input="update('professor', $event.target.value)"
                   placeholder="Ex.: Carlos" />
        </div>

        <div class="col-md-4">
            <label class="form-label">Ano</label>
            <input class="form-control"
                   type="number"
                   :value="modelValue.ano"
                   @input="update('ano', $event.target.value)"
                   placeholder="Ex.: 2024" />
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(["update:modelValue"]);

function update(field, value) {
  emit("update:modelValue", {
    ...props.modelValue,
    [field]: value
  });
}
</script>