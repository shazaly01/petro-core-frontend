<template>
  <form @submit.prevent="submitForm" class="space-y-5">
    <AppInput
      id="name"
      label="اسم نوع الوقود"
      v-model="form.name"
      placeholder="مثال: بنزين 91"
      :required="true"
    />

    <AppInput
      id="price"
      label="السعر الحالي (للتر)"
      v-model="form.current_price"
      type="number"
      step="0.01"
      placeholder="0.00"
      :required="true"
    />

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-text-secondary mb-1">
        ملاحظات / وصف
      </label>
      <textarea
        v-model="form.description"
        rows="3"
        class="block w-full rounded-md shadow-sm transition-colors duration-200 bg-gray-50 border-2 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-surface-ground dark:border-surface-border dark:text-text-primary dark:placeholder:text-text-muted dark:focus:ring-primary dark:focus:border-primary"
        placeholder="أي تفاصيل إضافية..."
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
        {{ isSaving ? 'جاري الحفظ...' : 'حفظ البيانات' }}
      </AppButton>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch } from 'vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'

const props = defineProps({
  initialData: { type: Object, default: null },
  isSaving: { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'cancel'])

// الحالة التفاعلية للنموذج
const form = reactive({
  name: '',
  current_price: '',
  description: '',
})

// مراقبة البيانات الأولية (للتعديل)
watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) {
      // وضع التعديل: تعبئة البيانات
      form.name = newVal.name
      form.current_price = newVal.current_price
      form.description = newVal.description
    } else {
      // وضع الإضافة: تصفير الحقول
      form.name = ''
      form.current_price = ''
      form.description = ''
    }
  },
  { immediate: true },
)

const submitForm = () => {
  // إرسال نسخة من البيانات لفك الارتباط التفاعلي
  emit('submit', { ...form })
}
</script>
