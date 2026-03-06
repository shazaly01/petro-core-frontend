<template>
  <div class="space-y-6">
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-section p-6 rounded-xl border border-surface-border shadow-sm"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <i class="pi pi-money-bill text-primary"></i>
          إدارة السندات المالية (حركة الصندوق)
        </h1>
        <p class="text-text-muted text-sm mt-1">
          تسجيل ومتابعة حركات الخزينة (إيداع، سحب، مصروف، تسوية).
        </p>
      </div>

      <button
        @click="showAddModal = true"
        class="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg shadow-md flex items-center gap-2 transition-all active:scale-95"
      >
        <i class="pi pi-plus"></i>
        <span>إضافة سند جديد</span>
      </button>
    </div>

    <div
      v-if="voucherStore.error"
      class="p-4 bg-red-50 border-r-4 border-red-500 text-red-700 rounded-md"
    >
      <div class="flex items-center gap-2">
        <i class="pi pi-exclamation-circle"></i>
        <span>{{ voucherStore.error }}</span>
      </div>
    </div>

    <VoucherTable
      :items="voucherStore.vouchers"
      :is-loading="voucherStore.loading"
      @delete="confirmDelete"
    />

    <div v-if="voucherStore.pagination?.total > 0" class="flex justify-center mt-4">
      <small class="text-text-muted">إجمالي العمليات: {{ voucherStore.pagination.total }}</small>
    </div>

    <VoucherModal :show="showAddModal" @close="showAddModal = false" @refresh="loadData" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 🛑 استيراد المتجر والمكونات الجديدة
import { useVoucherStore } from '@/stores/voucherStore'
import VoucherTable from './VoucherTable.vue'
import VoucherModal from './VoucherModal.vue'

// تهيئة المتجر
const voucherStore = useVoucherStore()

// حالة ظهور المودال
const showAddModal = ref(false)

/**
 * جلب البيانات عند تحميل الصفحة
 */
const loadData = async () => {
  await voucherStore.fetchVouchers()
}

/**
 * تأكيد الحذف
 */
const confirmDelete = async (id) => {
  // 🛑 تنبيه المستخدم بأنه سيتم عمل قيد عكسي
  if (
    confirm(
      'هل أنت متأكد من رغبتك في حذف هذا السند؟ سيقوم النظام بعمل قيد عكسي تلقائياً لتسوية الخزينة ولا يمكن التراجع عن ذلك.',
    )
  ) {
    try {
      await voucherStore.deleteVoucher(id)
      // التنبيه بنجاح الحذف (اختياري حسب نظام التنبيهات لديك)
    } catch (err) {
      alert('حدث خطأ أثناء محاولة الحذف.')
    }
  }
}

// البدء بجلب البيانات فور فتح الشاشة
onMounted(() => {
  loadData()
})
</script>

<style scoped>
/* إضافة لمسات جمالية بسيطة */
.bg-surface-section {
  background-color: var(--surface-section);
}
</style>
