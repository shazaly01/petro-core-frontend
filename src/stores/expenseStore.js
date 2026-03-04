import { defineStore } from 'pinia'
import { ref } from 'vue'
import expenseService from '@/services/expenseService'

export const useExpenseStore = defineStore('expense', () => {
  const expenses = ref([])
  const pagination = ref({})
  const currentExpense = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const validationErrors = ref({}) // 🛑 لتخزين أخطاء الحقول المحددة

  async function fetchExpenses(page = 1) {
    loading.value = true
    error.value = null
    try {
      const response = await expenseService.get(page)
      expenses.value = response.data.data
      pagination.value = response.data.meta
    } catch (err) {
      error.value = 'فشل في جلب قائمة المصروفات.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function createExpense(payload) {
    loading.value = true
    error.value = null
    validationErrors.value = {} // تصغير الأخطاء السابقة
    try {
      await expenseService.create(payload)
      await fetchExpenses() // تحديث القائمة فوراً بعد الإضافة
    } catch (err) {
      if (err.response?.status === 422) {
        // إذا كان خطأ تحقق (مثل مبلغ مفقود أو لا توجد وردية مفتوحة)
        validationErrors.value = err.response.data.errors || {}
        error.value = err.response.data.message // الرسالة العامة
      } else {
        error.value = 'حدث خطأ أثناء حفظ المصروف.'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteExpense(id) {
    loading.value = true
    try {
      await expenseService.delete(id)
      await fetchExpenses()
    } catch (err) {
      error.value = 'فشل في حذف المصروف.'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    expenses,
    pagination,
    currentExpense,
    loading,
    error,
    validationErrors,
    fetchExpenses,
    createExpense,
    deleteExpense,
  }
})
