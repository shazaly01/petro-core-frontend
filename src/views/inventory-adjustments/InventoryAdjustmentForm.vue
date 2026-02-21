<template>
  <form @submit.prevent="submitForm" class="space-y-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <TanksDropdown
        id="tank_id"
        label="الخزان المراد جرده"
        v-model="form.tank_id"
        :required="true"
        placeholder="اختر الخزان..."
        :disabled="isEditMode"
      />
      <AppNumberInput
        id="actual_stock"
        label="الرصيد الفعلي (قراءة المسطرة باللتر)"
        type="number"
        step="0.01"
        min="0"
        v-model="form.actual_stock"
        placeholder="مثال: 15000"
        :required="true"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-text-secondary mb-1">
        سبب التسوية الجردية (اختياري)
      </label>
      <textarea
        v-model="form.reason"
        rows="3"
        placeholder="مثال: تبخر طبيعي، تسريب، خطأ في القراءة السابقة..."
        class="block w-full rounded-md shadow-sm transition-colors duration-200 bg-gray-50 border-2 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-surface-ground dark:border-surface-border dark:text-text-primary dark:placeholder:text-text-muted dark:focus:ring-primary dark:focus:border-primary"
      ></textarea>
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
        {{ isSaving ? 'جاري الحفظ...' : 'حفظ الجرد الفعلي' }}
      </AppButton>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch, computed } from 'vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppNumberInput from '@/components/ui/AppNumberInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import TanksDropdown from '@/components/forms/TanksDropdown.vue'

const props = defineProps({
  initialData: { type: Object, default: null },
  isSaving: { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  tank_id: '',
  actual_stock: '',
  reason: '',
})

// نتحقق مما إذا كان النموذج في حالة "تعديل" لمنع تغيير الخزان
const isEditMode = computed(() => !!props.initialData?.id)

watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) {
      form.tank_id = newVal.tank_id ? Number(newVal.tank_id) : ''
      form.actual_stock = newVal.actual_stock !== undefined ? Number(newVal.actual_stock) : ''
      form.reason = newVal.reason || ''
    } else {
      // تصفير النموذج في حالة الإضافة الجديدة
      form.tank_id = ''
      form.actual_stock = ''
      form.reason = ''
    }
  },
  { immediate: true },
)

const submitForm = () => {
  // إرسال نسخة من البيانات لتجنب التعديل المباشر
  emit('submit', { ...form })
}
</script>
