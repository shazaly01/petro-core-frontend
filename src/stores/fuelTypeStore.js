import { defineStore } from 'pinia'
import { ref } from 'vue'
import fuelTypeService from '@/services/fuelTypeService'

export const useFuelTypeStore = defineStore('fuelType', () => {
  // --- State (حالة التطبيق) ---
  const fuelTypes = ref([]) // قائمة أنواع الوقود
  const pagination = ref({}) // معلومات الترحيل (meta links)
  const currentFuelType = ref(null) // نوع الوقود المحدد حالياً (للتعديل أو العرض)
  const loading = ref(false) // حالة التحميل
  const error = ref(null) // رسائل الخطأ

  // --- Actions (العمليات) ---

  // جلب كافة الأنواع
  async function fetchFuelTypes(page = 1, search = '') {
    loading.value = true
    error.value = null
    try {
      const response = await fuelTypeService.get(page, search)
      // نفترض أن هيكل الرد في Laravel هو { data: [...], meta: {...} }
      fuelTypes.value = response.data.data
      pagination.value = response.data.meta
    } catch (err) {
      error.value = 'Failed to fetch fuel types.'
      console.error(err)
      fuelTypes.value = []
    } finally {
      loading.value = false
    }
  }

  // جلب نوع وقود واحد
  async function fetchFuelType(id) {
    loading.value = true
    error.value = null
    currentFuelType.value = null
    try {
      const response = await fuelTypeService.find(id)
      currentFuelType.value = response.data.data
    } catch (err) {
      error.value = 'Failed to fetch fuel type.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // إنشاء نوع وقود جديد
  async function createFuelType(payload) {
    loading.value = true
    error.value = null
    try {
      await fuelTypeService.create(payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create fuel type.'
      console.error(err)
      throw err // إعادة رمي الخطأ ليتم التعامل معه في الواجهة (مثل إظهار تنبيه)
    } finally {
      loading.value = false
    }
  }

  // تحديث بيانات نوع وقود
  async function updateFuelType(id, payload) {
    loading.value = true
    error.value = null
    try {
      await fuelTypeService.update(id, payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update fuel type.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // حذف نوع وقود
  async function deleteFuelType(id) {
    loading.value = true
    error.value = null
    try {
      await fuelTypeService.delete(id)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete fuel type.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // --- Return public API (تصدير الواجهة) ---
  return {
    fuelTypes,
    pagination,
    currentFuelType,
    loading,
    error,
    fetchFuelTypes,
    fetchFuelType,
    createFuelType,
    updateFuelType,
    deleteFuelType,
  }
})
