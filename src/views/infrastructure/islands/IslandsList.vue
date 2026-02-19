<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">إدارة الجزر</h1>
      <p class="text-sm text-text-muted mt-1">تعريف ومتابعة جزر التعبئة داخل المحطة</p>
    </div>

    <IslandsFilter @search="handleSearch" @create="openCreateModal" :can-create="true" />

    <div class="mt-6">
      <IslandsTable
        :items="islands"
        :loading="loading"
        :can-update="true"
        :can-delete="true"
        @edit="openEditModal"
        @delete="handleDelete"
      />
    </div>

    <IslandModal
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
import { useIslandStore } from '@/stores/islandStore'

import IslandsFilter from './IslandsFilter.vue'
import IslandsTable from './IslandsTable.vue'
import IslandModal from './IslandModal.vue'

const store = useIslandStore()
const { islands, loading } = storeToRefs(store)

const showModal = ref(false)
const selectedItem = ref(null)
const isSaving = ref(false)

onMounted(() => store.fetchIslands())

const handleSearch = (query) => store.fetchIslands(1, query)

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
      await store.updateIsland(selectedItem.value.id, formData)
    } else {
      await store.createIsland(formData)
    }
    showModal.value = false
    await store.fetchIslands()
  } catch (error) {
    console.error(error)
  } finally {
    isSaving.value = false
  }
}

const handleDelete = async (item) => {
  if (confirm(`هل تريد حذف الجزيرة ${item.name}؟`)) {
    await store.deleteIsland(item.id)
    await store.fetchIslands()
  }
}
</script>
