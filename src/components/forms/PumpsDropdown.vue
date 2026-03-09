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

// 🛑 التعديل: تعريف الـ props في متغير للوصول إليها داخل onMounted
const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, default: 'المضخة' },
  modelValue: { type: [String, Number], default: '' },
  required: { type: Boolean, default: false },
  placeholder: { type: String, default: 'اختر المضخة...' },
  onlyAvailable: { type: Boolean, default: false }, // 🛑 التعديل: إضافة الفلتر كخاصية
})

defineEmits(['update:modelValue'])

const store = usePumpStore()
const { pumps, loading } = storeToRefs(store)
const error = ref(null)

onMounted(async () => {
  // نجلب البيانات دائماً إذا كان المكون يطلب "المتاحة فقط" لضمان تحديث القائمة،
  // أو إذا كانت القائمة فارغة
  if (pumps.value.length === 0 || props.onlyAvailable) {
    try {
      // 🛑 التعديل: إرسال (1) إذا كانت onlyAvailable تساوي true
      await store.fetchPumps(1, '', props.onlyAvailable ? 1 : null)
    } catch (err) {
      error.value = 'فشل تحميل المضخات.'
      console.error(err)
    }
  }
})
</script>
