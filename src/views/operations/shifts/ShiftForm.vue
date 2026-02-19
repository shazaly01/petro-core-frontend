<template>
  <form @submit.prevent="submitForm" class="space-y-4">
    <!-- ... (قسم حالة الوردية وأوقاتها لم يتغير) ... -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-text-secondary mb-1">
          حالة الوردية
        </label>
        <select
          v-model="form.status"
          class="block w-full rounded-md shadow-sm transition-colors duration-200 bg-gray-50 border-2 border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-surface-ground dark:border-surface-border dark:text-text-primary dark:focus:ring-primary dark:focus:border-primary p-2"
        >
          <option value="open">مفتوحة (Open)</option>
          <option value="closed">مغلقة (Closed)</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-text-secondary mb-1">
          وقت البداية
        </label>
        <input
          type="datetime-local"
          v-model="form.start_at"
          required
          class="block w-full rounded-md shadow-sm bg-gray-50 border-2 border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-surface-ground dark:border-surface-border dark:text-text-primary p-2"
        />
      </div>

      <div>
        <label
          class="block text-sm font-medium text-gray-700 dark:text-text-secondary mb-1"
          :class="{ 'opacity-50': form.status === 'open' }"
        >
          وقت الإغلاق
        </label>
        <input
          type="datetime-local"
          v-model="form.end_at"
          :disabled="form.status === 'open'"
          class="block w-full rounded-md shadow-sm bg-gray-50 border-2 border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-surface-ground dark:border-surface-border dark:text-text-primary p-2 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
    </div>

    <hr class="border-gray-200 dark:border-gray-700 my-2" />

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <AppInput
        id="total_expected_cash"
        label="النقد المتوقع (د.ل)"
        v-model="form.total_expected_cash"
        type="number"
        step="0.001"
        placeholder="0.000"
        dir="ltr"
      />

      <AppInput
        id="total_actual_cash"
        label="النقد الفعلي (د.ل)"
        v-model="form.total_actual_cash"
        type="number"
        step="0.001"
        placeholder="0.000"
        dir="ltr"
      />

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-text-secondary mb-1">
          الفارق (عجز / زيادة)
        </label>
        <input
          :value="formattedDifference"
          readonly
          dir="ltr"
          class="block w-full rounded-md shadow-sm bg-gray-200 border-2 border-gray-300 text-gray-700 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 p-2 font-bold text-center"
          :class="{
            'text-red-600 dark:text-red-400': calculatedDifference < 0,
            'text-green-600 dark:text-green-400': calculatedDifference > 0,
          }"
        />
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-text-secondary mb-1">
        ملاحظات التسليم / الإغلاق
      </label>
      <textarea
        v-model="form.handover_notes"
        rows="3"
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
import { reactive, watch, computed } from 'vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'

const props = defineProps({
  initialData: { type: Object, default: null },
  isSaving: { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  start_at: '',
  end_at: '',
  status: 'open',
  total_expected_cash: 0,
  total_actual_cash: 0,
  difference: 0,
  handover_notes: '',
})

const formatDateForInput = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const offset = date.getTimezoneOffset()
  const adjustedDate = new Date(date.getTime() - offset * 60 * 1000)
  return adjustedDate.toISOString().slice(0, 16)
}

// يحسب القيمة الرقمية الخام
const calculatedDifference = computed(() => {
  const expected = parseFloat(form.total_expected_cash) || 0
  const actual = parseFloat(form.total_actual_cash) || 0
  return actual - expected
})

// ينسق القيمة للعرض مع 3 خانات عشرية
const formattedDifference = computed(() => {
  return calculatedDifference.value.toLocaleString('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })
})

watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) {
      form.start_at = formatDateForInput(newVal.start_at)
      form.end_at = formatDateForInput(newVal.end_at)
      form.status = newVal.status
      form.total_expected_cash = newVal.total_expected_cash || 0
      form.total_actual_cash = newVal.total_actual_cash || 0
      form.difference = newVal.difference || 0
      form.handover_notes = newVal.handover_notes || ''
    } else {
      // عند إنشاء وردية جديدة
      const now = new Date()
      const offset = now.getTimezoneOffset()
      const adjustedNow = new Date(now.getTime() - offset * 60 * 1000)
      form.start_at = adjustedNow.toISOString().slice(0, 16)

      form.end_at = ''
      form.status = 'open'
      form.total_expected_cash = 0
      form.total_actual_cash = 0
      form.difference = 0
      form.handover_notes = ''
    }
  },
  { immediate: true },
)

const submitForm = () => {
  // إرسال القيمة الرقمية الخام
  form.difference = calculatedDifference.value
  emit('submit', { ...form })
}
</script>
