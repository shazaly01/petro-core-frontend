<template>
  <div class="p-6 space-y-6 bg-gray-50 dark:bg-surface-ground min-h-screen print-container">
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print bg-white dark:bg-surface-section p-4 rounded-xl border border-surface-border shadow-sm"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white font-display">
          تقرير الحركة اليومية للمحطة
        </h1>
        <p class="text-sm text-text-muted mt-1">
          ملخص المبيعات، المحصلة المالية، التوريدات، وحالة الخزانات.
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
        <div class="w-full sm:w-auto flex items-center gap-2">
          <label class="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">من:</label>
          <input
            type="date"
            v-model="startDate"
            class="form-input w-full rounded-md border-gray-300 dark:bg-surface-ground dark:border-surface-border dark:text-white focus:ring-primary focus:border-primary"
          />

          <label class="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap ml-2"
            >إلى:</label
          >
          <input
            type="date"
            v-model="endDate"
            class="form-input w-full rounded-md border-gray-300 dark:bg-surface-ground dark:border-surface-border dark:text-white focus:ring-primary focus:border-primary"
          />
        </div>
        <AppButton
          @click="fetchReport"
          variant="primary"
          :disabled="loading"
          class="w-full sm:w-auto whitespace-nowrap"
        >
          <span
            v-if="loading"
            class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full ml-2"
          ></span>
          تحديث البيانات
        </AppButton>
        <AppButton
          v-if="reportData"
          @click="printReport"
          variant="secondary"
          class="w-full sm:w-auto whitespace-nowrap"
        >
          <PrinterIcon class="h-5 w-5 ml-2" />
          طباعة التقرير
        </AppButton>
      </div>
    </div>

    <div v-if="loading && !reportData" class="flex justify-center py-20 no-print">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <div v-if="reportData && !loading" class="space-y-6">
      <div class="hidden print-header text-center mb-8 border-b-2 border-gray-800 pb-4">
        <h2 class="text-3xl font-bold">تقرير الحركة اليومية لمحطة الوقود</h2>
        <p class="text-lg mt-2 text-gray-600">
          تاريخ التقرير: <span dir="ltr" class="font-bold">{{ reportData.date }}</span>
        </p>
      </div>

      <div>
        <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
          <BanknotesIcon class="h-6 w-6 ml-2 text-primary" />
          الملخص المالي لورديات اليوم (المغلقة)
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div
            class="bg-white dark:bg-surface-section p-5 rounded-xl border-l-4 border-blue-500 shadow-sm"
          >
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
              إجمالي المبيعات (نظام)
            </p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-2" dir="ltr">
              {{ formatCurrency(reportData.financial_summary?.total_expected) }}
            </p>
          </div>

          <div
            class="bg-white dark:bg-surface-section p-5 rounded-xl border-l-4 border-green-500 shadow-sm"
          >
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">النقد المحصل (Cash)</p>
            <p class="text-2xl font-bold text-green-600 dark:text-green-400 mt-2" dir="ltr">
              {{ formatCurrency(reportData.financial_summary?.total_cash) }}
            </p>
          </div>

          <div
            class="bg-white dark:bg-surface-section p-5 rounded-xl border-l-4 border-purple-500 shadow-sm"
          >
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
              الدفع البنكي (Bank/POS)
            </p>
            <p class="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2" dir="ltr">
              {{ formatCurrency(reportData.financial_summary?.total_bank) }}
            </p>
          </div>

          <div
            class="bg-white dark:bg-surface-section p-5 rounded-xl border-l-4 border-orange-500 shadow-sm"
          >
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">إجمالي المصروفات</p>
            <p class="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-2" dir="ltr">
              {{ formatCurrency(reportData.financial_summary?.total_expenses) }}
            </p>
          </div>

          <div
            class="bg-white dark:bg-surface-section p-5 rounded-xl border-l-4 shadow-sm"
            :class="
              reportData.financial_summary?.total_difference >= 0
                ? 'border-green-500'
                : 'border-red-500'
            "
          >
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">الصافي (عجز / زيادة)</p>
            <p
              class="text-2xl font-bold mt-2"
              dir="ltr"
              :class="
                reportData.financial_summary?.total_difference >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              "
            >
              <span v-if="reportData.financial_summary?.total_difference > 0">+</span>
              {{ formatCurrency(reportData.financial_summary?.total_difference) }}
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          class="bg-white dark:bg-surface-section rounded-xl border border-surface-border shadow-sm overflow-hidden"
        >
          <div
            class="bg-gray-50 dark:bg-gray-800/50 p-4 border-b border-surface-border flex items-center"
          >
            <FireIcon class="h-6 w-6 ml-2 text-orange-500" />
            <h3 class="font-bold text-gray-800 dark:text-white">تفصيل المبيعات حسب نوع الوقود</h3>
          </div>
          <div class="p-0">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-800/30">
                <tr>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    نوع الوقود
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    الكمية المباعة (لتر)
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    المبلغ الإجمالي
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr
                  v-for="(data, fuelName) in reportData.sales_by_fuel"
                  :key="fuelName"
                  class="hover:bg-gray-50 dark:hover:bg-gray-800/20"
                >
                  <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    {{ fuelName }}
                  </td>
                  <td
                    class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 font-bold"
                    dir="ltr"
                  >
                    {{ formatNumber(data.liters) }} L
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300" dir="ltr">
                    {{ formatCurrency(data.amount) }}
                  </td>
                </tr>
                <tr v-if="Object.keys(reportData.sales_by_fuel || {}).length === 0">
                  <td colspan="3" class="px-4 py-6 text-center text-gray-500">
                    لا توجد مبيعات مسجلة في هذا اليوم.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div
          class="bg-white dark:bg-surface-section rounded-xl border border-surface-border shadow-sm overflow-hidden"
        >
          <div
            class="bg-gray-50 dark:bg-gray-800/50 p-4 border-b border-surface-border flex items-center"
          >
            <ArrowDownTrayIcon class="h-6 w-6 ml-2 text-blue-500" />
            <h3 class="font-bold text-gray-800 dark:text-white">التوريدات الواردة للمحطة</h3>
          </div>
          <div class="p-0">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-800/30">
                <tr>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    نوع الوقود
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    إجمالي الكمية الموردة (لتر)
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr
                  v-for="(liters, fuelName) in reportData.supplies_by_fuel"
                  :key="'sup' + fuelName"
                  class="hover:bg-gray-50 dark:hover:bg-gray-800/20"
                >
                  <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    {{ fuelName }}
                  </td>
                  <td
                    class="px-4 py-3 text-sm text-blue-600 dark:text-blue-400 font-bold"
                    dir="ltr"
                  >
                    + {{ formatNumber(liters) }} L
                  </td>
                </tr>
                <tr v-if="Object.keys(reportData.supplies_by_fuel || {}).length === 0">
                  <td colspan="2" class="px-4 py-6 text-center text-gray-500">
                    لم يتم استلام أي توريدات في هذا اليوم.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div>
        <div
          class="bg-white dark:bg-surface-section rounded-xl border border-surface-border shadow-sm overflow-hidden"
        >
          <div
            class="bg-gray-50 dark:bg-gray-800/50 p-4 border-b border-surface-border flex items-center"
          >
            <BanknotesIcon class="h-6 w-6 ml-2 text-orange-500" />
            <h3 class="font-bold text-gray-800 dark:text-white">تفصيل المصروفات</h3>
          </div>
          <div class="p-0 overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-800/30">
                <tr>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    البيان (الوصف)
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    الوردية
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    الوقت
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    المبلغ
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr
                  v-for="expense in reportData.expenses_list"
                  :key="expense.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-800/20"
                >
                  <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                    {{ expense.description || 'بدون بيان' }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {{ expense.shift_name }}
                  </td>
                  <td
                    class="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 text-right"
                    dir="ltr"
                  >
                    {{ expense.spent_at }}
                  </td>
                  <td
                    class="px-4 py-3 text-sm text-orange-600 dark:text-orange-400 font-bold text-right"
                    dir="ltr"
                  >
                    {{ formatCurrency(expense.amount) }}
                  </td>
                </tr>
                <tr v-if="!reportData.expenses_list || reportData.expenses_list.length === 0">
                  <td colspan="4" class="px-4 py-6 text-center text-gray-500">
                    لا توجد مصروفات مسجلة في هذه الفترة.
                  </td>
                </tr>
              </tbody>
              <tfoot
                v-if="reportData.expenses_list && reportData.expenses_list.length > 0"
                class="bg-gray-50 dark:bg-gray-800/50 border-t-2 border-gray-200 dark:border-gray-600"
              >
                <tr>
                  <td
                    colspan="3"
                    class="px-4 py-4 text-sm font-bold text-gray-900 dark:text-white text-left"
                  >
                    إجمالي المصروفات:
                  </td>
                  <td
                    class="px-4 py-4 text-lg font-black text-orange-600 dark:text-orange-400 text-right"
                    dir="ltr"
                  >
                    {{ formatCurrency(reportData.financial_summary?.total_expenses) }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
      <div>
        <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
          <BeakerIcon class="h-6 w-6 ml-2 text-teal-500" />
          حالة الخزانات في نهاية اليوم
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="tank in reportData.tanks_status"
            :key="tank.id"
            class="bg-white dark:bg-surface-section p-5 rounded-xl border border-surface-border shadow-sm"
          >
            <div class="flex justify-between items-start mb-2">
              <div>
                <h4 class="font-bold text-gray-900 dark:text-white">{{ tank.name }}</h4>
                <span class="text-xs text-teal-600 dark:text-teal-400">{{ tank.fuel_type }}</span>
              </div>
              <div class="text-right">
                <p class="text-lg font-black text-gray-800 dark:text-gray-200" dir="ltr">
                  {{ formatNumber(tank.current_stock) }} L
                </p>
                <p class="text-xs text-gray-500" dir="ltr">
                  Max: {{ formatNumber(tank.capacity) }} L
                </p>
              </div>
            </div>

            <div class="mt-4">
              <div class="flex justify-between text-xs mb-1 font-medium">
                <span class="text-gray-500">ممتلئ بنسبة</span>
                <span :class="getFillColorText(tank.fill_percentage)" dir="ltr"
                  >{{ tank.fill_percentage }}%</span
                >
              </div>
              <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                <div
                  class="h-2.5 rounded-full transition-all duration-500"
                  :class="getFillColorBg(tank.fill_percentage)"
                  :style="{ width: `${Math.min(tank.fill_percentage, 100)}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="hidden print-footer mt-12 pt-4 border-t border-gray-300 text-sm text-gray-500 flex justify-between"
      >
        <span>توقيع المدير: ___________________</span>
        <span dir="ltr">تاريخ الطباعة: {{ new Date().toLocaleString() }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useReportStore } from '@/stores/reportStore'
import AppButton from '@/components/ui/AppButton.vue'
import { useRouter } from 'vue-router'
import {
  PrinterIcon,
  BanknotesIcon,
  FireIcon,
  ArrowDownTrayIcon,
  BeakerIcon,
} from '@heroicons/vue/24/outline'

// تهيئة الـ Store
const reportStore = useReportStore()
const router = useRouter()
// تعيين تاريخ اليوم افتراضياً
const today = new Date().toISOString().split('T')[0]
const startDate = ref(today)
const endDate = ref(today)

// ربط حالة التحميل والبيانات بالـ Store مباشرة
const loading = computed(() => reportStore.loading)
const reportData = computed(() => reportStore.dailyMovementData)

// دالة جلب التقرير
const fetchReport = async () => {
  try {
    await reportStore.fetchDailyMovement({
      start_date: startDate.value,
      end_date: endDate.value,
    })
  } catch (error) {
    alert('حدث خطأ أثناء جلب التقرير.')
  }
}

// جلب التقرير التلقائي لليوم الحالي عند فتح الصفحة
onMounted(() => {
  fetchReport()
})

// دوال تنسيق الأرقام والعملات
const formatNumber = (val) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(val || 0)
}

const formatCurrency = (val) => {
  const number = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  }).format(val || 0)
  return `${number} LYD`
}

