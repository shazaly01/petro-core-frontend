<template>
  <div>
    <AppDropdown
      :id="id"
      :label="label"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :options="workers"
      :loading="loading"
      :required="required"
      option-label="full_name"
      option-value="id"
      :placeholder="placeholder"
    />
    <p v-if="error" class="text-sm text-red-500 mt-1">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'
import AppDropdown from '@/components/ui/AppDropdown.vue'

defineProps({
  id: { type: String, required: true },
  label: { type: String, default: 'العامل' },
  modelValue: { type: [String, Number], default: '' },
  required: { type: Boolean, default: false },
  placeholder: { type: String, default: 'اختر العامل المسؤول...' },
})

defineEmits(['update:modelValue'])

const store = useUserStore()
const { workers, loading } = storeToRefs(store)
const error = ref(null)

onMounted(async () => {
  // نقوم بجلب العمال فقط إذا كانت القائمة فارغة في المتجر
  if (workers.value.length === 0) {
    try {
      await store.fetchWorkers()
    } catch (err) {
      error.value = 'فشل تحميل قائمة العمال.'
      console.error(err)
    }
  }
})
</script>
