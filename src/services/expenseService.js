import apiClient from './apiClient'

export default {
  // جلب كافة المصروفات (مع دعم الترقيم والبحث)
  get(page = 1) {
    return apiClient.get('/expenses', { params: { page } })
  },

  // جلب مصروف محدد
  find(id) {
    return apiClient.get(`/expenses/${id}`)
  },

  // إضافة مصروف جديد
  create(payload) {
    return apiClient.post('/expenses', payload)
  },

  // تحديث مصروف
  update(id, payload) {
    return apiClient.put(`/expenses/${id}`, payload)
  },

  // حذف مصروف
  delete(id) {
    return apiClient.delete(`/expenses/${id}`)
  },
}
