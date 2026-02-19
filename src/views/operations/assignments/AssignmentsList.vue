<template>
  <div class="p-6">
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white font-display">
          تكليفات المسدسات
        </h1>
        <p class="text-sm text-text-muted mt-1">
          توزيع أطقم العمل على المضخات ومتابعة العدادات اللحظية
        </p>
      </div>

      <AppButton @click="openCreateModal" variant="primary">
        <PlusIcon class="h-5 w-5 ml-2" />
        تكليف جديد
      </AppButton>
    </div>

    <div class="bg-white dark:bg-surface-section p-4 rounded-xl border border-surface-border mb-6">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AppInput
          id="search-user"
          label="بحث باسم العامل"
          v-model="searchQuery"
          @input="handleSearch"
          placeholder="اسم العامل..."
        />
      </div>
    </div>

    <AssignmentsTable :items="assignments" :loading="loading" @edit="openEditModal" />

    <AssignmentModal
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
import { useAssignmentStore } from '@/stores/assignmentStore'
import { PlusIcon } from '@heroicons/vue/24/outline'

import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AssignmentsTable from './AssignmentsTable.vue'
import AssignmentModal from './AssignmentModal.vue'

const store = useAssignmentStore()
const { assignments, loading } = storeToRefs(store)

const showModal = ref(false)
const selectedItem = ref(null)
const isSaving = ref(false)
const searchQuery = ref('')

onMounted(() => store.fetchAssignments())

const handleSearch = () => {
  store.fetchAssignments(1, searchQuery.value)
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
      await store.updateAssignment(selectedItem.value.id, formData)
    } else {
      await store.createAssignment(formData)
    }
    showModal.value = false
    await store.fetchAssignments()
  } catch (error) {
    console.error('Save Error:', error)
  } finally {
    isSaving.value = false
  }
}
</script>
