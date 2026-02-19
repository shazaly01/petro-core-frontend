<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">إدارة الخزانات</h1>
      <p class="text-sm text-text-muted mt-1">مراقبة سعة المخزون وأنواع الوقود لكل خزان</p>
    </div>

    <TanksFilter @search="handleSearch" @create="openCreateModal" :can-create="true" />

    <div class="mt-6">
      <TanksTable :items="tanks" :loading="loading" @edit="openEditModal" @delete="handleDelete" />
    </div>

    <TankModal v-model="showModal" :item="selectedItem" :is-saving="isSaving" @save="handleSave" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTankStore } from '@/stores/tankStore'

import TanksFilter from './TanksFilter.vue'
import TanksTable from './TanksTable.vue'
import TankModal from './TankModal.vue'

const store = useTankStore()
const { tanks, loading } = storeToRefs(store)

const showModal = ref(false)
const selectedItem = ref(null)
const isSaving = ref(false)

onMounted(() => store.fetchTanks())

const handleSearch = (query) => store.fetchTanks(1, query)

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
      await store.updateTank(selectedItem.value.id, formData)
    } else {
      await store.createTank(formData)
    }
    showModal.value = false
    await store.fetchTanks()
  } catch (error) {
    console.error(error)
  } finally {
    isSaving.value = false
  }
}

const handleDelete = async (item) => {
  if (confirm(`هل أنت متأكد من حذف الخزان ${item.name}؟`)) {
    await store.deleteTank(item.id)
    await store.fetchTanks()
  }
}
</script>
