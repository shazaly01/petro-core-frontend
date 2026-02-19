<template>
  <form @submit.prevent="submitForm" class="space-y-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <PumpsDropdown
        id="pump_id"
        label="المضخة التابعة لها"
        v-model="form.pump_id"
        :required="true"
        placeholder="اختر المضخة..."
      />

      <TanksDropdown
        id="tank_id"
        label="الخزان المسحوب منه"
        v-model="form.tank_id"
        :required="true"
        placeholder="اختر الخزان..."
      />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <AppInput
        id="code"
        label="رقم/كود المسدس"
        v-model="form.code"
        placeholder="مثال: N1-P1"
        :required="true"
      />

      <AppInput
        id="current_counter"
        label="قراءة العداد الحالية"
        v-model="form.current_counter"
        type="number"
        step="0.01"
        placeholder="0.00"
        :required="true"
      />
    </div>

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
        المسدس نشط (متاح للعمل)
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
import PumpsDropdown from '@/components/forms/PumpsDropdown.vue'
import TanksDropdown from '@/components/forms/TanksDropdown.vue'

const props = defineProps({
  initialData: { type: Object, default: null },
  isSaving: { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  pump_id: '',
  tank_id: '',
  code: '',
  current_counter: '',
  is_active: true,
})

watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) {
      form.pump_id = newVal.pump_id
      form.tank_id = newVal.tank_id
      form.code = newVal.code
      form.current_counter = newVal.current_counter
      form.is_active = Boolean(newVal.is_active)
    } else {
      // Reset
      form.pump_id = ''
      form.tank_id = ''
      form.code = ''
      form.current_counter = ''
      form.is_active = true
    }
  },
  { immediate: true },
)

const submitForm = () => {
  emit('submit', { ...form })
}
</script>
