<template>
  <form @submit.prevent="submitForm" class="space-y-4">
    <AppInput
      id="assignment_id"
      label="رقم التكليف المرتبط"
      v-model="form.assignment_id"
      placeholder="Assignment ID"
      :required="true"
    />

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <AppInput
        id="amount"
        label="المبلغ"
        v-model="form.amount"
        type="number"
        step="0.01"
        placeholder="0.00"
        :required="true"
      />

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-text-secondary mb-1">
          طريقة الدفع
        </label>
        <select
          v-model="form.payment_method"
          required
          class="block w-full rounded-md shadow-sm transition-colors duration-200 bg-gray-50 border-2 border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-surface-ground dark:border-surface-border dark:text-text-primary dark:focus:ring-primary dark:focus:border-primary p-2"
        >
          <option value="" disabled>اختر الطريقة...</option>
          <option value="cash">نقداً (Cash)</option>
          <option value="visa">فيزا / ماستر كارد</option>
          <option value="sadad">سداد / بنكك</option>
          <option value="transfer">تحويل بنكي</option>
        </select>
      </div>
    </div>

    <div v-if="form.payment_method !== 'cash'">
      <AppInput
        id="reference_number"
        label="رقم الإيصال / المرجع"
        v-model="form.reference_number"
        placeholder="مثال: TRX-998877"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-text-secondary mb-1">
        بيان / ملاحظات
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
        {{ isSaving ? 'جاري الحفظ...' : 'حفظ المعاملة' }}
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

const form = reactive({
  assignment_id: '',
  amount: '',
  payment_method: 'cash', // القيمة الافتراضية
  reference_number: '',
  notes: '',
})

watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) {
      form.assignment_id = newVal.assignment_id
      form.amount = newVal.amount
      form.payment_method = newVal.payment_method
      form.reference_number = newVal.reference_number
      form.notes = newVal.notes
    } else {
      // القيم الافتراضية
      form.assignment_id = ''
      form.amount = ''
      form.payment_method = 'cash'
      form.reference_number = ''
      form.notes = ''
    }
  },
  { immediate: true },
)

const submitForm = () => {
  emit('submit', { ...form })
}
</script>
