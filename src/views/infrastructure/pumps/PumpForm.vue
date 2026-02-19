<template>
  <form @submit.prevent="submitForm" class="space-y-4">
    <IslandsDropdown
      id="island_id"
      label="الجزيرة التابعة لها"
      v-model="form.island_id"
      :required="true"
      placeholder="اختر الجزيرة..."
    />

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <AppInput
        id="code"
        label="رقم/كود المضخة"
        v-model="form.code"
        placeholder="مثال: P-01"
        :required="true"
      />

      <AppInput
        id="name"
        label="اسم المضخة"
        v-model="form.name"
        placeholder="مثال: مضخة البنزين الرئيسية"
        :required="true"
      />
    </div>

    <AppInput
      id="model"
      label="موديل المضخة / الشركة المصنعة"
      v-model="form.model"
      placeholder="مثال: Tokheim, Gilbarco"
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
        المضخة نشطة (تعمل حالياً)
      </label>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-text-secondary mb-1">
        ملاحظات إضافية
      </label>
      <textarea
        v-model="form.notes"
        rows="2"
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
        {{ isSaving ? 'جاري الحفظ...' : 'حفظ البيانات' }}
      </AppButton>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch } from 'vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import IslandsDropdown from '@/components/forms/IslandsDropdown.vue'

const props = defineProps({
  initialData: { type: Object, default: null },
  isSaving: { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  island_id: '',
  name: '',
  code: '',
  model: '',
  is_active: true,
  notes: '',
})

watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) {
      form.island_id = newVal.island_id
      form.name = newVal.name
      form.code = newVal.code
      form.model = newVal.model
      form.is_active = Boolean(newVal.is_active)
      form.notes = newVal.notes
    } else {
      // Reset
      form.island_id = ''
      form.name = ''
      form.code = ''
      form.model = ''
      form.is_active = true
      form.notes = ''
    }
  },
  { immediate: true },
)

const submitForm = () => {
  emit('submit', { ...form })
}
</script>
