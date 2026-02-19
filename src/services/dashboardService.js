import apiClient from './apiClient'

export default {
  // جلب الإحصائيات العامة (عدادات، مبالغ إجمالية، إلخ)
  getStats() {
    return apiClient.get('/dashboard/stats')
  },
}
