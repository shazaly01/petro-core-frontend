<template>
  <AppTable :headers="headers" :items="items" :is-loading="loading" :row-clickable="false">
    <template #cell-fuel_type="{ item }">
      <span class="font-medium text-primary">
        {{ item.fuel_type?.name || '-' }}
      </span>
    </template>

    <template #cell-stock_level="{ item }">
      <div class="w-full max-w-xs">
        <div class="flex justify-between mb-1 text-xs">
          <span
            :class="
              item.current_stock <= item.alert_threshold
                ? 'text-danger font-bold'
                : 'text-text-secondary'
            "
          >
            {{ formatLiters(item.current_stock) }} / {{ formatLiters(item.capacity) }}
          </span>
          <span class="text-text-muted">{{ calculatePercentage(item) }}%</span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            class="h-2 rounded-full transition-all duration-500"
            :class="getStockBarClass(item)"
            :style="{ width: calculatePercentage(item) + '%' }"
          ></div>
        </div>
      </div>
    </template>

    <template #cell-actions="{ item }">
      <div class="flex items-center justify-end gap-2">
        <button
          @click="$emit('edit', item)"
          class="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400"
          title="تعديل"
        >
          <PencilSquareIcon class="h-5 w-5" />
        </button>
        <button
          @click="$emit('delete', item)"
          class="p-1 text-red-600 hover:text-red-800 dark:text-red-400"
          title="حذف"
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

defineProps({
  items: Array,
  loading: Boolean,
})

defineEmits(['edit', 'delete'])

const headers = computed(() => [
  { key: 'code', label: 'كود الخزان', class: 'text-right w-32' },
  { key: 'name', label: 'الاسم', class: 'text-right' },
  { key: 'fuel_type', label: 'نوع الوقود', class: 'text-right' },
  { key: 'stock_level', label: 'مستوى المخزون', class: 'text-right w-64' },
  { key: 'actions', label: '', class: 'w-20' },
])

const calculatePercentage = (item) => {
  if (!item.capacity) return 0
  return Math.round((item.current_stock / item.capacity) * 100)
}

const getStockBarClass = (item) => {
  const percentage = calculatePercentage(item)
  if (item.current_stock <= item.alert_threshold) return 'bg-danger' // أحمر إذا وصل للحد الأدنى
  if (percentage < 30) return 'bg-warning' // أصفر إذا قارب على الانتهاء
  return 'bg-success' // أخضر إذا كان الوضع طبيعي
}

const formatLiters = (val) => {
  return new Intl.NumberFormat('ar-EG').format(val) + ' لتر'
}
</script>
