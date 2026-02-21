// src/services/reportService.js
import apiClient from './apiClient'

export default {
  getTankLedger(params) {
    return apiClient.get('/reports/tank-ledger', { params })
  },

  // 2. 🛑 الدالة الناقصة: جلب تقرير الحركة اليومية
  getDailyMovement(params) {
    return apiClient.get('/reports/daily-movement', { params })
  },
}
