<template>
  <div class="p-6">
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white font-display">
          سجلات التوريد (Supply)
        </h1>
        <p class="text-sm text-text-muted mt-1">توثيق وصول شحنات الوقود وتفريغها في الخزانات</p>
      </div>

      <AppButton @click="openCreateModal" variant="primary">
        <TruckIcon class="h-5 w-5 ml-2" />
        تسجيل وصول شحنة
      </AppButton>
    </div>

    <div class="bg-white dark:bg-surface-section p-4 rounded-xl border border-surface-border mb-6">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="sm:col-span-2">
          <AppInput
            id="search-invoice"
            label="بحث برقم الفاتورة أو اسم السائق"
            v-model="searchQuery"
            @input="handleSearch"
            placeholder="مثلاً: INV-2025..."
          />
        </div>
      </div>
    </div>

    <SupplyLogsTable :items="supplyLogs" :loading="loading" @edit="openEditModal" />

    <SupplyLogModal
      v-model="showModal"
      :item="selectedItem"
      :is-saving="isSaving"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useSupplyLogStore } from '@/stores/supplyLogStore'
import { TruckIcon } from '@heroicons/vue/24/outline'

import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import SupplyLogsTable from './SupplyLogsTable.vue'
import SupplyLogModal from './SupplyLogModal.vue'

const store = useSupplyLogStore()
const { supplyLogs, loading } = storeToRefs(store)

const showModal = ref(false)
const selectedItem = ref(null)
const isSaving = ref(false)
const searchQuery = ref('')

onMounted(() => store.fetchSupplyLogs())

const handleSearch = () => {
  store.fetchSupplyLogs(1, searchQuery.value)
}

const openCreateModal = () => {
  selectedItem.value = null
  showModal.value = true
}

const openEditModal = (item) => {
  selectedItem.value = { ...item }
  showModal.value = true
}

const handleSave = async (formData) => {
  isSaving.value = true
  try {
    if (selectedItem.value?.id) {
      await store.updateSupplyLog(selectedItem.value.id, formData)
    } else {
      await store.createSupplyLog(formData)
    }
    showModal.value = false
    await store.fetchSupplyLogs()
  } catch (error) {
    console.error('Supply Log Save Error:', error)
  } finally {
    isSaving.value = false
  }
}
</script>
