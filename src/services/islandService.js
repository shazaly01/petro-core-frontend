import apiClient from './apiClient'

const resource = '/islands'

export default {
  // دالة جلب القائمة مع الترحيل والبحث
  get(page = 1, search = '') {
    return apiClient.get(resource, {
      params: {
        page: page,
        search: search,
      },
    })
  },

  // البحث بواسطة المعرف
  find(id) {
    return apiClient.get(`${resource}/${id}`)
  },

  // إنشاء جزيرة جديدة
  create(payload) {
    return apiClient.post(resource, payload)
  },

  // تحديث بيانات جزيرة
  update(id, payload) {
    return apiClient.put(`${resource}/${id}`, payload)
  },

  // حذف جزيرة
  delete(id) {
    return apiClient.delete(`${resource}/${id}`)
  },
}
