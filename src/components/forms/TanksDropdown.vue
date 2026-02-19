<template>
  <div>
    <AppDropdown
      :id="id"
      :label="label"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :options="tanks"
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
import { useTankStore } from '@/stores/tankStore'
import { storeToRefs } from 'pinia'
import AppDropdown from '@/components/ui/AppDropdown.vue'

defineProps({
  id: { type: String, required: true },
  label: { type: String, default: 'الخزان' },
  modelValue: { type: [String, Number], default: '' },
  required: { type: Boolean, default: false },
  placeholder: { type: String, default: 'اختر الخزان...' },
})

defineEmits(['update:modelValue'])

const store = useTankStore()
const { tanks, loading } = storeToRefs(store)
const error = ref(null)

onMounted(async () => {
  if (tanks.value.length === 0) {
    try {
      await store.fetchTanks()
    } catch (err) {
      error.value = 'فشل تحميل الخزانات.'
      console.error(err)
    }
  }
})
</script>
