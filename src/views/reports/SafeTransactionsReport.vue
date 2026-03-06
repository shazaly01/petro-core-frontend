<template>
  <div class="p-6 space-y-6 bg-gray-50 dark:bg-surface-ground min-h-screen">
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-surface-section p-4 rounded-xl border border-surface-border shadow-sm"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <i class="pi pi-building-columns text-primary"></i>
          تقرير حركة الخزينة (الصندوق)
        </h1>
        <p class="text-sm text-text-muted mt-1">
          مراقبة الرصيد الحالي، الإيداعات، المصروفات، والتوريدات البنكية.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <select
          v-model="filters.type"
          class="form-select rounded-md border-gray-300 dark:bg-surface-ground dark:border-surface-border dark:text-white text-sm"
        >
          <option value="">جميع الحركات</option>
          <option value="deposit">إيداعات فقط (+)</option>
          <option value="expense">مصروفات فقط (-)</option>
          <option value="withdrawal">مسحوبات/توريد بنكي (-)</option>
          <option value="settlement">تسويات جردية</option>
        </select>

        <div class="flex items-center gap-2">
          <input
            type="date"
            v-model="filters.start_date"
            class="form-input rounded-md border-gray-300 dark:bg-surface-ground dark:border-surface-border dark:text-white text-sm"
          />
          <span class="text-gray-500">-</span>
          <input
            type="date"
            v-model="filters.end_date"
            class="form-input rounded-md border-gray-300 dark:bg-surface-ground dark:border-surface-border dark:text-white text-sm"
          />
        </div>

        <div class="flex gap-2">
          <AppButton
            @click="fetchReport"
            variant="primary"
            :disabled="loading"
            class="whitespace-nowrap"
          >
            <span
              v-if="loading"
              class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full ml-2"
            ></span>
            تحديث
          </AppButton>

          <AppButton
            v-if="reportData"
            @click="printReport"
            variant="secondary"
            class="whitespace-nowrap"
          >
            <i class="pi pi-print ml-2"></i>
            طباعة
          </AppButton>
        </div>
      </div>
    </div>

    <div v-if="loading && !reportData" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <div v-if="reportData && !loading" class="space-y-6">
      <div
        class="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-6 shadow-lg text-white flex flex-col md:flex-row items-center justify-between"
      >
        <div class="flex items-center gap-4">
          <div class="p-4 bg-white/20 rounded-full backdrop-blur-sm">
            <i class="pi pi-wallet text-4xl"></i>
          </div>
          <div>
            <p class="text-white/80 font-medium mb-1">الرصيد الفعلي الحالي في الخزينة</p>
            <h2 class="text-4xl font-black" dir="ltr">
              {{ formatCurrency(reportData.current_safe_balance) }}
            </h2>
          </div>
        </div>
        <div class="mt-4 md:mt-0 text-right bg-black/20 p-3 rounded-lg backdrop-blur-sm">
          <p class="text-sm text-white/80 mb-1">تاريخ التقرير المفلتر</p>
          <p class="font-bold">{{ reportData.date_range }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          class="bg-white dark:bg-surface-section p-5 rounded-xl border-t-4 border-green-500 shadow-sm"
        >
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">إجمالي الإيداعات (+)</p>
          <p class="text-2xl font-bold text-green-600 mt-2" dir="ltr">
            {{ formatCurrency(reportData.summary.total_deposits) }}
          </p>
        </div>

        <div
          class="bg-white dark:bg-surface-section p-5 rounded-xl border-t-4 border-orange-500 shadow-sm"
        >
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">إجمالي المصروفات (-)</p>
          <p class="text-2xl font-bold text-orange-600 mt-2" dir="ltr">
            {{ formatCurrency(reportData.summary.total_expenses) }}
          </p>
        </div>

        <div
          class="bg-white dark:bg-surface-section p-5 rounded-xl border-t-4 border-red-500 shadow-sm"
        >
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">مسحوبات/توريد بنك (-)</p>
          <p class="text-2xl font-bold text-red-600 mt-2" dir="ltr">
            {{ formatCurrency(reportData.summary.total_withdrawals) }}
          </p>
        </div>

        <div
          class="bg-white dark:bg-surface-section p-5 rounded-xl border-t-4 border-purple-500 shadow-sm"
        >
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
            إجمالي التسويات الجردية
          </p>
          <p class="text-2xl font-bold text-purple-600 mt-2" dir="ltr">
            {{ formatCurrency(reportData.summary.total_settlements) }}
          </p>
        </div>
      </div>

      <div
        class="bg-white dark:bg-surface-section rounded-xl border border-surface-border shadow-sm overflow-hidden"
      >
        <div
          class="bg-gray-50 dark:bg-gray-800/50 p-4 border-b border-surface-border flex justify-between items-center"
        >
          <h3 class="font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <i class="pi pi-list text-primary"></i>
            سجل حركات الخزينة للفترة المحددة ({{ reportData.summary.transactions_count }} حركة)
          </h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800/30">
              <tr>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500">رقم السند</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500">نوع الحركة</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500">البيان</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500">
                  الوردية/المشرف
                </th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500">التاريخ</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500">المبلغ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="voucher in reportData.vouchers"
                :key="voucher.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-800/20"
              >
                <td class="px-4 py-3 text-sm font-mono text-gray-600 dark:text-gray-400">
                  #{{ voucher.voucher_no }}
                </td>
                <td class="px-4 py-3 text-sm">
                  <span
                    :class="getTypeBadgeClass(voucher.type)"
                    class="px-2 py-1 rounded-md text-xs font-medium"
                  >
                    {{ voucher.type_ar }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  {{ voucher.description || '---' }}
                </td>
                <td class="px-4 py-3 text-xs text-gray-500">
                  <div class="font-medium text-gray-800 dark:text-gray-300">
                    {{ voucher.shift_name }}
                  </div>
                  <div>{{ voucher.user_name }}</div>
                </td>
                <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300" dir="ltr">
                  {{ voucher.date }}
                </td>
                <td
                  class="px-4 py-3 text-sm font-bold text-right"
                  :class="getAmountColor(voucher.type)"
                  dir="ltr"
                >
                  {{ voucher.type === 'deposit' ? '+' : '-' }} {{ formatCurrency(voucher.amount) }}
                </td>
              </tr>
              <tr v-if="!reportData.vouchers || reportData.vouchers.length === 0">
                <td colspan="6" class="px-4 py-8 text-center text-gray-500">
                  لا توجد حركات مطابقة للبحث.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useReportStore } from '@/stores/reportStore'
import { useRouter } from 'vue-router' // 🛑 إضافة الروتر للطباعة
import AppButton from '@/components/ui/AppButton.vue'

const reportStore = useReportStore()
const router = useRouter()
const today = new Date().toISOString().split('T')[0]

// فلاتر البحث
const filters = reactive({
  start_date: today,
  end_date: today,
  type: '',
})

const loading = computed(() => reportStore.loading)
const reportData = computed(() => reportStore.safeTransactionsData)

const fetchReport = async () => {
  try {
    const params = { start_date: filters.start_date, end_date: filters.end_date }
    if (filters.type) params.type = filters.type
    await reportStore.fetchSafeTransactions(params)
  } catch (error) {
    alert('حدث خطأ أثناء جلب تقرير الخزينة.')
  }
}

// 🛑 دالة الطباعة
const printReport = () => {
  if (!reportData.value) return

  // حفظ البيانات في الجلسة لصفحة الطباعة
  sessionStorage.setItem('safeTransactionsPrintData', JSON.stringify(reportData.value))

  // فتح صفحة الطباعة في نافذة جديدة
  const routeData = router.resolve({ name: 'PrintSafeTransactions' })
  window.open(routeData.href, '_blank')
}

onMounted(() => {
  fetchReport()
})

const formatCurrency = (val) => {
  const number = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  }).format(val || 0)
  return `${number} LYD`
}

const getTypeBadgeClass = (type) => {
  switch (type) {
    case 'deposit':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    case 'expense':
      return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
    case 'withdrawal':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    case 'settlement':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  }
}

const getAmountColor = (type) => {
  if (type === 'deposit') return 'text-green-600 dark:text-green-400'
  if (type === 'expense') return 'text-orange-600 dark:text-orange-400'
  if (type === 'withdrawal') return 'text-red-600 dark:text-red-400'
  return 'text-purple-600 dark:text-purple-400'
}
</script>
