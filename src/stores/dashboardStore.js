import { defineStore } from 'pinia'
import { ref } from 'vue'
import dashboardService from '@/services/dashboardService'

export const useDashboardStore = defineStore('dashboard', () => {
  // --- State ---
  const stats = ref({}) // كائن لتخزين الإحصائيات
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---

  async function fetchStats() {
    loading.value = true
    error.value = null
    try {
      const response = await dashboardService.getStats()
      stats.value = response.data // نفترض أن البيانات تأتي مباشرة أو داخل data
    } catch (err) {
      error.value = 'Failed to load dashboard statistics.'
      console.error(err)
      stats.value = {}
    } finally {
      loading.value = false
    }
  }

  // --- Return public API ---
  return {
    stats,
    loading,
    error,
    fetchStats,
  }
})
