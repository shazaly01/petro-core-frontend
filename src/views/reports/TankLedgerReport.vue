<template>
  <div class="p-6 space-y-6 bg-gray-50 dark:bg-surface-ground min-h-screen print-container">
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white font-display">
          كشف حساب حركة الخزان (Ledger)
        </h1>
        <p class="text-sm text-text-muted mt-1">
          مراقبة تفصيلية لكل لتر وقود (دخول، خروج، تسويات) خلال فترة زمنية محددة.
        </p>
      </div>
      <div class="flex gap-2">
        <AppButton v-if="reportData" @click="printReport" variant="secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          طباعة الكشف
        </AppButton>
      </div>
    </div>

    <div
      class="bg-white dark:bg-surface-section p-4 rounded-xl border border-surface-border shadow-sm no-print"
    >
      <form @submit.prevent="fetchReport" class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div class="md:col-span-1">
          <TanksDropdown
            id="tank_id"
            label="اختر الخزان"
            v-model="filters.tank_id"
            :required="true"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-text-secondary mb-1"
            >من تاريخ</label
          >
          <input
            type="date"
            v-model="filters.from_date"
            class="form-input w-full rounded-md border-gray-300 dark:bg-surface-ground dark:border-surface-border dark:text-white"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-text-secondary mb-1"
            >إلى تاريخ</label
          >
          <input
            type="date"
            v-model="filters.to_date"
            class="form-input w-full rounded-md border-gray-300 dark:bg-surface-ground dark:border-surface-border dark:text-white"
          />
        </div>
        <div>
          <AppButton
            type="submit"
            variant="primary"
            class="w-full"
            :disabled="loading || !filters.tank_id"
          >
            <span
              v-if="loading"
              class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full ml-2"
            ></span>
            عرض التقرير
          </AppButton>
        </div>
      </form>
    </div>

    <div
      v-if="!reportData && !loading"
      class="text-center py-20 bg-white dark:bg-surface-section rounded-xl border border-surface-border shadow-sm no-print"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">لم يتم جلب التقرير بعد</h3>
      <p class="text-gray-500 dark:text-gray-400 mt-1">
        الرجاء اختيار الخزان وتحديد الفترة الزمنية ثم الضغط على "عرض التقرير".
      </p>
    </div>

    <div v-if="reportData" class="space-y-6">
      <div class="hidden print-header text-center mb-6">
        <h2 class="text-2xl font-bold">كشف حساب حركة خزان</h2>
        <p class="text-lg mt-2">
          اسم الخزان: <span class="font-bold">{{ reportData.tank_info?.name }}</span> | نوع الوقود:
          {{ reportData.tank_info?.fuel_type?.name }}
        </p>
        <p class="text-gray-600 text-sm mt-1">
          الفترة من: <span dir="ltr">{{ formatDateOnly(reportData.period.from) }}</span> إلى:
          <span dir="ltr">{{ formatDateOnly(reportData.period.to) }}</span>
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          class="bg-white dark:bg-surface-section p-5 rounded-xl border border-surface-border shadow-sm flex items-center justify-between"
        >
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
              الرصيد الافتتاحي للفترة
            </p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1" dir="ltr">
              {{ formatNumber(reportData.opening_balance) }} L
            </p>
          </div>
          <div class="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        <div
          class="bg-white dark:bg-surface-section p-5 rounded-xl border border-surface-border shadow-sm flex items-center justify-between"
        >
          <div>
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
              صافي الحركة (دخول - خروج)
            </p>
            <p
              class="text-2xl font-bold mt-1"
              :class="
                netMovement >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              "
              dir="ltr"
            >
              <span v-if="netMovement > 0">+</span>{{ formatNumber(netMovement) }} L
            </p>
          </div>
          <div
            class="p-3 rounded-lg"
            :class="
              netMovement >= 0
                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
          </div>
        </div>

        <div
          class="bg-white dark:bg-surface-section p-5 rounded-xl border-2 border-primary shadow-sm flex items-center justify-between relative overflow-hidden"
        >
          <div class="absolute inset-0 bg-primary/5 dark:bg-primary/10"></div>
          <div class="relative z-10">
            <p class="text-sm font-bold text-primary">الرصيد الختامي (الحالي)</p>
            <p class="text-3xl font-black text-gray-900 dark:text-white mt-1" dir="ltr">
              {{ formatNumber(reportData.current_balance) }} L
            </p>
          </div>
          <div class="relative z-10 p-3 bg-primary/20 rounded-lg text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
              />
            </svg>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-surface-section rounded-xl border border-surface-border shadow-sm overflow-hidden"
      >
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  التاريخ والوقت
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  نوع الحركة
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  الكمية
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  الرصيد قبل
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  الرصيد بعد
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  المسؤول والملاحظات
                </th>
              </tr>
            </thead>
            <tbody
              class="bg-white dark:bg-surface-section divide-y divide-gray-200 dark:divide-gray-700"
            >
              <tr
                v-for="move in reportData.movements"
                :key="move.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
              >
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200"
                  dir="ltr"
                >
                  {{ move.date }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getTypeBadgeClass(move)"
                  >
                    {{ move.type }}
                  </span>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-bold"
                  :class="getQuantityColorClass(move)"
                  dir="ltr"
                >
                  <span v-if="isAddition(move)">+</span
                  ><span v-else-if="isSubtraction(move)">-</span>
                  {{ formatNumber(move.quantity) }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                  dir="ltr"
                >
                  {{ formatNumber(move.balance_before) }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white"
                  dir="ltr"
                >
                  {{ formatNumber(move.balance_after) }}
                </td>
                <td
                  class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate"
                  :title="move.notes"
                >
                  <div class="font-medium text-gray-900 dark:text-gray-200">
                    {{ move.user || 'نظام' }}
                  </div>
                  <div class="text-xs mt-0.5 truncate">{{ move.notes }}</div>
                </td>
              </tr>
              <tr v-if="reportData.movements.length === 0">
                <td colspan="6" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  لا توجد أي حركات على هذا الخزان في الفترة المحددة.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="hidden print-footer mt-8 text-sm text-gray-500 flex justify-between">
        <span>طُبع بواسطة: {{ currentUser }}</span>
        <span dir="ltr">تاريخ الطباعة: {{ new Date().toLocaleString() }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import TanksDropdown from '@/components/forms/TanksDropdown.vue'
import { useReportStore } from '@/stores/reportStore' // 🛑 استيراد الـ Store
import { useRouter } from 'vue-router'
const router = useRouter()
// تهيئة الـ Store
const reportStore = useReportStore()

// الفلاتر
const filters = ref({
  tank_id: '',
  from_date: '',
  to_date: '',
})

// 🛑 ربط حالة التحميل والبيانات بالـ Store مباشرة
const loading = computed(() => reportStore.loading)
const reportData = computed(() => reportStore.tankLedgerData)

// اسم المستخدم للطباعة
const currentUser = 'المدير العام'

// دالة جلب التقرير (تستدعي الدالة من الـ Store)
const fetchReport = async () => {
  if (!filters.value.tank_id) return

  try {
    await reportStore.fetchTankLedger(filters.value)
  } catch (error) {
    alert('حدث خطأ أثناء جلب التقرير. يرجى المحاولة لاحقاً.')
  }
}

// حساب صافي الحركة للبطاقات العلوية
const netMovement = computed(() => {
  if (!reportData.value) return 0
  return reportData.value.current_balance - reportData.value.opening_balance
})

// دوال مساعدة لتنسيق الأرقام والتواريخ
const formatNumber = (val) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val || 0)
}

const formatDateOnly = (dateString) => {
  if (!dateString) return ''
  return dateString.split(' ')[0]
}

const isAddition = (move) => move.balance_after > move.balance_before
const isSubtraction = (move) => move.balance_after < move.balance_before

// ألوان شارات النوع (Badges)
const getTypeBadgeClass = (move) => {
  if (move.type.includes('توريد'))
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
  if (move.type.includes('مبيعات'))
    return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
  return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
}

// ألوان الكمية (أخضر للزيادة، أحمر للنقصان)
const getQuantityColorClass = (move) => {
  if (isAddition(move)) return 'text-green-600 dark:text-green-400'
  if (isSubtraction(move)) return 'text-red-600 dark:text-red-400'
  return 'text-gray-500'
}

// دالة الطباعة (المعدلة لفتح صفحة الطباعة المستقلة)
const printReport = () => {
  if (!reportData.value) return

  // 1. حفظ البيانات في الجلسة
  sessionStorage.setItem('tankLedgerPrintData', JSON.stringify(reportData.value))

  // 2. فتح الصفحة النظيفة في تبويبة جديدة
  const routeData = router.resolve({ name: 'PrintTankLedger' })
  window.open(routeData.href, '_blank')
}
</script>

<style scoped>
/* إعدادات الطباعة الاحترافية */
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
  table {
    width: 100% !important;
    border-collapse: collapse !important;
  }
  th,
  td {
    border: 1px solid #e5e7eb !important;
    color: black !important;
  }
  * {
    color: black !important; /* لضمان وضوح الطباعة بالأبيض والأسود */
  }
}
</style>
