<template>
  <div>
    <AppDropdown
      :id="id"
      :label="label"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :options="nozzles"
      :loading="loading"
      :required="required"
      option-label="code"
      option-value="id"
      :placeholder="placeholder"
    />
    <p v-if="error" class="text-sm text-red-500 mt-1">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNozzleStore } from '@/stores/nozzleStore'
import { storeToRefs } from 'pinia'
import AppDropdown from '@/components/ui/AppDropdown.vue'

defineProps({
  id: { type: String, required: true },
  label: { type: String, default: 'المسدس' },
  modelValue: { type: [String, Number], default: '' },
  required: { type: Boolean, default: false },
  placeholder: { type: String, default: 'اختر المسدس...' },
})

defineEmits(['update:modelValue'])

const store = useNozzleStore()
const { nozzles, loading } = storeToRefs(store)
const error = ref(null)

onMounted(async () => {
  if (nozzles.value.length === 0) {
    try {
      await store.fetchNozzles()
    } catch (err) {
      error.value = 'فشل تحميل المسدسات.'
      console.error(err)
    }
  }
})
</script>
