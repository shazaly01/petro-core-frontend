<template>
  <div>
    <AppDropdown
      :id="id"
      :label="label"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :options="fuelTypes"
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
import { useFuelTypeStore } from '@/stores/fuelTypeStore'
import { storeToRefs } from 'pinia'
import AppDropdown from '@/components/ui/AppDropdown.vue' // تأكد من المسار الصحيح لمكونك

defineProps({
  id: { type: String, required: true },
  label: { type: String, default: 'نوع الوقود' },
  modelValue: { type: [String, Number], default: '' },
  required: { type: Boolean, default: false },
  placeholder: { type: String, default: 'اختر نوع الوقود...' },
})

defineEmits(['update:modelValue'])

const store = useFuelTypeStore()
const { fuelTypes, loading } = storeToRefs(store)
const error = ref(null)

onMounted(async () => {
  if (fuelTypes.value.length === 0) {
    try {
      await store.fetchFuelTypes(1, '') // جلب الكل (أو الصفحة الأولى)
    } catch (err) {
      error.value = 'فشل تحميل أنواع الوقود.'
      console.error(err)
    }
  }
})
</script>
