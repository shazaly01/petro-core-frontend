<template>
  <AppTable :headers="headers" :items="items" :is-loading="loading" :row-clickable="false">
    <template #cell-tank="{ item }">
      <div class="flex flex-col">
        <span class="font-bold text-gray-900 dark:text-white">{{ item.tank?.name }}</span>
        <span class="text-xs text-primary">{{ item.tank?.fuel_type?.name }}</span>
      </div>
    </template>

    <template #cell-quantity="{ item }">
      <span class="font-mono font-bold text-green-600 dark:text-green-400">
        +{{ formatNumber(item.quantity) }} لتر
      </span>
    </template>

    <template #cell-invoice_info="{ item }">
      <div class="flex flex-col">
        <span class="text-sm font-medium">رقم: {{ item.invoice_number }}</span>
        <span class="text-xs text-text-muted">بسعر: {{ formatCurrency(item.cost_price) }}</span>
      </div>
    </template>

    <template #cell-truck="{ item }">
      <div class="text-xs text-text-secondary">
        <div>{{ item.driver_name || '---' }}</div>
        <div class="font-mono">{{ item.truck_plate_number || '---' }}</div>
      </div>
    </template>

    <template #cell-actions="{ item }">
      <div class="flex items-center justify-end">
        <button
          @click="$emit('edit', item)"
          class="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
          title="تعديل بيانات التوريد"
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
  { key: 'created_at', label: 'تاريخ التوريد', class: 'text-right w-40' },
  { key: 'tank', label: 'الخزان المستلم', class: 'text-right' },
  { key: 'quantity', label: 'الكمية المضافة', class: 'text-right' },
  { key: 'invoice_info', label: 'بيانات الفاتورة', class: 'text-right' },
  { key: 'truck', label: 'الشاحنة / السائق', class: 'text-right' },
  { key: 'actions', label: '', class: 'w-16' },
])

const formatNumber = (val) => new Intl.NumberFormat('ar-EG').format(val || 0)
const formatCurrency = (val) =>
  new Intl.NumberFormat('ar-SD', { style: 'currency', currency: 'SDG' }).format(val || 0)
</script>
