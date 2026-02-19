<template>
  <form @submit.prevent="submitForm" class="space-y-4">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <AppInput
        id="shift_id"
        label="رقم الوردية"
        v-model="form.shift_id"
        placeholder="Shift ID"
        :required="true"
      />

      <AppInput
        id="user_id"
        label="معرف العامل"
        v-model="form.user_id"
        placeholder="User ID"
        :required="true"
      />

      <div class="sm:col-span-1">
        <NozzlesDropdown
          id="nozzle_id"
          label="المسدس المستخدم"
          v-model="form.nozzle_id"
          :required="true"
          placeholder="اختر المسدس..."
        />
      </div>
    </div>

    <hr class="border-gray-200 dark:border-gray-700 my-2" />

    <h4 class="text-sm font-bold text-gray-900 dark:text-white">بيانات بداية التكليف</h4>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-text-secondary mb-1">
          وقت البدء
        </label>
        <input
          type="datetime-local"
          v-model="form.start_at"
          required
          class="block w-full rounded-md shadow-sm bg-gray-50 border-2 border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-surface-ground dark:border-surface-border dark:text-text-primary p-2"
        />
      </div>

      <AppInput
        id="start_counter"
        label="عداد البداية"
        v-model="form.start_counter"
        type="number"
        step="0.01"
        placeholder="0.00"
        :required="true"
      />
    </div>

    <div>
      <AppInput
        id="unit_price"
        label="سعر اللتر (عند البدء)"
        v-model="form.unit_price"
        type="number"
        step="0.01"
        placeholder="0.00"
        :required="true"
      />
    </div>

    <hr class="border-gray-200 dark:border-gray-700 my-2" />

    <h4 class="text-sm font-bold text-gray-900 dark:text-white">بيانات الإغلاق والحسابات</h4>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-text-secondary mb-1">
          وقت الانتهاء
        </label>
        <input
          type="datetime-local"
          v-model="form.end_at"
          class="block w-full rounded-md shadow-sm bg-gray-50 border-2 border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-surface-ground dark:border-surface-border dark:text-text-primary p-2"
        />
      </div>

      <AppInput
        id="end_counter"
        label="عداد النهاية"
        v-model="form.end_counter"
        type="number"
        step="0.01"
        placeholder="0.00"
      />
    </div>

    <div
      class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800"
    >
      <div>
        <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
          >الكمية المباعة (لتر)</label
        >
        <input
          :value="calculatedSoldLiters"
          readonly
          class="block w-full bg-transparent border-none text-lg font-bold text-gray-900 dark:text-white focus:ring-0 p-0"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
          >إجمالي المبلغ</label
        >
        <input
          :value="calculatedTotalAmount"
          readonly
          class="block w-full bg-transparent border-none text-lg font-bold text-primary focus:ring-0 p-0"
        />
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-text-secondary mb-1">
        حالة التكليف
      </label>
      <select
        v-model="form.status"
        class="block w-full rounded-md shadow-sm bg-gray-50 border-2 border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-surface-ground dark:border-surface-border dark:text-text-primary p-2"
      >
        <option value="active">نشط (جاري العمل)</option>
        <option value="completed">مكتمل</option>
      </select>
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
import NozzlesDropdown from '@/components/forms/NozzlesDropdown.vue'

const props = defineProps({
  initialData: { type: Object, default: null },
  isSaving: { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  shift_id: '',
  user_id: '',
  nozzle_id: '',
  start_at: '',
  end_at: '',
  start_counter: '',
  end_counter: '',
  sold_liters: 0,
  unit_price: '',
  total_amount: 0,
  status: 'active',
})

// تحويل التاريخ للصيغة المناسبة للحقول
const formatDateForInput = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const offset = date.getTimezoneOffset()
  const adjustedDate = new Date(date.getTime() - offset * 60 * 1000)
  return adjustedDate.toISOString().slice(0, 16)
}

// حساب الكمية المباعة تلقائياً
const calculatedSoldLiters = computed(() => {
  const start = parseFloat(form.start_counter) || 0
  const end = parseFloat(form.end_counter) || 0
  if (end > start) {
    return (end - start).toFixed(2)
  }
  return '0.00'
})

// حساب المبلغ الإجمالي تلقائياً
const calculatedTotalAmount = computed(() => {
  const liters = parseFloat(calculatedSoldLiters.value) || 0
  const price = parseFloat(form.unit_price) || 0
  return (liters * price).toFixed(2)
})

watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) {
      form.shift_id = newVal.shift_id
      form.user_id = newVal.user_id
      form.nozzle_id = newVal.nozzle_id
      form.start_at = formatDateForInput(newVal.start_at)
      form.end_at = formatDateForInput(newVal.end_at)
      form.start_counter = newVal.start_counter
      form.end_counter = newVal.end_counter
      form.sold_liters = newVal.sold_liters
      form.unit_price = newVal.unit_price
      form.total_amount = newVal.total_amount
      form.status = newVal.status
    } else {
      // القيم الافتراضية
      form.shift_id = ''
      form.user_id = ''
      form.nozzle_id = ''
      form.start_at = new Date().toISOString().slice(0, 16)
      form.end_at = ''
      form.start_counter = ''
      form.end_counter = ''
      form.sold_liters = 0
      form.unit_price = ''
      form.total_amount = 0
      form.status = 'active'
    }
  },
  { immediate: true },
)

const submitForm = () => {
  // تحديث القيم المحسوبة قبل الإرسال
  form.sold_liters = calculatedSoldLiters.value
  form.total_amount = calculatedTotalAmount.value
  emit('submit', { ...form })
}
</script>
