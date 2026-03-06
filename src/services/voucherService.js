import apiClient from './apiClient'

export default {
  // جلب كافة السندات (مع دعم الترقيم)
  get(page = 1) {
    return apiClient.get('/vouchers', { params: { page } })
  },

  // جلب سند محدد
  find(id) {
    return apiClient.get(`/vouchers/${id}`)
  },

  // إضافة سند جديد (إيداع، مصروف، تحويل، تسوية)
  create(payload) {
    return apiClient.post('/vouchers', payload)
  },

  // تحديث سند
  update(id, payload) {
    return apiClient.put(`/vouchers/${id}`, payload)
  },

  // حذف سند
  delete(id) {
    return apiClient.delete(`/vouchers/${id}`)
  },
}
