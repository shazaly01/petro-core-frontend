<template>
  <div class="space-y-6">
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-section p-6 rounded-xl border border-surface-border shadow-sm"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <i class="pi pi-wallet text-primary"></i>
          إدارة مصروفات المحطة
        </h1>
        <p class="text-text-muted text-sm mt-1">
          تسجيل ومتابعة المصروفات المرتبطة بالوردية الحالية.
        </p>
      </div>

      <button
        @click="showAddModal = true"
        class="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg shadow-md flex items-center gap-2 transition-all active:scale-95"
      >
        <i class="pi pi-plus"></i>
        <span>إضافة مصروف جديد</span>
      </button>
    </div>

    <div
      v-if="expenseStore.error"
      class="p-4 bg-red-50 border-r-4 border-red-500 text-red-700 rounded-md"
    >
      <div class="flex items-center gap-2">
        <i class="pi pi-exclamation-circle"></i>
        <span>{{ expenseStore.error }}</span>
      </div>
    </div>

    <ExpenseTable
      :items="expenseStore.expenses"
      :is-loading="expenseStore.loading"
      @delete="confirmDelete"
    />

    <div v-if="expenseStore.pagination?.total > 0" class="flex justify-center mt-4">
      <small class="text-text-muted">إجمالي العمليات: {{ expenseStore.pagination.total }}</small>
    </div>

    <ExpenseModel :show="showAddModal" @close="showAddModal = false" @refresh="loadData" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useExpenseStore } from '@/stores/expenseStore'
import ExpenseTable from './ExpenseTable.vue'
import ExpenseModel from './ExpenseModel.vue'

// تهيئة المتجر
const expenseStore = useExpenseStore()

// حالة ظهور المودال
const showAddModal = ref(false)

/**
 * جلب البيانات عند تحميل الصفحة
 */
const loadData = async () => {
  await expenseStore.fetchExpenses()
}

/**
 * تأكيد الحذف
 */
const confirmDelete = async (id) => {
  if (confirm('هل أنت متأكد من رغبتك في حذف هذا المصروف؟ لا يمكن التراجع عن هذه العملية.')) {
    try {
      await expenseStore.deleteExpense(id)
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
