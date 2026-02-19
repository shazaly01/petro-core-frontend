import apiClient from './apiClient'

// تم تحديد المسار بناءً على routes/api.php
const resource = '/fuel-types'

export default {
  // دالة جلب القائمة مع الترحيل (Pagination) والبحث (Search)
  get(page = 1, search = '') {
    return apiClient.get(resource, {
      params: {
        page: page,
        search: search, // يتم تمرير معامل البحث كما هو في المشروع القديم
      },
    })
  },

  // دالة البحث عن عنصر واحد بواسطة المعرف (ID)
  find(id) {
    return apiClient.get(`${resource}/${id}`)
  },

  // دالة إنشاء عنصر جديد
  create(payload) {
    return apiClient.post(resource, payload)
  },

  // دالة تحديث عنصر موجود
  update(id, payload) {
    return apiClient.put(`${resource}/${id}`, payload)
  },

  // دالة حذف عنصر
  delete(id) {
    return apiClient.delete(`${resource}/${id}`)
  },
}
