import { defineStore } from 'pinia'
import { ref } from 'vue'
import reportService from '@/services/reportService'

export const useReportStore = defineStore('report', () => {
  // --- State ---
  const dailyMovementData = ref([])
  const tankLedgerData = ref(null) // 🛑 1. حالة جديدة لبيانات كشف الخزان
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---

  async function fetchDailyMovement(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await reportService.getDailyMovement(params)
      dailyMovementData.value = response.data
    } catch (err) {
      error.value = 'Failed to load daily movement report.'
      console.error(err)
      dailyMovementData.value = []
    } finally {
      loading.value = false
    }
  }

  // 🛑 2. دالة جديدة لجلب كشف حساب الخزان
  async function fetchTankLedger(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await reportService.getTankLedger(params)
      tankLedgerData.value = response.data
    } catch (err) {
      error.value = 'فشل في جلب كشف حساب الخزان.'
      console.error(err)
      tankLedgerData.value = null
      throw err // نرمي الخطأ لكي نعالجه في الشاشة (مثلاً لإظهار رسالة للمستخدم)
    } finally {
      loading.value = false
    }
  }

  // --- Return public API ---
  return {
    dailyMovementData,
    tankLedgerData, // 🛑 تصدير الحالة
    loading,
    error,
    fetchDailyMovement,
    fetchTankLedger, // 🛑 تصدير الدالة
  }
})
