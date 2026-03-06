import { defineStore } from 'pinia'
import { ref } from 'vue'
import voucherService from '@/services/voucherService' // 🛑 تأكد من تحديث مسار الاستيراد

export const useVoucherStore = defineStore('voucher', () => {
  // 🛑 تغيير المسميات إلى vouchers
  const vouchers = ref([])
  const pagination = ref({})
  const currentVoucher = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const validationErrors = ref({})

  async function fetchVouchers(page = 1) {
    loading.value = true
    error.value = null
    try {
      const response = await voucherService.get(page)
      vouchers.value = response.data.data
      pagination.value = response.data.meta
    } catch (err) {
      error.value = 'فشل في جلب قائمة السندات.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function createVoucher(payload) {
    loading.value = true
    error.value = null
    validationErrors.value = {}
    try {
      await voucherService.create(payload)
      await fetchVouchers() // تحديث القائمة فوراً بعد الإضافة
    } catch (err) {
      if (err.response?.status === 422) {
        // إذا كان خطأ تحقق (مثل مبلغ مفقود أو لا توجد وردية مفتوحة)
        validationErrors.value = err.response.data.errors || {}
        error.value = err.response.data.message
      } else {
        error.value = 'حدث خطأ أثناء حفظ السند.'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteVoucher(id) {
    loading.value = true
    try {
      await voucherService.delete(id)
      await fetchVouchers()
    } catch (err) {
      error.value = 'فشل في حذف السند.'
      throw err
    } finally {
      loading.value = false
    }
  }

  // يمكنك إضافة دالة updateVoucher هنا بنفس النمط إذا كنت تحتاجها في الواجهة
  async function updateVoucher(id, payload) {
    loading.value = true
    error.value = null
    validationErrors.value = {}
    try {
      await voucherService.update(id, payload)
      await fetchVouchers()
    } catch (err) {
      if (err.response?.status === 422) {
        validationErrors.value = err.response.data.errors || {}
        error.value = err.response.data.message
      } else {
        error.value = 'حدث خطأ أثناء تعديل السند.'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    vouchers,
    pagination,
    currentVoucher,
    loading,
    error,
    validationErrors,
    fetchVouchers,
    createVoucher,
    updateVoucher,
    deleteVoucher,
  }
})
