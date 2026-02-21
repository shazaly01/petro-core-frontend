import { defineStore } from 'pinia'
import { ref } from 'vue'
import inventoryAdjustmentService from '@/services/inventoryAdjustmentService'

export const useInventoryAdjustmentStore = defineStore('inventoryAdjustment', () => {
  // --- State ---
  const adjustments = ref([])
  const pagination = ref({})
  const currentAdjustment = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---

  async function fetchAdjustments(page = 1, filters = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await inventoryAdjustmentService.get(page, filters.search, filters.tank_id)
      adjustments.value = response.data.data
      pagination.value = response.data.meta
    } catch (err) {
      error.value = 'حدث خطأ أثناء جلب التسويات الجردية.'
      console.error(err)
      adjustments.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchAdjustment(id) {
    loading.value = true
    error.value = null
    currentAdjustment.value = null
    try {
      const response = await inventoryAdjustmentService.find(id)
      currentAdjustment.value = response.data.data
    } catch (err) {
      error.value = 'حدث خطأ أثناء جلب بيانات التسوية.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function createAdjustment(payload) {
    loading.value = true
    error.value = null
    try {
      await inventoryAdjustmentService.create(payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'حدث خطأ أثناء إنشاء التسوية الجردية.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateAdjustment(id, payload) {
    loading.value = true
    error.value = null
    try {
      await inventoryAdjustmentService.update(id, payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'حدث خطأ أثناء تعديل التسوية الجردية.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteAdjustment(id) {
    loading.value = true
    error.value = null
    try {
      await inventoryAdjustmentService.delete(id)
    } catch (err) {
      error.value = err.response?.data?.message || 'حدث خطأ أثناء حذف التسوية الجردية.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // --- Return public API ---
  return {
    adjustments,
    pagination,
    currentAdjustment,
    loading,
    error,
    fetchAdjustments,
    fetchAdjustment,
    createAdjustment,
    updateAdjustment,
    deleteAdjustment,
  }
})
