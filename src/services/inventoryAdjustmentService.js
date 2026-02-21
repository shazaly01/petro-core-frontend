import apiClient from './apiClient'

// تم تحديد المسار بناءً على المسار الجديد في routes/api.php
const resource = '/inventory-adjustments'

export default {
  /**
   * جلب قائمة التسويات الجردية
   * تدعم الترحيل (Pagination) والبحث
   */
  get(page = 1, search = '') {
    return apiClient.get(resource, {
      params: {
        page: page,
        search: search,
      },
    })
  },

  /**
   * جلب تفاصيل تسوية جردية معينة بواسطة المعرف
   */
  find(id) {
    return apiClient.get(`${resource}/${id}`)
  },

  /**
   * تنفيذ تسوية جردية جديدة (الجرد الفعلي للخزان)
   * payload: { tank_id, actual_stock, reason }
   */
  create(payload) {
    return apiClient.post(resource, payload)
  },

  /**
   * تحديث بيانات تسوية (للمدير فقط)
   * ملاحظة: التعديل سيعيد حساب الأرصدة في الباك-إند
   */
  update(id, payload) {
    return apiClient.put(`${resource}/${id}`, payload)
  },

  /**
   * حذف تسوية جردية وإلغاء تأثيرها على الخزان
   */
  delete(id) {
    return apiClient.delete(`${resource}/${id}`)
  },
}
