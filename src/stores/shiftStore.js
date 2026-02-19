import { defineStore } from 'pinia'
import { ref } from 'vue'
import shiftService from '@/services/shiftService'

export const useShiftStore = defineStore('shift', () => {
  const shifts = ref([])
  const pagination = ref({})
  const currentShift = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchShifts(page = 1, search = '') {
    loading.value = true
    error.value = null
    try {
      const response = await shiftService.get(page, search)
      shifts.value = response.data.data
      pagination.value = response.data.meta
    } catch (err) {
      error.value = 'Failed to fetch shifts.'
      console.error(err)
      shifts.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchShift(id) {
    loading.value = true
    error.value = null
    currentShift.value = null
    try {
      const response = await shiftService.find(id)
      currentShift.value = response.data.data
    } catch (err) {
      error.value = 'Failed to fetch shift.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function createShift(payload) {
    loading.value = true
    error.value = null
    try {
      await shiftService.create(payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create shift.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateShift(id, payload) {
    loading.value = true
    error.value = null
    try {
      await shiftService.update(id, payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update shift.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteShift(id) {
    loading.value = true
    error.value = null
    try {
      await shiftService.delete(id)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete shift.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    shifts,
    pagination,
    currentShift,
    loading,
    error,
    fetchShifts,
    fetchShift,
    createShift,
    updateShift,
    deleteShift,
  }
})
