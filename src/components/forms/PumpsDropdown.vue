<template>
  <div>
    <AppDropdown
      :id="id"
      :label="label"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :options="pumps"
      :loading="loading"
      :required="required"
      option-label="name"
      option-value="id"
      :placeholder="placeholder"
    />
    <p v-if="error" class="text-sm text-red-500 mt-1">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePumpStore } from '@/stores/pumpStore'
import { storeToRefs } from 'pinia'
import AppDropdown from '@/components/ui/AppDropdown.vue'

defineProps({
  id: { type: String, required: true },
  label: { type: String, default: 'المضخة' },
  modelValue: { type: [String, Number], default: '' },
  required: { type: Boolean, default: false },
  placeholder: { type: String, default: 'اختر المضخة...' },
})

defineEmits(['update:modelValue'])

const store = usePumpStore()
const { pumps, loading } = storeToRefs(store)
const error = ref(null)

onMounted(async () => {
  if (pumps.value.length === 0) {
    try {
      await store.fetchPumps()
    } catch (err) {
      error.value = 'فشل تحميل المضخات.'
      console.error(err)
    }
  }
})
</script>