// تحديد ألوان شريط تقدم الخزان بناءً على النسبة
const getFillColorBg = (percentage) => {
  if (percentage < 15) return 'bg-red-500' // خطر: على وشك النفاد
  if (percentage < 35) return 'bg-yellow-400' // تنبيه
  return 'bg-teal-500' // آمن وممتلئ
}

const getFillColorText = (percentage) => {
  if (percentage < 15) return 'text-red-600 dark:text-red-400'
  if (percentage < 35) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-teal-600 dark:text-teal-400'
}

// دالة الطباعة
const printReport = () => {
  if (!reportData.value) return

  // 1. حفظ البيانات الحالية في الجلسة لتقرأها صفحة الطباعة
  sessionStorage.setItem('dailyMovementPrintData', JSON.stringify(reportData.value))

  // 2. فتح صفحة الطباعة في نافذة/علامة تبويب جديدة
  const routeData = router.resolve({ name: 'PrintDailyMovement' })
  window.open(routeData.href, '_blank')
}
</script>

<style scoped>
@media print {
  body {
    background-color: white !important;
  }
  .print-container {
    padding: 0 !important;
    background-color: white !important;
  }
  .no-print {
    display: none !important;
  }
  .print-header,
  .print-footer {
    display: flex !important;
  }
  .print-header {
    display: block !important;
  }
  .shadow-sm {
    box-shadow: none !important;
    border: 1px solid #e5e7eb !important;
  }
  .bg-white {
    background-color: white !important;
  }
  * {
    color: black !important;
  } /* خط أسود لضمان الطباعة النظيفة */
}
</style>
