import { defineStore } from 'pinia'
import { ref } from 'vue'
import supplyLogService from '@/services/supplyLogService'

export const useSupplyLogStore = defineStore('supplyLog', () => {
  const supplyLogs = ref([])
  const pagination = ref({})
  const currentSupplyLog = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchSupplyLogs(page = 1, search = '') {
    loading.value = true
    error.value = null
    try {
      const response = await supplyLogService.get(page, search)
      supplyLogs.value = response.data.data
      pagination.value = response.data.meta
    } catch (err) {
      error.value = 'Failed to fetch supply logs.'
      console.error(err)
      supplyLogs.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchSupplyLog(id) {
    loading.value = true
    error.value = null
    currentSupplyLog.value = null
    try {
      const response = await supplyLogService.find(id)
      currentSupplyLog.value = response.data.data
    } catch (err) {
      error.value = 'Failed to fetch supply log.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function createSupplyLog(payload) {
    loading.value = true
    error.value = null
    try {
      await supplyLogService.create(payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create supply log.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateSupplyLog(id, payload) {
    loading.value = true
    error.value = null
    try {
      await supplyLogService.update(id, payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update supply log.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteSupplyLog(id) {
    loading.value = true
    error.value = null
    try {
      await supplyLogService.delete(id)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete supply log.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    supplyLogs,
    pagination,
    currentSupplyLog,
    loading,
    error,
    fetchSupplyLogs,
    fetchSupplyLog,
    createSupplyLog,
    updateSupplyLog,
    deleteSupplyLog,
  }
})
