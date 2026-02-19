import { defineStore } from 'pinia'
import { ref } from 'vue'
import transactionService from '@/services/transactionService'

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref([])
  const pagination = ref({})
  const currentTransaction = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchTransactions(page = 1, search = '') {
    loading.value = true
    error.value = null
    try {
      const response = await transactionService.get(page, search)
      transactions.value = response.data.data
      pagination.value = response.data.meta
    } catch (err) {
      error.value = 'Failed to fetch transactions.'
      console.error(err)
      transactions.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchTransaction(id) {
    loading.value = true
    error.value = null
    currentTransaction.value = null
    try {
      const response = await transactionService.find(id)
      currentTransaction.value = response.data.data
    } catch (err) {
      error.value = 'Failed to fetch transaction.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function createTransaction(payload) {
    loading.value = true
    error.value = null
    try {
      await transactionService.create(payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create transaction.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateTransaction(id, payload) {
    loading.value = true
    error.value = null
    try {
      await transactionService.update(id, payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update transaction.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteTransaction(id) {
    loading.value = true
    error.value = null
    try {
      await transactionService.delete(id)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete transaction.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    transactions,
    pagination,
    currentTransaction,
    loading,
    error,
    fetchTransactions,
    fetchTransaction,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  }
})
