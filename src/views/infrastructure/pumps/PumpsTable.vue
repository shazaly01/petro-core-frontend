<template>
  <AppTable :headers="headers" :items="items" :is-loading="loading" :row-clickable="false">
    <template #cell-island="{ item }">
      <span class="text-text-secondary">
        {{ item.island || 'غير محددة' }}
      </span>
    </template>

    <template #cell-is_active="{ item }">
      <span
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
        :class="item.is_active ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'"
      >
        {{ item.is_active ? 'تعمل' : 'خارج الخدمة' }}
      </span>
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

defineProps({ items: Array, loading: Boolean })
defineEmits(['edit', 'delete'])

const headers = computed(() => [
  { key: 'code', label: 'كود المضخة', class: 'text-right' },
  { key: 'name', label: 'اسم المضخة', class: 'text-right' },
  { key: 'island', label: 'الجزيرة', class: 'text-right' },
  { key: 'model', label: 'الموديل', class: 'text-right' },
  { key: 'is_active', label: 'الحالة', class: 'text-right' },
  { key: 'actions', label: '', class: 'w-20' },
])
</script>
