import apiClient from './apiClient'

// تم تحديد المسار بناءً على routes/api.php
const resource = '/pumps'

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

  // إنشاء مضخة جديدة
  create(payload) {
    return apiClient.post(resource, payload)
  },

  // تحديث بيانات مضخة
  update(id, payload) {
    return apiClient.put(`${resource}/${id}`, payload)
  },

  // حذف مضخة
  delete(id) {
    return apiClient.delete(`${resource}/${id}`)
  },
}
