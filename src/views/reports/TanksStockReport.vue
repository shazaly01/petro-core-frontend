<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-text-primary">
          تقرير أرصدة الخزانات (اللحظي)
        </h1>
        <p class="text-sm text-gray-500 dark:text-text-secondary mt-1">
          يعرض الكميات الدفترية المفترض وجودها في الخزانات الآن
        </p>
      </div>

      <div class="flex gap-3">
        <AppButton
          variant="secondary"
          @click="printReport"
          :disabled="!hasData || reportStore.loading"
        >
          <i class="pi pi-print mr-2"></i> طباعة الجرد
        </AppButton>

        <AppButton variant="primary" @click="fetchData" :disabled="reportStore.loading">
          <i class="pi pi-refresh mr-2" :class="{ 'animate-spin': reportStore.loading }"></i> تحديث
          البيانات
        </AppButton>
      </div>
    </div>

    <div v-if="reportStore.loading" class="flex justify-center p-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="hasData" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="(summary, fuelType) in reportStore.tanksStockData.summary_by_fuel"
          :key="fuelType"
          class="bg-white dark:bg-surface-section p-4 rounded-lg border border-gray-200 dark:border-surface-border shadow-sm"
        >
          <h3 class="font-bold text-lg text-gray-800 dark:text-text-primary mb-3 border-b pb-2">
            إجمالي {{ fuelType }}
          </h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">السعة الكلية:</span>
              <span class="font-bold" dir="ltr">{{ formatNumber(summary.total_capacity) }} L</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">المخزون الحالي:</span>
              <span class="font-black text-blue-600 dark:text-blue-400" dir="ltr"
                >{{ formatNumber(summary.total_stock) }} L</span
              >
            </div>
            <div class="flex justify-between border-t pt-2 mt-2">
              <span class="text-gray-500">الفراغ المتاح:</span>
              <span class="font-bold text-emerald-600" dir="ltr"
                >{{ formatNumber(summary.total_free_space) }} L</span
              >
            </div>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-surface-section rounded-lg border border-gray-200 dark:border-surface-border overflow-hidden shadow-sm"
      >
        <div
          class="p-4 bg-gray-50 dark:bg-surface-ground border-b border-gray-200 dark:border-surface-border flex justify-between items-center"
        >
          <h3 class="font-bold text-gray-800 dark:text-text-primary">تفصيل الخزانات</h3>
          <span class="text-xs text-gray-500"
            >وقت التحديث: <span dir="ltr">{{ reportStore.tanksStockData.date }}</span></span
          >
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-right border-collapse">
            <thead>
              <tr class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm">
                <th class="p-3 border-b dark:border-gray-700">اسم الخزان</th>
                <th class="p-3 border-b dark:border-gray-700">نوع الوقود</th>
                <th class="p-3 border-b dark:border-gray-700">السعة القصوى</th>
                <th class="p-3 border-b dark:border-gray-700">المخزون المفترض</th>
                <th class="p-3 border-b dark:border-gray-700">الفراغ المتاح</th>
                <th class="p-3 border-b dark:border-gray-700 w-48">نسبة الامتلاء</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="tank in reportStore.tanksStockData.tanks"
                :key="tank.id"
                class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td class="p-3 font-bold text-gray-900 dark:text-gray-100">{{ tank.name }}</td>
                <td class="p-3">
                  <span class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs font-bold">{{
                    tank.fuel_type
                  }}</span>
                </td>
                <td class="p-3 text-gray-600 dark:text-gray-400" dir="ltr">
                  {{ formatNumber(tank.capacity) }}
                </td>
                <td class="p-3 font-black text-blue-700 dark:text-blue-400" dir="ltr">
                  {{ formatNumber(tank.current_stock) }}
                </td>
                <td class="p-3 font-bold text-emerald-600 dark:text-emerald-400" dir="ltr">
                  {{ formatNumber(tank.free_space) }}
                </td>
                <td class="p-3">
                  <div class="flex items-center gap-2">
                    <div
                      class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden"
                    >
                      <div
                        class="h-2.5 rounded-full"
                        :class="getProgressBarColor(tank.fill_percentage)"
                        :style="{ width: `${tank.fill_percentage}%` }"
                      ></div>
                    </div>
                    <span class="text-xs font-bold w-10 text-center" dir="ltr"
                      >{{ tank.fill_percentage }}%</span
                    >
                  </div>
                </td>
              </tr>
              <tr v-if="reportStore.tanksStockData.tanks.length === 0">
                <td colspan="6" class="p-6 text-center text-gray-500">
                  لا توجد خزانات مسجلة في النظام.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div
      v-else
      class="bg-gray-50 dark:bg-surface-section rounded-lg border border-gray-200 dark:border-surface-border p-12 text-center"
    >
      <h3 class="text-sm font-medium text-gray-900 dark:text-text-primary">
        عفواً، لا يمكن عرض البيانات حالياً
      </h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-text-secondary">
        الرجاء الضغط على زر التحديث للمحاولة مرة أخرى.
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useReportStore } from '@/stores/reportStore'
import AppButton from '@/components/ui/AppButton.vue'

// تهيئة الموجه ومخزن البيانات
const router = useRouter()
const reportStore = useReportStore()

// التحقق من وجود بيانات
const hasData = computed(() => !!reportStore.tanksStockData)

// جلب البيانات من الخادم
const fetchData = async () => {
  await reportStore.fetchTanksStockSummary()
}

// 🛑 دالة الطباعة (تفتح صفحة الطباعة المستقلة)
const printReport = () => {
  if (!hasData.value) return

  // حفظ البيانات الحالية في الجلسة لتقرأها صفحة الطباعة
  sessionStorage.setItem('tanksStockPrintData', JSON.stringify(reportStore.tanksStockData))

  // توجيه المتصفح لفتح صفحة الطباعة النظيفة في تبويبة جديدة
  const routeData = router.resolve({ name: 'PrintTanksStock' })
  window.open(routeData.href, '_blank')
}

// تنسيق الأرقام مع إضافة الفواصل العشرية
const formatNumber = (value) => {
  if (value === undefined || value === null) return '0.00'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}

// تلوين شريط التقدم بناءً على نسبة الامتلاء لتنبيه المستخدم بصرياً
const getProgressBarColor = (percentage) => {
  if (percentage <= 15) return 'bg-red-500' // خطر: الخزان شبه فارغ
  if (percentage <= 40) return 'bg-yellow-500' // تنبيه: يحتاج توريد قريباً
  if (percentage >= 95) return 'bg-purple-500' // ممتلئ جداً (خطر الفوران)
  return 'bg-emerald-500' // طبيعي وآمن
}

// جلب البيانات تلقائياً عند فتح الشاشة
onMounted(() => {
  fetchData()
})
</script>
