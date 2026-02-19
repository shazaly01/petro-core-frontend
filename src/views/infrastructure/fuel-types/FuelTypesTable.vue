<template>
  <AppTable :headers="headers" :items="items" :is-loading="loading" :row-clickable="false">
    <template #cell-current_price="{ item }">
      <span class="font-bold text-gray-900 dark:text-white">
        {{ formatCurrency(item.current_price) }}
      </span>
    </template>

    <template #cell-tanks_count="{ item }">
      <span
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      >
        {{ item.tanks_count || 0 }} خزانات
      </span>
    </template>

    <template #cell-actions="{ item }">
      <div class="flex items-center justify-end gap-2">
        <button
          v-if="canUpdate"
          @click="$emit('edit', item)"
          class="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          title="تعديل"
        >
          <PencilSquareIcon class="h-5 w-5" />
        </button>
        <button
          v-if="canDelete"
          @click="$emit('delete', item)"
          class="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
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
  canUpdate: Boolean,
  canDelete: Boolean,
})

defineEmits(['edit', 'delete'])

// تعريف عناوين الأعمدة
const headers = computed(() => [
  { key: 'name', label: 'اسم الوقود', class: 'text-right' },
  { key: 'current_price', label: 'السعر الحالي', class: 'text-right' },
  { key: 'tanks_count', label: 'عدد الخزانات', class: 'text-right' }, // نفترض أن الباك إند يرسل هذا الحقل
  { key: 'description', label: 'ملاحظات', class: 'text-right' },
  { key: 'actions', label: '', class: 'w-20' },
])

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'SDG',
    minimumFractionDigits: 2,
  }).format(value)
}
</script>
