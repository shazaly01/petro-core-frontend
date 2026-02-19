import { defineStore } from 'pinia'
import { ref } from 'vue'
import islandService from '@/services/islandService'

export const useIslandStore = defineStore('island', () => {
  // --- State ---
  const islands = ref([])
  const pagination = ref({})
  const currentIsland = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---

  async function fetchIslands(page = 1, search = '') {
    loading.value = true
    error.value = null
    try {
      const response = await islandService.get(page, search)
      islands.value = response.data.data
      pagination.value = response.data.meta
    } catch (err) {
      error.value = 'Failed to fetch islands.'
      console.error(err)
      islands.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchIsland(id) {
    loading.value = true
    error.value = null
    currentIsland.value = null
    try {
      const response = await islandService.find(id)
      currentIsland.value = response.data.data
    } catch (err) {
      error.value = 'Failed to fetch island.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function createIsland(payload) {
    loading.value = true
    error.value = null
    try {
      await islandService.create(payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create island.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateIsland(id, payload) {
    loading.value = true
    error.value = null
    try {
      await islandService.update(id, payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update island.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteIsland(id) {
    loading.value = true
    error.value = null
    try {
      await islandService.delete(id)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete island.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // --- Return public API ---
  return {
    islands,
    pagination,
    currentIsland,
    loading,
    error,
    fetchIslands,
    fetchIsland,
    createIsland,
    updateIsland,
    deleteIsland,
  }
})
