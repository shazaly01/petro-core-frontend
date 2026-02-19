<template>
  <AppTable :headers="headers" :items="items" :is-loading="loading" :row-clickable="false">
    <template #cell-is_active="{ item }">
      <span
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
        :class="
          item.is_active
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
        "
      >
        {{ item.is_active ? 'نشطة' : 'متوقفة' }}
      </span>
    </template>

    <template #cell-actions="{ item }">
      <div class="flex items-center justify-end gap-2">
        <button
          v-if="canUpdate"
          @click="$emit('edit', item)"
          class="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          title="تعديل"
        >
          <PencilSquareIcon class="h-5 w-5" />
        </button>
        <button
          v-if="canDelete"
          @click="$emit('delete', item)"
          class="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
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

const headers = computed(() => [
  { key: 'code', label: 'كود الجزيرة', class: 'text-right' },
  { key: 'name', label: 'اسم الجزيرة', class: 'text-right' },
  { key: 'is_active', label: 'الحالة', class: 'text-right' },
  { key: 'actions', label: '', class: 'w-20' },
])
</script>
