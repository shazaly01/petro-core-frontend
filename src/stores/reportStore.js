import { defineStore } from 'pinia'
import { ref } from 'vue'
import reportService from '@/services/reportService'

export const useReportStore = defineStore('report', () => {
  // --- State ---
  const dailyMovementData = ref([])
  const tankLedgerData = ref(null)
  const fuelReconciliationData = ref(null) // 🛑 1. حالة جديدة لبيانات ميزان حركة الوقود
  const loading = ref(false)
  const error = ref(null)
  const tanksStockData = ref(null)
  const shiftDetailsData = ref(null)

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
      throw err
    } finally {
      loading.value = false
    }
  }

  // 🛑 2. دالة جديدة لجلب تقرير ميزان حركة الوقود (المطابق للصورة)
  async function fetchFuelReconciliation(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await reportService.getFuelReconciliation(params)
      fuelReconciliationData.value = response.data
    } catch (err) {
      error.value = 'فشل في جلب نموذج حركة المبيعات اليومية.'
      console.error(err)
      fuelReconciliationData.value = null
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchTanksStockSummary() {
    loading.value = true
    error.value = null
    try {
      const response = await reportService.getTanksStockSummary()
      tanksStockData.value = response.data
    } catch (err) {
      error.value = 'فشل في جلب تقرير أرصدة الخزانات.'
      console.error(err)
      tanksStockData.value = null
    } finally {
      loading.value = false
    }
  }

  async function fetchShiftDetails(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await reportService.getShiftDetails(params)
      shiftDetailsData.value = response.data
    } catch (err) {
      error.value = 'فشل في جلب تقرير الورديات.'
      console.error(err)
      shiftDetailsData.value = null
    } finally {
      loading.value = false
    }
  }

  // --- Return public API ---
  return {
    dailyMovementData,
    tankLedgerData,
    fuelReconciliationData, // 🛑 تصدير الحالة
    loading,
    error,
    tanksStockData,
    shiftDetailsData,
    fetchDailyMovement,
    fetchTankLedger,
    fetchFuelReconciliation, // 🛑 تصدير الدالة
    fetchTanksStockSummary,
    fetchShiftDetails,
  }
})
