<template>
  <AppTable :headers="headers" :items="items" :is-loading="loading" :row-clickable="false">
    <template #cell-shift_info="{ item }">
      <div class="flex flex-col">
        <span class="font-bold text-gray-900 dark:text-gray-100">
          {{ item.name || 'جاري التحميل...' }}
        </span>
        <span class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          رقم الوردية: #{{ item.id }}
        </span>
      </div>
    </template>

    <template #cell-status="{ item }">
      <span
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
        :class="
          item.status === 'open'
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        "
      >
        {{ item.status === 'open' ? 'مفتوحة الآن' : 'مغلقة' }}
      </span>
    </template>

    <template #cell-supervisor="{ item }">
      <span class="text-text-secondary font-medium">
        {{ item.supervisor?.name || 'غير محدد' }}
      </span>
    </template>

    <template #cell-difference="{ item }">
      <span
        v-if="item.status === 'closed'"
        class="font-mono font-bold"
        :class="item.difference < 0 ? 'text-danger' : 'text-success'"
      >
        {{ formatCurrency(item.difference) }}
      </span>
      <span v-else class="text-text-muted">--</span>
    </template>

    <template #cell-actions="{ item }">
      <div class="flex items-center justify-end gap-2">
        <button
          @click="$emit('edit', item)"
          class="flex items-center gap-1 px-2 py-1 text-sm text-primary hover:bg-primary/10 rounded transition-colors"
        >
          <PencilSquareIcon class="h-4 w-4" />
          <span>{{ item.status === 'open' ? 'إدارة / إغلاق' : 'عرض التفاصيل' }}</span>
        </button>
      </div>
    </template>
  </AppTable>
</template>

<script setup>
import { computed } from 'vue'
import AppTable from '@/components/ui/AppTable.vue'
import { PencilSquareIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  items: Array,
  loading: Boolean,
})

defineEmits(['edit'])

// 🛑 التعديل هنا: تحديث ترويسة الجدول لتعكس العمود المدمج
const headers = computed(() => [
  { key: 'shift_info', label: 'الوردية', class: 'text-right' }, // العمود الجديد المدمج
  { key: 'supervisor', label: 'المشرف المسؤول', class: 'text-right' },
  { key: 'status', label: 'الحالة', class: 'text-right' },
  // تم إزالة عمود start_at لأنه أصبح جزءاً من اسم الوردية
  { key: 'total_actual_cash', label: 'المبلغ المورد', class: 'text-right' },
  { key: 'difference', label: 'العجز / الزيادة', class: 'text-right' },
  { key: 'actions', label: '', class: 'w-32' },
])

const formatCurrency = (val) => {
  return new Intl.NumberFormat('ar-SD', { style: 'currency', currency: 'SDG' }).format(val)
}
</script>
