<template>
  <AppTable :headers="headers" :items="items" :is-loading="isLoading" :row-clickable="false">
    <template #cell-amount="{ item }">
      <span class="font-bold text-yellow-600 dark:text-yellow-400 font-mono whitespace-nowrap">
        {{ formatCurrency(item.amount) }}
      </span>
    </template>

    <template #cell-payment_method_label="{ item }">
      <span
        class="px-2 py-1 rounded-md text-xs font-medium"
        :class="
          item.payment_method === 'cash'
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
        "
      >
        <i
          :class="item.payment_method === 'cash' ? 'pi pi-money-bill' : 'pi pi-credit-card'"
          class="ml-1 text-[10px]"
        ></i>
        {{ item.payment_method_label }}
      </span>
    </template>

    <template #cell-actions="{ item }">
      <div class="flex justify-center gap-2">
        <button
          @click="$emit('delete', item.id)"
          class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
          title="حذف المصروف"
        >
          <i class="pi pi-trash"></i>
        </button>
      </div>
    </template>
  </AppTable>
</template>

<script setup>
import AppTable from '@/components/ui/AppTable.vue'

defineProps({
  items: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['delete'])

/**
 * دالة تنسيق العملة
 * تظهر 3 أرقام عشرية كحد أقصى (درهم)
 * وتخفيها تماماً إذا كان الرقم صحيحاً
 */
const formatCurrency = (value) => {
  if (!value && value !== 0) return ''

  return new Intl.NumberFormat('ar-LY', {
    style: 'currency',
    currency: 'LYD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  }).format(value)
}

// تعريف رؤوس الجدول
const headers = [
  { key: 'id', label: 'ID', class: 'w-16' },
  { key: 'amount', label: 'المبلغ' },
  { key: 'payment_method_label', label: 'طريقة الدفع' },
  { key: 'description', label: 'البيان' },
  { key: 'shift_name', label: 'الوردية' },
  { key: 'user_name', label: 'بواسطة' },
  { key: 'spent_at', label: 'التاريخ' },
  { key: 'actions', label: 'العمليات', class: 'text-center' },
]
</script>
