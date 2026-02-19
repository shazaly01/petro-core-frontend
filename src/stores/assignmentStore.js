import { defineStore } from 'pinia'
import { ref } from 'vue'
import assignmentService from '@/services/assignmentService'

export const useAssignmentStore = defineStore('assignment', () => {
  const assignments = ref([])
  const pagination = ref({})
  const currentAssignment = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchAssignments(page = 1, search = '') {
    loading.value = true
    error.value = null
    try {
      const response = await assignmentService.get(page, search)
      assignments.value = response.data.data
      pagination.value = response.data.meta
    } catch (err) {
      error.value = 'Failed to fetch assignments.'
      console.error(err)
      assignments.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchAssignment(id) {
    loading.value = true
    error.value = null
    currentAssignment.value = null
    try {
      const response = await assignmentService.find(id)
      currentAssignment.value = response.data.data
    } catch (err) {
      error.value = 'Failed to fetch assignment.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function createAssignment(payload) {
    loading.value = true
    error.value = null
    try {
      await assignmentService.create(payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create assignment.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateAssignment(id, payload) {
    loading.value = true
    error.value = null
    try {
      await assignmentService.update(id, payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update assignment.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteAssignment(id) {
    loading.value = true
    error.value = null
    try {
      await assignmentService.delete(id)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete assignment.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    assignments,
    pagination,
    currentAssignment,
    loading,
    error,
    fetchAssignments,
    fetchAssignment,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  }
})
