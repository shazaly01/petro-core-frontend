<template>
  <div class="p-6 space-y-6 bg-gray-50 dark:bg-surface-ground min-h-screen">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-2xl font-black text-gray-900 dark:text-white font-display">
          لوحة القيادة الإدارية
        </h1>
        <p class="text-sm text-text-muted mt-1">ملخص العمليات والتحصيل ليوم {{ todayDate }}</p>
      </div>
      <AppButton
        @click="store.fetchStats"
        variant="secondary"
        :disabled="loading"
        class="shadow-sm"
      >
        <ArrowPathIcon class="h-5 w-5 ml-2" :class="{ 'animate-spin': loading }" />
        تحديث البيانات
      </AppButton>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        class="bg-white dark:bg-surface-section p-5 rounded-xl border border-surface-border shadow-sm relative overflow-hidden"
      >
        <div class="flex items-center gap-4 relative z-10">
          <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <BanknotesIcon class="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p class="text-xs text-text-muted mb-1 font-bold">إجمالي المحصل (الصندوق)</p>
            <h3 class="text-xl font-black text-gray-900 dark:text-white" dir="ltr">
              {{ formatCurrency(stats.overview?.total_collected_revenue) }}
            </h3>
          </div>
        </div>
        <div
          class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between text-[11px] font-bold"
        >
          <span class="text-gray-500"
            >المطلوب:
            <span dir="ltr">{{
              formatCurrency(stats.overview?.total_expected_revenue)
            }}</span></span
          >
          <span
            :class="stats.overview?.total_difference < 0 ? 'text-red-500' : 'text-green-500'"
            dir="ltr"
          >
            الفرق: {{ formatCurrency(stats.overview?.total_difference) }}
          </span>
        </div>
      </div>

      <div
        class="bg-white dark:bg-surface-section p-5 rounded-xl border border-surface-border shadow-sm"
      >
        <div class="flex items-center gap-4">
          <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <BeakerIcon class="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p class="text-xs text-text-muted mb-1 font-bold">إجمالي اللترات المباعة</p>
            <h3
              class="text-xl font-black text-gray-900 dark:text-white flex items-baseline gap-1"
              dir="ltr"
            >
              {{ formatNumber(stats.overview?.total_liters_today) }}
              <span class="text-xs font-normal text-gray-500">Liters</span>
            </h3>
          </div>
        </div>
      </div>

      <div
        class="lg:col-span-2 bg-gradient-to-l from-blue-800 to-blue-600 p-5 rounded-xl shadow-md text-white relative overflow-hidden"
      >
        <div class="flex justify-between items-center mb-3">
          <h3 class="text-blue-100 text-sm font-bold">الورديات المفتوحة حالياً (التشغيل الحي)</h3>
          <span class="bg-white/20 px-2 py-1 rounded text-xs font-bold" dir="ltr"
            >{{ stats.active_shifts?.length || 0 }} Shifts</span
          >
        </div>

        <div
          v-if="stats.active_shifts?.length"
          class="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto max-h-24 pr-1 custom-scrollbar"
        >
          <div
            v-for="shift in stats.active_shifts"
            :key="shift.id"
            class="bg-white/10 p-3 rounded-lg border border-white/10 flex justify-between items-center backdrop-blur-sm"
          >
            <div>
              <p class="font-bold text-sm">{{ shift.supervisor }}</p>
              <p class="text-[10px] text-blue-200 mt-1">
                بدأت: <span dir="ltr">{{ shift.start_at }}</span>
              </p>
            </div>
            <div class="text-center bg-black/20 px-3 py-1 rounded-lg">
              <span class="block text-lg font-black" dir="ltr">{{ shift.active_assignments }}</span>
              <span class="block text-[9px] text-blue-200">مضخات تعمل</span>
            </div>
          </div>
        </div>
        <div
          v-else
          class="flex items-center justify-center h-16 bg-white/5 rounded-lg border border-white/10 border-dashed"
        >
          <p class="font-bold text-blue-200 text-sm">لا توجد أي وردية مفتوحة في المحطة حالياً</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div
        class="lg:col-span-2 bg-white dark:bg-surface-section p-6 rounded-xl border border-surface-border shadow-sm"
      >
        <h3 class="font-bold text-gray-800 dark:text-white mb-6 border-b pb-3 dark:border-gray-700">
          مراقبة مستويات الخزانات
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="tank in stats.inventory" :key="tank.id" class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="font-bold"
                >{{ tank.name }}
                <span class="text-gray-400 font-normal">({{ tank.fuel_type }})</span></span
              >
              <span
                :class="
                  tank.is_low ? 'text-red-500 font-black animate-pulse' : 'text-blue-600 font-bold'
                "
                dir="ltr"
              >
                {{ formatNumber(tank.percentage) }}%
              </span>
            </div>
            <div
              class="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div
                class="h-full transition-all duration-1000"
                :class="tank.is_low ? 'bg-red-500' : 'bg-blue-500'"
                :style="{ width: tank.percentage + '%' }"
              ></div>
            </div>
            <div class="flex justify-between text-[11px] text-text-muted">
              <span
                >المتبقي:
                <span class="font-bold text-gray-700 dark:text-gray-300" dir="ltr"
                  >{{ formatNumber(tank.stock_level) }} L</span
                ></span
              >
              <span
                >السعة: <span dir="ltr">{{ formatNumber(tank.capacity) }} L</span></span
              >
            </div>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-surface-section p-6 rounded-xl border border-surface-border shadow-sm"
      >
        <h3 class="font-bold text-gray-800 dark:text-white mb-4 border-b pb-3 dark:border-gray-700">
          التنبيهات العاجلة
        </h3>

        <div
          v-if="stats.alerts?.deficits || stats.alerts?.low_stock_tanks?.length"
          class="space-y-3"
        >
          <div
            v-if="stats.alerts?.deficits"
            class="p-3 bg-red-50 dark:bg-red-900/20 border-r-4 border-red-600 rounded flex gap-3 items-start"
          >
            <ExclamationTriangleIcon class="h-6 w-6 text-red-600 shrink-0" />
            <div>
              <p class="text-sm font-black text-red-800 dark:text-red-400">عجز مالي في الصندوق!</p>
              <p class="text-xs text-red-700 dark:text-red-300 mt-1 leading-relaxed">
                {{ stats.alerts.deficits }}
              </p>
            </div>
          </div>

          <div
            v-for="alert in stats.alerts?.low_stock_tanks"
            :key="alert.id"
            class="p-3 bg-orange-50 dark:bg-orange-900/20 border-r-4 border-orange-500 rounded flex gap-3 items-start"
          >
            <ExclamationTriangleIcon class="h-5 w-5 text-orange-600 mt-0.5 shrink-0" />
            <div>
              <p class="text-sm font-bold text-orange-800 dark:text-orange-400">
                انخفاض حاد في المخزون
              </p>
              <p class="text-xs text-orange-700 dark:text-orange-300 mt-1">
                الخزان: {{ alert.name }} وصل إلى
                <span dir="ltr" class="font-bold">{{ formatNumber(alert.percentage) }}%</span>
              </p>
            </div>
          </div>
        </div>

        <div v-else class="flex flex-col items-center justify-center h-48 opacity-40">
          <CheckCircleIcon class="h-16 w-16 text-green-500 mb-3" />
          <p class="font-bold text-sm">النظام مستقر</p>
          <p class="text-xs mt-1">لا توجد أي تنبيهات حالياً</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
        class="bg-white dark:bg-surface-section p-6 rounded-xl border border-surface-border shadow-sm"
      >
        <h3 class="font-bold text-gray-800 dark:text-white mb-4 border-b pb-3 dark:border-gray-700">
          أعلى العمال تحصيلاً اليوم
        </h3>
        <div class="space-y-3 mt-4">
          <div
            v-for="(worker, index) in stats.top_workers"
            :key="index"
            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700"
          >
            <div class="flex items-center gap-3">
              <span
                class="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-700 rounded-lg shadow-sm text-sm font-black text-blue-600"
                dir="ltr"
              >
                #{{ index + 1 }}
              </span>
              <div>
                <span class="font-bold block text-sm">{{ worker.name }}</span>
                <span
                  class="text-[10px]"
                  :class="
                    worker.difference < 0
                      ? 'text-red-500'
                      : worker.difference > 0
                        ? 'text-green-500'
                        : 'text-gray-400'
                  "
                  dir="ltr"
                >
                  Diff: {{ formatCurrency(worker.difference) }}
                </span>
              </div>
            </div>
            <span class="font-black text-lg text-gray-800 dark:text-gray-200" dir="ltr">{{
              formatCurrency(worker.collected)
            }}</span>
          </div>
          <div
            v-if="!stats.top_workers?.length"
            class="text-center py-6 text-gray-400 text-sm font-bold"
          >
            لا توجد بيانات مبيعات مغلقة اليوم.
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-surface-section p-6 rounded-xl border border-surface-border shadow-sm"
      >
        <h3 class="font-bold text-gray-800 dark:text-white mb-4 border-b pb-3 dark:border-gray-700">
          تحليل طرق الدفع
        </h3>
        <div class="space-y-6 mt-6">
          <div v-for="method in stats.payment_breakdown" :key="method.method" class="relative pt-1">
            <div class="flex items-end justify-between mb-2">
              <div>
                <span
                  class="text-xs font-black inline-block py-1 px-3 uppercase rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800"
                >
                  {{ method.method }}
                </span>
              </div>
              <div class="text-right">
                <span class="text-lg font-black text-gray-800 dark:text-gray-200" dir="ltr">{{
                  formatCurrency(method.total)
                }}</span>
              </div>
            </div>
            <div
              class="overflow-hidden h-2.5 mb-2 text-xs flex rounded-full bg-gray-100 dark:bg-gray-700"
            >
              <div
                class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000"
                :class="method.method.includes('Cash') ? 'bg-green-500' : 'bg-blue-500'"
                :style="{ width: calculatePaymentPercentage(method.total) + '%' }"
              ></div>
            </div>
            <p class="text-[10px] text-gray-400 text-left w-full block font-bold" dir="ltr">
              {{ formatNumber(calculatePaymentPercentage(method.total)) }}%
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useDashboardStore } from '@/stores/dashboardStore'
import { storeToRefs } from 'pinia'
import {
  ArrowPathIcon,
  BanknotesIcon,
  BeakerIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/vue/24/outline'
import AppButton from '@/components/ui/AppButton.vue'

const store = useDashboardStore()
const { stats, loading } = storeToRefs(store)

onMounted(() => {
  store.fetchStats()
})

// تنسيق التاريخ ليكون باللغة الإنجليزية للأرقام مع الإبقاء على شكل التاريخ المتعارف عليه
const todayDate = computed(() => {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date())
})

// 🛑 تنسيق العملة بالأرقام الإنجليزية والدينار الليبي
const formatCurrency = (val) => {
  const num = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  }).format(val || 0)
  return `${num} د.ل`
}

// 🛑 تنسيق الأرقام العادية (للترات والنسب) بالأرقام الإنجليزية
const formatNumber = (val) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(val || 0)
}

const calculatePaymentPercentage = (amount) => {
  const total = store.stats.overview?.total_collected_revenue || 1
  if (total === 1 && !amount) return 0 // تجنب إظهار نسب خاطئة إذا كان الصندوق فارغاً
  return (amount / total) * 100
}
</script>

<style scoped>
/* شريط تمرير أنيق لمنطقة الورديات المفتوحة */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}
</style>
