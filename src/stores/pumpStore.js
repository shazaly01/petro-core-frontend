import { defineStore } from 'pinia'
import { ref } from 'vue'
import pumpService from '@/services/pumpService'

export const usePumpStore = defineStore('pump', () => {
  // --- State ---
  const pumps = ref([])
  const pagination = ref({})
  const currentPump = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---

  // 🛑 التعديل: استقبال `available` وتمريره
  async function fetchPumps(page = 1, search = '', available = null) {
    loading.value = true
    error.value = null
    try {
      // تمرير الفلتر إلى الـ Service
      const response = await pumpService.get(page, search, available)
      pumps.value = response.data.data
      pagination.value = response.data.meta
    } catch (err) {
      error.value = 'Failed to fetch pumps.'
      console.error(err)
      pumps.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchPump(id) {
    loading.value = true
    error.value = null
    currentPump.value = null
    try {
      const response = await pumpService.find(id)
      currentPump.value = response.data.data
    } catch (err) {
      error.value = 'Failed to fetch pump.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function createPump(payload) {
    loading.value = true
    error.value = null
    try {
      await pumpService.create(payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create pump.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updatePump(id, payload) {
    loading.value = true
    error.value = null
    try {
      await pumpService.update(id, payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update pump.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deletePump(id) {
    loading.value = true
    error.value = null
    try {
      await pumpService.delete(id)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete pump.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getPumpFromList = (id) => {
    return pumps.value.find((p) => p.id === id)
  }

  // --- Return public API ---
  return {
    pumps,
    pagination,
    currentPump,
    loading,
    error,
    fetchPumps,
    fetchPump,
    createPump,
    updatePump,
    deletePump,
    getPumpFromList,
  }
})
