<template>
  <AppTable :headers="headers" :items="items" :is-loading="loading" :row-clickable="false">
    <template #cell-nozzle="{ item }">
      <span class="font-bold text-primary dark:text-blue-400" dir="ltr">
        {{ item.nozzle?.code || '---' }}
      </span>
    </template>

    <template #cell-user="{ item }">
      <div class="flex flex-col">
        <span class="text-sm font-medium text-gray-900 dark:text-white">
          {{ item.user?.full_name || item.user?.name }}
        </span>
        <span class="text-xs text-text-muted">ID: {{ item.user_id }}</span>
      </div>
    </template>

    <template #cell-status="{ item }">
      <span
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
        :class="
          item.status === 'active'
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
        "
      >
        {{ item.status === 'active' ? 'قيد العمل' : 'مكتمل' }}
      </span>
    </template>

    <template #cell-total_amount="{ item }">
      <div class="flex flex-col text-right">
        <span class="font-bold text-gray-900 dark:text-white" dir="ltr">
          {{ formatNumber(item.sold_liters) }} L
        </span>
        <span class="text-xs text-text-muted" dir="ltr">{{
          formatCurrency(item.total_amount)
        }}</span>
      </div>
    </template>

    <template #cell-total_paid="{ item }">
      <span class="text-sm font-bold text-green-600 dark:text-green-400" dir="ltr">
        {{ formatCurrency(item.total_paid) }}
      </span>
    </template>

    <template #cell-remaining_due="{ item }">
      <span
        class="text-sm font-bold"
        dir="ltr"
        :class="
          item.remaining_due > 0
            ? 'text-red-600 dark:text-red-400'
            : 'text-gray-900 dark:text-gray-300'
        "
      >
        {{ formatCurrency(item.remaining_due) }}
      </span>
    </template>

    <template #cell-actions="{ item }">
      <div class="flex items-center justify-end gap-2">
        <button
          @click="$emit('edit', item)"
          class="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
          :title="item.status === 'active' ? 'إغلاق التكليف' : 'عرض'"
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
  { key: 'nozzle', label: 'المسدس', class: 'text-right' },
  { key: 'user', label: 'العامل المسؤول', class: 'text-right' },
  { key: 'start_counter', label: 'عداد البداية', class: 'text-right' },
  { key: 'end_counter', label: 'عداد النهاية', class: 'text-right' },
  { key: 'total_amount', label: 'المطلوب', class: 'text-right' },
  { key: 'total_paid', label: 'المدفوع', class: 'text-right' }, // 🛑 تم الإضافة
  { key: 'remaining_due', label: 'المتبقي', class: 'text-right' }, // 🛑 تم الإضافة
  { key: 'status', label: 'الحالة', class: 'text-right' },
  { key: 'actions', label: '', class: 'w-16' },
])

// 🛑 التنسيق الجديد: استخدام 'en-US' لضمان الأرقام الإنجليزية
// تنسيق الكميات (لتر) - بخانتين عشريتين
const formatNumber = (val) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val || 0)
}

// 🛑 تنسيق العملة (دينار ليبي) - بـ 3 خانات عشرية كما في قاعدة البيانات
const formatCurrency = (val) => {
  const number = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(val || 0)
  return `${number} د.ل`
}
</script>
