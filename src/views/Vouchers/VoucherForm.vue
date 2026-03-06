<template>
  <form @submit.prevent="submitForm" class="space-y-4 p-6 bg-transparent">
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-text-secondary mb-1">
        نوع السند
      </label>
      <select
        v-model="form.type"
        class="block w-full rounded-md shadow-sm transition-colors duration-200 bg-gray-50 border-2 border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-surface-ground dark:border-surface-border dark:text-text-primary dark:focus:ring-primary dark:focus:border-primary px-3 py-2"
        :class="{ 'border-red-500': store.validationErrors.type }"
      >
        <option value="deposit">إيداع نقدي (إيراد / رصيد افتتاحي)</option>
        <option value="expense">مصروف تشغيلي</option>
        <option value="withdrawal">سحب / توريد بنكي</option>
        <option value="settlement">تسوية مالية (عجز / زيادة)</option>
      </select>
      <small v-if="store.validationErrors.type" class="text-red-500 mt-1 block">
        {{ store.validationErrors.type[0] }}
      </small>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <AppNumberInput
        id="amount"
        label="المبلغ"
        type="number"
        step="0.001"
        min="0"
        v-model="form.amount"
        placeholder="0.000"
        :required="true"
        :error="store.validationErrors.amount?.[0]"
      />

      <AppInput
        id="date"
        label="تاريخ ووقت السند"
        type="datetime-local"
        v-model="form.date"
        :required="true"
        :error="store.validationErrors.date?.[0]"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-text-secondary mb-1">
        طريقة الدفع
      </label>
      <select
        v-model="form.payment_method"
        class="block w-full rounded-md shadow-sm transition-colors duration-200 bg-gray-50 border-2 border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-surface-ground dark:border-surface-border dark:text-text-primary dark:focus:ring-primary dark:focus:border-primary px-3 py-2"
        :class="{ 'border-red-500': store.validationErrors.payment_method }"
      >
        <option value="cash">نقداً (نقدية الخزينة/الوردية)</option>
        <option value="bank">مصرف / تحويل بنكي</option>
      </select>
      <small v-if="store.validationErrors.payment_method" class="text-red-500 mt-1 block">
        {{ store.validationErrors.payment_method[0] }}
      </small>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-text-secondary mb-1">
        بيان السند (الوصف)
      </label>
      <textarea
        v-model="form.description"
        rows="3"
        placeholder="مثال: سداد فاتورة كهرباء، توريد أرباح للبنك، رصيد أولي..."
        class="block w-full rounded-md shadow-sm transition-colors duration-200 bg-gray-50 border-2 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-surface-ground dark:border-surface-border dark:text-text-primary dark:placeholder:text-text-muted dark:focus:ring-primary dark:focus:border-primary"
        :class="{ 'border-red-500': store.validationErrors.description }"
      ></textarea>
      <small v-if="store.validationErrors.description" class="text-red-500 mt-1 block">
        {{ store.validationErrors.description[0] }}
      </small>
    </div>

    <div
      v-if="store.error"
      class="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md text-sm flex items-center gap-2"
    >
      <i class="pi pi-exclamation-triangle"></i>
      {{ store.error }}
    </div>

    <div
      class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-surface-border"
    >
      <AppButton type="button" variant="secondary" @click="$emit('cancel')"> إلغاء </AppButton>

      <AppButton type="submit" variant="primary" :disabled="store.loading">
        <span
          v-if="store.loading"
          class="ml-2 animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"
        ></span>
        {{ store.loading ? 'جاري الحفظ...' : 'حفظ السند' }}
      </AppButton>
    </div>
  </form>
</template>

<script setup>
import { reactive } from 'vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppNumberInput from '@/components/ui/AppNumberInput.vue'
import AppButton from '@/components/ui/AppButton.vue'

// 🛑 تم تصحيح الاستيراد واسم المتجر
import { useVoucherStore } from '@/stores/voucherStore'

const store = useVoucherStore()
const emit = defineEmits(['success', 'cancel'])

// دالة لتوليد الوقت الحالي بالتنسيق المطلوب للمدخل
const getCurrentDateTime = () => {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 16)
}

const form = reactive({
  type: 'expense', // قيمة افتراضية لتسهيل العمل
  amount: '',
  date: getCurrentDateTime(), // تم تغيير spent_at إلى date
  payment_method: 'cash',
  description: '',
})

const submitForm = async () => {
  try {
    // 🛑 تغيير الدالة المستدعاة
    await store.createVoucher({ ...form })
    // في حال النجاح
    emit('success')
  } catch (err) {
    // الأخطاء تعالج داخل المتجر وتظهر في القالب
  }
}
</script>
