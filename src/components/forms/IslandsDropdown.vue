<template>
  <div>
    <AppDropdown
      :id="id"
      :label="label"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :options="islands"
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
import { useIslandStore } from '@/stores/islandStore'
import { storeToRefs } from 'pinia'
import AppDropdown from '@/components/ui/AppDropdown.vue'

defineProps({
  id: { type: String, required: true },
  label: { type: String, default: 'الجزيرة' },
  modelValue: { type: [String, Number], default: '' },
  required: { type: Boolean, default: false },
  placeholder: { type: String, default: 'اختر الجزيرة...' },
})

defineEmits(['update:modelValue'])

const store = useIslandStore()
const { islands, loading } = storeToRefs(store)
const error = ref(null)

onMounted(async () => {
  if (islands.value.length === 0) {
    try {
      await store.fetchIslands()
    } catch (err) {
      error.value = 'فشل تحميل الجزر.'
      console.error(err)
    }
  }
})
</script>
