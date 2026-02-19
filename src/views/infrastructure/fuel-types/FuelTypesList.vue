<template>
  <div class="p-6">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">أنواع الوقود</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          إدارة أنواع الوقود وأسعارها الحالية
        </p>
      </div>
    </div>

    <FuelTypesFilter
      @search="handleSearch"
      @create="openCreateModal"
      :can-create="authStore.can('infrastructure.create')"
    />

    <div class="mt-6">
      <FuelTypesTable
        :items="fuelTypes"
        :loading="loading"
        :can-update="authStore.can('infrastructure.update')"
        :can-delete="authStore.can('infrastructure.delete')"
        @edit="openEditModal"
        @delete="handleDelete"
      />
    </div>

    <FuelTypeModal
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
import { useFuelTypeStore } from '@/stores/fuelTypeStore'
import { useAuthStore } from '@/stores/authStore'

// استيراد المكونات الفرعية
import FuelTypesFilter from './FuelTypesFilter.vue'
import FuelTypesTable from './FuelTypesTable.vue'
import FuelTypeModal from './FuelTypeModal.vue'

// تهيئة المخازن
const store = useFuelTypeStore()
const authStore = useAuthStore()

// استخراج البيانات من الستور
const { fuelTypes, loading } = storeToRefs(store)

// حالة المودال
const showModal = ref(false)
const selectedItem = ref(null)
const isSaving = ref(false)

// تحميل البيانات عند فتح الصفحة
onMounted(() => {
  store.fetchFuelTypes()
})

// التعامل مع البحث
const handleSearch = (query) => {
  store.fetchFuelTypes(1, query)
}

// فتح المودال للإضافة
const openCreateModal = () => {
  selectedItem.value = null // null يعني إضافة جديد
  showModal.value = true
}

// فتح المودال للتعديل
const openEditModal = (item) => {
  selectedItem.value = { ...item } // نسخة لتجنب التعديل المباشر
  showModal.value = true
}

// التعامل مع الحفظ (إضافة أو تعديل)
const handleSave = async (formData) => {
  isSaving.value = true
  try {
    if (selectedItem.value && selectedItem.value.id) {
      // تعديل
      await store.updateFuelType(selectedItem.value.id, formData)
    } else {
      // إضافة جديد
      await store.createFuelType(formData)
    }

    // إغلاق المودال وتحديث القائمة
    showModal.value = false
    await store.fetchFuelTypes() // إعادة تحميل البيانات لرؤية التغييرات

    // هنا يمكن إضافة إشعار نجاح (Toast Notification)
    // example: toast.success('تم الحفظ بنجاح')
  } catch (error) {
    console.error('Save error:', error)
    // هنا يمكن عرض رسالة خطأ للمستخدم
  } finally {
    isSaving.value = false
  }
}

// التعامل مع الحذف
const handleDelete = async (item) => {
  if (!confirm(`هل أنت متأكد من حذف "${item.name}"؟`)) return

  try {
    await store.deleteFuelType(item.id)
    await store.fetchFuelTypes() // تحديث القائمة
    // toast.success('تم الحذف بنجاح')
  } catch (error) {
    console.error('Delete error:', error)
    alert('حدث خطأ أثناء الحذف')
  }
}
</script>
