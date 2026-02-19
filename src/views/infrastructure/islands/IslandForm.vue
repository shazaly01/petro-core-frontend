<template>
  <form @submit.prevent="submitForm" class="space-y-5">
    <AppInput
      id="code"
      label="كود الجزيرة"
      v-model="form.code"
      placeholder="مثال: ISL-01"
      :required="true"
    />

    <AppInput
      id="name"
      label="اسم الجزيرة"
      v-model="form.name"
      placeholder="مثال: الجزيرة الشرقية"
      :required="true"
    />

    <div
      class="flex items-center space-x-3 space-x-reverse bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600"
    >
      <input
        id="is_active"
        type="checkbox"
        v-model="form.is_active"
        class="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary dark:bg-gray-700 dark:border-gray-500"
      />
      <label
        for="is_active"
        class="text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer select-none"
      >
        الجزيرة نشطة (متاحة للعمل)
      </label>
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

// الحالة التفاعلية
const form = reactive({
  name: '',
  code: '',
  is_active: true, // القيمة الافتراضية
})

// مراقبة البيانات عند التعديل
watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) {
      form.name = newVal.name
      form.code = newVal.code
      // تحويل القيمة إلى boolean للتأكد (في حال جاءت 0/1 من الباك إند)
      form.is_active = Boolean(newVal.is_active)
    } else {
      // تصفير النموذج
      form.name = ''
      form.code = ''
      form.is_active = true
    }
  },
  { immediate: true },
)

const submitForm = () => {
  emit('submit', { ...form })
}
</script>
