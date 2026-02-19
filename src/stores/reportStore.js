import { defineStore } from 'pinia'
import { ref } from 'vue'
import reportService from '@/services/reportService'

export const useReportStore = defineStore('report', () => {
  // --- State ---
  const dailyMovementData = ref([]) // بيانات المخطط البياني أو الجدول
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---

  async function fetchDailyMovement(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await reportService.getDailyMovement(params)
      dailyMovementData.value = response.data // قد تحتاج لتعديل حسب هيكلية الرد (data.data أو data مباشر)
    } catch (err) {
      error.value = 'Failed to load daily movement report.'
      console.error(err)
      dailyMovementData.value = []
    } finally {
      loading.value = false
    }
  }

  // --- Return public API ---
  return {
    dailyMovementData,
    loading,
    error,
    fetchDailyMovement,
  }
})
