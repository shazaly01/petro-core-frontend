<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-text-primary">
          ميزان المراجعة اليومي للوقود
        </h1>
        <p class="text-sm text-gray-500 dark:text-text-secondary mt-1">
          مطابقة الأرصدة الدفترية مع الفعلية واحتساب الفوارق
        </p>
      </div>

      <div
        class="flex flex-wrap items-center gap-3 bg-white dark:bg-surface-section p-3 rounded-lg border border-gray-200 dark:border-surface-border shadow-sm"
      >
        <div class="flex items-center gap-2">
          <label
            for="report_date"
            class="text-sm font-medium text-gray-700 dark:text-text-secondary whitespace-nowrap"
          >
            تاريخ الحركة:
          </label>
          <input
            id="report_date"
            type="date"
            v-model="selectedDate"
            class="p-2 border border-gray-300 dark:border-surface-border rounded-md bg-gray-50 dark:bg-surface-ground text-gray-900 dark:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <AppButton variant="primary" @click="fetchReport" :disabled="reportStore.loading">
          <span
            v-if="reportStore.loading"
            class="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
          ></span>
          عرض التقرير
        </AppButton>

        <AppButton
          variant="secondary"
          @click="printReport"
          :disabled="!hasData || reportStore.loading"
        >
          طباعة النموذج
        </AppButton>
      </div>
    </div>

    <div v-if="reportStore.loading" class="flex justify-center p-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <div
      v-else-if="reportStore.error"
      class="bg-red-50 text-red-700 p-4 rounded-md border border-red-200"
    >
      {{ reportStore.error }}
    </div>

    <div
      v-else-if="hasData"
      class="overflow-x-auto bg-white p-4 rounded-lg shadow-sm border border-gray-200"
    >
      <div class="min-w-[800px] border-2 border-black" dir="rtl">
        <div class="bg-[#1f4e79] text-white text-center py-4 border-b-2 border-black">
          <h2 class="text-2xl font-bold tracking-wide">نموذج حركة المبيعات اليومية للمحطة</h2>
        </div>

        <table class="w-full text-center border-collapse">
          <thead>
            <tr
              class="bg-[#b4c6e7] text-black font-bold text-sm sm:text-base border-b-2 border-black"
            >
              <th class="border border-black p-2 w-32">نوع الوقود</th>
              <th class="border border-black p-2">مخزون أول المدة</th>
              <th class="border border-black p-2">مخزون اخر المدة</th>
              <th class="border border-black p-2">الكمية المباعة</th>
              <th class="border border-black p-2">الكمية المستلمة</th>
              <th class="border border-black p-2">الفارق باللتر</th>
              <th class="border border-black p-2">الفارق المالي</th>
            </tr>
          </thead>

          <tbody class="text-black font-semibold bg-white">
            <tr
              v-for="record in reportStore.fuelReconciliationData.records"
              :key="record.fuel_name"
            >
              <td class="border border-black p-2">{{ record.fuel_name }}</td>
              <td class="border border-black p-2" dir="ltr">
                {{ formatNumber(record.opening_stock) }}
              </td>
              <td class="border border-black p-2" dir="ltr">
                {{ formatNumber(record.closing_stock) }}
              </td>
              <td class="border border-black p-2" dir="ltr">{{ formatNumber(record.sold) }}</td>
              <td class="border border-black p-2" dir="ltr">{{ formatNumber(record.received) }}</td>
              <td
                class="border border-black p-2"
                dir="ltr"
                :class="getVarianceColor(record.variance_liters)"
              >
                {{ formatNumber(record.variance_liters) }}
              </td>
              <td
                class="border border-black p-2"
                dir="ltr"
                :class="getVarianceColor(record.variance_money)"
              >
                {{ formatNumber(record.variance_money) }}
              </td>
            </tr>

            <tr v-if="reportStore.fuelReconciliationData.records.length === 0">
              <td colspan="7" class="border border-black p-4 text-center text-gray-500">
                لا توجد بيانات مسجلة لهذا اليوم.
              </td>
            </tr>
          </tbody>

          <tfoot
            v-if="reportStore.fuelReconciliationData.records.length > 0"
            class="bg-[#b4c6e7] text-black font-bold"
          >
            <tr>
              <td class="border border-black p-2">الإجمالي</td>
              <td class="border border-black p-2" dir="ltr">
                {{ formatNumber(reportStore.fuelReconciliationData.totals.opening_stock) }}
              </td>
              <td class="border border-black p-2" dir="ltr">
                {{ formatNumber(reportStore.fuelReconciliationData.totals.closing_stock) }}
              </td>
              <td class="border border-black p-2" dir="ltr">
                {{ formatNumber(reportStore.fuelReconciliationData.totals.sold) }}
              </td>
              <td class="border border-black p-2" dir="ltr">
                {{ formatNumber(reportStore.fuelReconciliationData.totals.received) }}
              </td>
              <td
                class="border border-black p-2"
                dir="ltr"
                :class="getVarianceColor(reportStore.fuelReconciliationData.totals.variance_liters)"
              >
                {{ formatNumber(reportStore.fuelReconciliationData.totals.variance_liters) }}
              </td>
              <td
                class="border border-black p-2"
                dir="ltr"
                :class="getVarianceColor(reportStore.fuelReconciliationData.totals.variance_money)"
              >
                {{ formatNumber(reportStore.fuelReconciliationData.totals.variance_money) }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <div
      v-else
      class="bg-gray-50 dark:bg-surface-section rounded-lg border border-gray-200 dark:border-surface-border p-12 text-center"
    >
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
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
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-text-primary">
        لا توجد بيانات معروضة
      </h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-text-secondary">
        الرجاء تحديد التاريخ والضغط على "عرض التقرير".
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useReportStore } from '@/stores/reportStore'
import AppButton from '@/components/ui/AppButton.vue'

const router = useRouter()
const reportStore = useReportStore()

// تعيين تاريخ اليوم كقيمة افتراضية
const selectedDate = ref(new Date().toISOString().split('T')[0])

const hasData = computed(() => {
  return (
    reportStore.fuelReconciliationData !== null &&
    reportStore.fuelReconciliationData.records !== undefined
  )
})

// جلب التقرير
const fetchReport = async () => {
  if (!selectedDate.value) return
  await reportStore.fetchFuelReconciliation({ date: selectedDate.value })
}

// دالة الطباعة (تجهيز لصفحة الطباعة المنفصلة لاحقاً)
// دالة الطباعة في DailySalesMovement.vue
const printReport = () => {
  if (!hasData.value) return

  // حفظ البيانات في الجلسة ليقرأها ملف الطباعة
  sessionStorage.setItem(
    'fuelReconciliationPrintData',
    JSON.stringify(reportStore.fuelReconciliationData),
  )

  // 🛑 استدعاء المسار بالاسم الجديد المطابق لملف الـ index
  const routeData = router.resolve({ name: 'PrintDailySalesMovement' })
  window.open(routeData.href, '_blank')
}

// تنسيق الأرقام
const formatNumber = (value) => {
  if (value === undefined || value === null) return '0.00'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}

// تلوين الفوارق (أحمر للعجز، أخضر للزيادة)
const getVarianceColor = (value) => {
  if (value < 0) return 'text-red-600 font-bold' // عجز
  if (value > 0) return 'text-green-600 font-bold' // زيادة
  return 'text-black' // صفر (مطابق تماماً)
}

// جلب بيانات اليوم الحالي تلقائياً عند فتح الشاشة
onMounted(() => {
  fetchReport()
})
</script>
