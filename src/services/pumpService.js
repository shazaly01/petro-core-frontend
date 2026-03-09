import apiClient from './apiClient'

const resource = '/pumps'

export default {
  // 🛑 التعديل: إضافة `available` كمعامل اختياري
  get(page = 1, search = '', available = null) {
    const params = {
      page: page,
      search: search,
    }

    // إذا تم طلب المضخات المتاحة فقط، نضيفها للطلب
    if (available) {
      params.available = available
    }

    return apiClient.get(resource, { params })
  },

  find(id) {
    return apiClient.get(`${resource}/${id}`)
  },

  create(payload) {
    return apiClient.post(resource, payload)
  },

  update(id, payload) {
    return apiClient.put(`${resource}/${id}`, payload)
  },

  delete(id) {
    return apiClient.delete(`${resource}/${id}`)
  },
}
