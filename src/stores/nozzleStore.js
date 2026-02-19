import { defineStore } from 'pinia'
import { ref } from 'vue'
import nozzleService from '@/services/nozzleService'

export const useNozzleStore = defineStore('nozzle', () => {
  // --- State ---
  const nozzles = ref([])
  const pagination = ref({})
  const currentNozzle = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---

  async function fetchNozzles(page = 1, search = '') {
    loading.value = true
    error.value = null
    try {
      const response = await nozzleService.get(page, search)
      nozzles.value = response.data.data
      pagination.value = response.data.meta
    } catch (err) {
      error.value = 'Failed to fetch nozzles.'
      console.error(err)
      nozzles.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchNozzle(id) {
    loading.value = true
    error.value = null
    currentNozzle.value = null
    try {
      const response = await nozzleService.find(id)
      currentNozzle.value = response.data.data
    } catch (err) {
      error.value = 'Failed to fetch nozzle.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function createNozzle(payload) {
    loading.value = true
    error.value = null
    try {
      await nozzleService.create(payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create nozzle.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateNozzle(id, payload) {
    loading.value = true
    error.value = null
    try {
      await nozzleService.update(id, payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update nozzle.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteNozzle(id) {
    loading.value = true
    error.value = null
    try {
      await nozzleService.delete(id)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete nozzle.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // --- Return public API ---
  return {
    nozzles,
    pagination,
    currentNozzle,
    loading,
    error,
    fetchNozzles,
    fetchNozzle,
    createNozzle,
    updateNozzle,
    deleteNozzle,
  }
})
