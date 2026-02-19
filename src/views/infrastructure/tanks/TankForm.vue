<template>
  <form @submit.prevent="submitForm" class="space-y-4">
    <FuelTypesDropdown
      id="fuel_type_id"
      label="نوع الوقود المخزن"
      v-model="form.fuel_type_id"
      :required="true"
      placeholder="اختر نوع الوقود..."
    />

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <AppInput
        id="code"
        label="رقم/كود الخزان"
        v-model="form.code"
        placeholder="مثال: T-01"
        :required="true"
      />

      <AppInput
        id="name"
        label="اسم الخزان"
        v-model="form.name"
        placeholder="مثال: خزان البنزين الرئيسي"
        :required="true"
      />
    </div>

    <QuantityInput
      id="capacity"
      label="السعة الكلية (لتر)"
      v-model="form.capacity"
      placeholder="أدخل سعة الخزان"
    />

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <AppInput
        id="current_stock"
        label="المخزون الحالي (لتر)"
        v-model="form.current_stock"
        type="number"
        step="0.01"
        placeholder="0.00"
        :required="true"
      />

      <AppInput
        id="alert_threshold"
        label="حد التنبيه (Low Stock Alert)"
        v-model="form.alert_threshold"
        type="number"
        step="0.01"
        placeholder="مثال: 5000"
      />
    </div>

    <div
      class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-surface-border"
    >
      <AppButton type="button" variant="secondary" @click="$emit('cancel')"> إلغاء </AppButton>

      <AppButton type="submit" variant="primary" :disabled="isSaving">
        <span
          v-if="isSaving"
          class="ml-2 animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"
        ></span>
        {{ isSaving ? 'جاري الحفظ...' : 'حفظ البيانات' }}
      </AppButton>
    </div>
  </form>
</template>
<script setup>
import { reactive, watch } from 'vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import QuantityInput from '@/components/ui/QuantityInput.vue'
import FuelTypesDropdown from '@/components/forms/FuelTypesDropdown.vue'

const props = defineProps({
  initialData: { type: Object, default: null },
  isSaving: { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  fuel_type_id: '',
  name: '',
  code: '',
  capacity: '',
  current_stock: '',
  alert_threshold: '',
})

watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) {
      // التعديل هنا: جلب الـ ID سواء كان مباشراً أو داخل كائن fuel_type
      const typeId = newVal.fuel_type_id || newVal.fuel_type?.id

      form.fuel_type_id = typeId ? Number(typeId) : ''
      form.name = newVal.name || ''
      form.code = newVal.code || ''
      form.capacity = newVal.capacity || ''
      form.current_stock = newVal.current_stock || ''
      form.alert_threshold = newVal.alert_threshold || ''
    } else {
      // تصفير النموذج
      form.fuel_type_id = ''
      form.name = ''
      form.code = ''
      form.capacity = ''
      form.current_stock = ''
      form.alert_threshold = ''
    }
  },
  { immediate: true },
)

const submitForm = () => {
  emit('submit', { ...form })
}
</script>
