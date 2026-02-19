<template>
  <AppTable :headers="headers" :items="items" :is-loading="loading">
    <template #cell-pump="{ item }"> {{ item.pump?.name }} </template>
    <template #cell-tank="{ item }"> {{ item.tank?.name }} </template>
    <template #cell-current_counter="{ item }">
      <span class="font-mono text-blue-600 dark:text-blue-400 font-bold">
        {{ item.current_counter }}
      </span>
    </template>

    <template #cell-actions="{ item }">
      <div class="flex items-center justify-end gap-2">
        <button
          @click="$emit('edit', item)"
          class="text-blue-600 hover:text-blue-800 dark:text-blue-400"
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

defineProps({ items: Array, loading: Boolean })
const headers = computed(() => [
  { key: 'code', label: 'كود المسدس', class: 'text-right' },
  { key: 'pump', label: 'المضخة', class: 'text-right' },
  { key: 'tank', label: 'الخزان', class: 'text-right' },
  { key: 'current_counter', label: 'قراءة العداد الحالية', class: 'text-right' },
  { key: 'actions', label: '', class: 'w-20' },
])
</script>
