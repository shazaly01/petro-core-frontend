<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">إدارة المسدسات (Nozzles)</h1>
      <p class="text-sm text-text-muted mt-1">
        ربط المسدسات بالمضخات والخزانات وتحديث قراءات العدادات الافتتاحية
      </p>
    </div>

    <div
      class="flex flex-col sm:flex-row gap-4 mb-4 justify-between items-center bg-white dark:bg-surface-section p-4 rounded-xl border border-surface-border"
    >
      <div class="w-full sm:w-80">
        <AppInput
          id="nozzle-search"
          v-model="searchQuery"
          @input="handleSearch"
          placeholder="بحث بكود المسدس..."
        />
      </div>

      <AppButton @click="openCreateModal" variant="primary">
        <PlusIcon class="h-5 w-5 ml-2" />
        إضافة مسدس جديد
      </AppButton>
    </div>

    <div class="mt-6">
      <NozzlesTable
        :items="nozzles"
        :loading="loading"
        @edit="openEditModal"
        @delete="handleDelete"
      />
    </div>

    <NozzleModal
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
import { useNozzleStore } from '@/stores/nozzleStore'
import { PlusIcon } from '@heroicons/vue/24/outline'

// استيراد المكونات والمكعبات
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import NozzlesTable from './NozzlesTable.vue'
import NozzleModal from './NozzleModal.vue'

// تهيئة المخزن (Store)
const store = useNozzleStore()
const { nozzles, loading } = storeToRefs(store)

// حالة الواجهة
const showModal = ref(false)
const selectedItem = ref(null)
const isSaving = ref(false)
const searchQuery = ref('')

// جلب البيانات عند التحميل
onMounted(() => {
  store.fetchNozzles()
})

// التعامل مع البحث
const handleSearch = () => {
  store.fetchNozzles(1, searchQuery.value)
}

// فتح المودال للإضافة
const openCreateModal = () => {
  selectedItem.value = null
  showModal.value = true
}

// فتح المودال للتعديل
const openEditModal = (item) => {
  selectedItem.value = { ...item }
  showModal.value = true
}

// حفظ البيانات (إضافة/تعديل)
const handleSave = async (formData) => {
  isSaving.value = true
  try {
    if (selectedItem.value?.id) {
      await store.updateNozzle(selectedItem.value.id, formData)
    } else {
      await store.createNozzle(formData)
    }
    showModal.value = false
    await store.fetchNozzles() // تحديث القائمة بعد الحفظ
  } catch (error) {
    console.error('Failed to save nozzle:', error)
  } finally {
    isSaving.value = false
  }
}

// حذف المسدس
const handleDelete = async (item) => {
  if (confirm(`هل أنت متأكد من حذف المسدس ${item.code}؟`)) {
    try {
      await store.deleteNozzle(item.id)
      await store.fetchNozzles()
    } catch (error) {
      console.error('Failed to delete nozzle:', error)
    }
  }
}
</script>
