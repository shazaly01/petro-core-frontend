<template>
  <AppTable :headers="headers" :items="items" :is-loading="isLoading" :row-clickable="false">
    <template #cell-voucher_no="{ item }">
      <span class="font-mono text-gray-600 dark:text-gray-400 text-sm">
        #{{ item.voucher_no }}
      </span>
    </template>

    <template #cell-type_ar="{ item }">
      <span class="px-2 py-1 rounded-md text-xs font-medium" :class="getTypeBadgeClass(item.type)">
        {{ item.type_ar }}
      </span>
    </template>

    <template #cell-amount="{ item }">
      <span
        class="font-bold font-mono whitespace-nowrap"
        :class="
          item.type === 'deposit'
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400'
        "
      >
        {{ item.type === 'deposit' ? '+' : '-' }} {{ formatCurrency(item.amount) }}
      </span>
    </template>

    <template #cell-payment_method_ar="{ item }">
      <span
        class="px-2 py-1 rounded-md text-xs font-medium"
        :class="
          item.payment_method === 'cash'
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
        "
      >
        <i
          :class="item.payment_method === 'cash' ? 'pi pi-money-bill' : 'pi pi-credit-card'"
          class="ml-1 text-[10px]"
        ></i>
        {{ item.payment_method_ar }}
      </span>
    </template>

    <template #cell-shift="{ item }">
      <span class="text-sm">
        {{ item.shift ? item.shift.name : '---' }}
      </span>
    </template>

    <template #cell-user="{ item }">
      <span class="text-sm">
        {{ item.user ? item.user.name : '---' }}
      </span>
    </template>

    <template #cell-actions="{ item }">
      <div class="flex justify-center gap-2">
        <button
          @click="$emit('delete', item.id)"
          class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
          title="حذف السند وإلغاء تأثيره"
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

/**
 * دالة لتحديد لون شارة نوع السند
 */
const getTypeBadgeClass = (type) => {
  switch (type) {
    case 'deposit':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    case 'expense':
      return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
    case 'withdrawal':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    case 'settlement':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  }
}

// تعريف رؤوس الجدول متطابقة مع مخرجات VoucherResource
const headers = [
  { key: 'voucher_no', label: 'رقم السند' },
  { key: 'type_ar', label: 'نوع الحركة' },
  { key: 'amount', label: 'المبلغ' },
  { key: 'payment_method_ar', label: 'الدفع' },
  { key: 'description', label: 'البيان' },
  { key: 'shift', label: 'الوردية' },
  { key: 'user', label: 'بواسطة' },
  { key: 'date', label: 'التاريخ' },
  { key: 'actions', label: 'العمليات', class: 'text-center' },
]
</script>
