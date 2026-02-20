<template>
  <AppTable
    :headers="headers"
    :items="items"
    :is-loading="loading"
    :row-clickable="true"
    @row-click="handleRowClick"
  >
    <template #cell-pump="{ item }">
      <span class="font-bold text-primary dark:text-blue-400" dir="ltr">
        {{ item.pump?.name || item.pump?.code || '---' }}
      </span>
    </template>

    <template #cell-user="{ item }">
      <div class="flex flex-col">
        <span class="text-sm font-medium text-gray-900 dark:text-white">
          {{ item.user?.full_name || item.user?.name }}
        </span>
        <span class="text-xs text-text-muted">ID: {{ item.user?.id || item.user_id }}</span>
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

    <template #cell-expected_amount="{ item }">
      <div class="flex flex-col text-right">
        <span class="text-xs text-gray-500 dark:text-gray-400" dir="ltr">
          {{ formatNumber(item.total_sold_liters) }} L
        </span>
        <span class="font-bold text-gray-900 dark:text-white" dir="ltr">
          {{ item.expected_amount !== null ? formatCurrency(item.expected_amount) : '---' }}
        </span>
      </div>
    </template>

    <template #cell-collected="{ item }">
      <span class="text-sm font-bold text-green-600 dark:text-green-400" dir="ltr">
        {{
          item.status === 'completed'
            ? formatCurrency(
                (parseFloat(item.cash_amount) || 0) + (parseFloat(item.bank_amount) || 0),
              )
            : '---'
        }}
      </span>
    </template>

    <template #cell-difference="{ item }">
      <span
        v-if="item.status === 'completed'"
        class="text-sm font-bold"
        dir="ltr"
        :class="
          item.difference < 0
            ? 'text-red-600 dark:text-red-400'
            : item.difference > 0
              ? 'text-green-600 dark:text-green-400'
              : 'text-gray-500 dark:text-gray-400'
        "
      >
        <span v-if="item.difference < 0">(-) </span>
        <span v-else-if="item.difference > 0">(+) </span>
        {{ formatCurrency(Math.abs(item.difference)) }}
      </span>
      <span v-else class="text-gray-400">---</span>
    </template>

    <template #cell-actions="{ item }">
      <div class="flex items-center justify-end gap-2">
        <button
          @click.stop="$emit('edit', item)"
          class="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
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

const emit = defineEmits(['edit'])

// 🛑 تحديث الأعمدة لتتناسب مع الهيكلة الجديدة
const headers = computed(() => [
  { key: 'pump', label: 'المضخة', class: 'text-right' },
  { key: 'user', label: 'العامل المسؤول', class: 'text-right' },
  { key: 'expected_amount', label: 'المطلوب (لتر/مبلغ)', class: 'text-right' },
  { key: 'collected', label: 'المدخل (الخزينة)', class: 'text-right' },
  { key: 'difference', label: 'العجز / الزيادة', class: 'text-right' },
  { key: 'status', label: 'الحالة', class: 'text-right w-24' },
  { key: 'actions', label: '', class: 'w-12' },
])

// 🛑 دالة التعامل مع النقر على الصف
const handleRowClick = (item) => {
  emit('edit', item)
}

// تنسيق الكميات (لتر) - بخانتين عشريتين
const formatNumber = (val) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val || 0)
}

// تنسيق العملة (دينار ليبي) - بـ 3 خانات عشرية
const formatCurrency = (val) => {
  const number = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(val || 0)
  return `${number} د.ل`
}
</script>
