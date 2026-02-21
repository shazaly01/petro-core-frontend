<template>
  <AppTable :headers="headers" :items="items" :is-loading="loading" :row-clickable="false">
    <template #cell-created_at="{ item }">
      <div class="flex flex-col">
        <span class="font-medium text-gray-900 dark:text-gray-100">{{
          item.created_at_human
        }}</span>
        <span class="text-xs text-gray-500 dark:text-gray-400" dir="ltr">{{
          item.created_at
        }}</span>
      </div>
    </template>

    <template #cell-tank_name="{ item }">
      <div class="flex flex-col">
        <span class="font-bold text-gray-800 dark:text-gray-200">{{ item.tank_name }}</span>
        <span class="text-xs text-blue-600 dark:text-blue-400">{{ item.fuel_type }}</span>
      </div>
    </template>

    <template #cell-system_stock="{ item }">
      <span class="text-gray-600 dark:text-gray-300 font-medium" dir="ltr">
        {{ formatNumber(item.system_stock) }} L
      </span>
    </template>

    <template #cell-actual_stock="{ item }">
      <span class="font-black text-gray-900 dark:text-white" dir="ltr">
        {{ formatNumber(item.actual_stock) }} L
      </span>
    </template>

    <template #cell-difference="{ item }">
      <div class="flex flex-col items-start gap-1">
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
          :class="{
            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400':
              item.difference > 0,
            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400': item.is_deficit,
            'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300': item.difference === 0,
          }"
          dir="ltr"
        >
          <span v-if="item.difference > 0">+</span>
          {{ formatNumber(item.difference) }} L
        </span>
        <span class="text-[10px] text-gray-500">{{ item.type_label }}</span>
      </div>
    </template>

    <template #cell-actions="{ item }">
      <div class="flex items-center justify-end gap-2">
        <button
          @click="$emit('edit', item)"
          class="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 transition-colors"
          title="تعديل التسوية (للمدراء)"
        >
          <PencilSquareIcon class="h-5 w-5" />
        </button>
        <button
          @click="$emit('delete', item)"
          class="p-1 text-red-600 hover:text-red-800 dark:text-red-400 transition-colors"
          title="حذف التسوية"
        >
          <TrashIcon class="h-5 w-5" />
        </button>
      </div>
    </template>
  </AppTable>
</template>

<script setup>
import { computed } from 'vue'
import AppTable from '@/components/ui/AppTable.vue'
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'

defineProps({ items: Array, loading: Boolean })
defineEmits(['edit', 'delete'])

// دالة لتنسيق الأرقام (اللترات) بالأرقام الإنجليزية
const formatNumber = (val) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(val || 0)
}

const headers = computed(() => [
  { key: 'created_at', label: 'تاريخ الجرد', class: 'text-right' },
  { key: 'tank_name', label: 'الخزان', class: 'text-right' },
  { key: 'supervisor_name', label: 'المشرف المسؤول', class: 'text-right' },
  { key: 'system_stock', label: 'الرصيد الدفتري', class: 'text-right' },
  { key: 'actual_stock', label: 'الرصيد الفعلي', class: 'text-right' },
  { key: 'difference', label: 'الفروقات', class: 'text-right' },
  { key: 'actions', label: '', class: 'w-20' },
])
</script>
