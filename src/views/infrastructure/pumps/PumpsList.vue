<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">إدارة المضخات</h1>
      <p class="text-sm text-text-muted mt-1">تعريف وصيانة مضخات الوقود وتوزيعها على الجزر</p>
    </div>

    <div
      class="flex flex-col sm:flex-row gap-4 mb-4 justify-between items-center bg-white dark:bg-surface-section p-4 rounded-xl border border-surface-border"
    >
      <div class="w-full sm:w-80">
        <AppInput
          id="p-search"
          v-model="searchQuery"
          @input="handleSearch"
          placeholder="بحث بالمضخات..."
        />
      </div>
      <AppButton @click="openCreateModal" variant="primary">
        <PlusIcon class="h-5 w-5 ml-2" /> إضافة مضخة
      </AppButton>
    </div>

    <PumpsTable :items="pumps" :loading="loading" @edit="openEditModal" @delete="handleDelete" />

    <PumpModal v-model="showModal" :item="selectedItem" :is-saving="isSaving" @save="handleSave" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePumpStore } from '@/stores/pumpStore'
import { PlusIcon } from '@heroicons/vue/24/outline'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import PumpsTable from './PumpsTable.vue'
import PumpModal from './PumpModal.vue'

const store = usePumpStore()
const { pumps, loading } = storeToRefs(store)
const showModal = ref(false)
const selectedItem = ref(null)
const isSaving = ref(false)
const searchQuery = ref('')

onMounted(() => store.fetchPumps())
const handleSearch = () => store.fetchPumps(1, searchQuery.value)
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
    selectedItem.value?.id
      ? await store.updatePump(selectedItem.value.id, formData)
      : await store.createPump(formData)
    showModal.value = false
    store.fetchPumps()
  } finally {
    isSaving.value = false
  }
}

const handleDelete = async (item) => {
  if (confirm('حذف هذه المضخة سيؤثر على المسدسات المرتبطة بها، هل أنت متأكد؟')) {
    await store.deletePump(item.id)
    store.fetchPumps()
  }
}
</script>
