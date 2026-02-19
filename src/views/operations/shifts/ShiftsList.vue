<template>
  <div class="p-6">
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white font-display">
          إدارة الورديات
        </h1>
        <p class="text-sm text-text-muted mt-1">
          متابعة فتح وإغلاق الورديات وتدقيق الحسابات المالية
        </p>
      </div>

      <AppButton @click="openCreateModal" variant="primary" size="lg">
        <BoltIcon class="h-5 w-5 ml-2" />
        فتح وردية جديدة
      </AppButton>
    </div>

    <div class="bg-white dark:bg-surface-section p-4 rounded-xl border border-surface-border mb-6">
      <div class="flex flex-col sm:flex-row gap-4 items-end">
        <div class="w-full sm:w-64">
          <AppInput
            id="shift-search"
            label="بحث برقم الوردية"
            v-model="searchQuery"
            @input="handleSearch"
            placeholder="مثلاً: 1050..."
          />
        </div>
      </div>
    </div>

    <ShiftsTable :items="shifts" :loading="loading" @edit="openEditModal" />

    <ShiftModal v-model="showModal" :item="selectedItem" :is-saving="isSaving" @save="handleSave" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useShiftStore } from '@/stores/shiftStore'
import { BoltIcon } from '@heroicons/vue/24/outline'

import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import ShiftsTable from './ShiftsTable.vue'
import ShiftModal from './ShiftModal.vue'

const store = useShiftStore()
const { shifts, loading } = storeToRefs(store)

const showModal = ref(false)
const selectedItem = ref(null)
const isSaving = ref(false)
const searchQuery = ref('')

onMounted(() => store.fetchShifts())

const handleSearch = () => {
  store.fetchShifts(1, searchQuery.value)
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
      await store.updateShift(selectedItem.value.id, formData)
    } else {
      await store.createShift(formData)
    }
    showModal.value = false
    await store.fetchShifts()
  } catch (error) {
    console.error('Shift Save Error:', error)
  } finally {
    isSaving.value = false
  }
}
</script>
