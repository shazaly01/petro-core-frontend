<template>
  <AppTable :headers="headers" :items="items" :is-loading="loading" :row-clickable="false">
    <template #cell-assignment_id="{ item }">
      <span class="text-text-muted text-xs">#{{ item.assignment_id }}</span>
    </template>

    <template #cell-payment_method="{ item }">
      <span
        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold"
        :class="getPaymentMethodClass(item.payment_method)"
      >
        {{ getPaymentMethodLabel(item.payment_method) }}
      </span>
    </template>

    <template #cell-amount="{ item }">
      <span class="font-mono font-bold text-gray-900 dark:text-white">
        {{ formatCurrency(item.amount) }}
      </span>
    </template>

    <template #cell-reference_number="{ item }">
      <span class="text-xs font-mono text-text-secondary">
        {{ item.reference_number || '---' }}
      </span>
    </template>

    <template #cell-actions="{ item }">
      <div class="flex items-center justify-end">
        <button
          @click="$emit('edit', item)"
          class="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
          title="تعديل المعاملة"
        >
          <PencilSquareIcon class="h-5 w-5" />
        </button>
      </div>
    </template>
  </AppTable>
</template>

<script setup>
import { computed } from 'vue'
import AppTable from '@/components/ui/AppTable.vue'
import { PencilSquareIcon } from '@heroicons/vue/24/outline'

defineProps({
  items: Array,
  loading: Boolean,
})

defineEmits(['edit'])

const headers = computed(() => [
  { key: 'id', label: 'رقم المعاملة', class: 'text-right w-24' },
  { key: 'assignment_id', label: 'التكليف', class: 'text-right' },
  { key: 'payment_method', label: 'طريقة الدفع', class: 'text-right' },
  { key: 'amount', label: 'المبلغ', class: 'text-right' },
  { key: 'reference_number', label: 'رقم المرجع/الإيصال', class: 'text-right' },
  { key: 'actions', label: '', class: 'w-16' },
])

const getPaymentMethodLabel = (method) => {
  const methods = {
    cash: 'نقداً',
    visa: 'بطاقة فيزا',
    sadad: 'سداد / بنكك',
    transfer: 'تحويل بنكي',
  }
  return methods[method] || method
}

const getPaymentMethodClass = (method) => {
  switch (method) {
    case 'cash':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    case 'visa':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    case 'sadad':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }
}

const formatCurrency = (val) =>
  new Intl.NumberFormat('ar-SD', { style: 'currency', currency: 'SDG' }).format(val || 0)
</script>
