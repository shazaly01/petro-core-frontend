import apiClient from './apiClient'

export default {
  // جلب تقرير الحركة اليومية
  // نقبل كائن params لتمرير تواريخ البداية والنهاية (startDate, endDate) إذا لزم الأمر
  getDailyMovement(params = {}) {
    return apiClient.get('/reports/daily-movement', {
      params: params,
    })
  },
}
