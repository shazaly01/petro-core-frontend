import { defineStore } from 'pinia'
import { ref } from 'vue'
import tankService from '@/services/tankService'

export const useTankStore = defineStore('tank', () => {
  const tanks = ref([])
  const pagination = ref({})
  const currentTank = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchTanks(page = 1, search = '') {
    loading.value = true
    error.value = null
    try {
      const response = await tankService.get(page, search)
      tanks.value = response.data.data
      pagination.value = response.data.meta
    } catch (err) {
      error.value = 'Failed to fetch tanks.'
      console.error(err)
      tanks.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchTank(id) {
    loading.value = true
    error.value = null
    currentTank.value = null
    try {
      const response = await tankService.find(id)
      currentTank.value = response.data.data
    } catch (err) {
      error.value = 'Failed to fetch tank.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function createTank(payload) {
    loading.value = true
    error.value = null
    try {
      await tankService.create(payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create tank.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateTank(id, payload) {
    loading.value = true
    error.value = null
    try {
      await tankService.update(id, payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update tank.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteTank(id) {
    loading.value = true
    error.value = null
    try {
      await tankService.delete(id)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete tank.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    tanks,
    pagination,
    currentTank,
    loading,
    error,
    fetchTanks,
    fetchTank,
    createTank,
    updateTank,
    deleteTank,
  }
})
