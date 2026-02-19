<template>
  <div class="p-6 space-y-6 bg-gray-50 dark:bg-surface-ground min-h-screen">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white font-display">
          لوحة التحكم والمراقبة
        </h1>
        <p class="text-sm text-text-muted mt-1">موجز العمليات والنتائج ليوم {{ todayDate }}</p>
      </div>
      <AppButton @click="store.fetchStats" variant="secondary" :disabled="loading">
        <ArrowPathIcon class="h-5 w-5 ml-2" :class="{ 'animate-spin': loading }" />
        تحديث البيانات
      </AppButton>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        class="bg-white dark:bg-surface-section p-5 rounded-xl border border-surface-border shadow-sm"
      >
        <div class="flex items-center gap-4">
          <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <BanknotesIcon class="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p class="text-xs text-text-muted mb-1">إيرادات اليوم</p>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ formatCurrency(stats.overview?.total_revenue_today) }}
            </h3>
          </div>
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
            <p class="text-xs text-text-muted mb-1">اللترات المباعة</p>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ formatNumber(stats.overview?.total_liters_today) }}
              <span class="text-sm font-normal">لتر</span>
            </h3>
          </div>
        </div>
      </div>

      <div
        class="lg:col-span-2 bg-gradient-to-r from-primary to-blue-700 p-5 rounded-xl shadow-md text-white"
      >
        <div v-if="stats.overview?.active_shift" class="flex justify-between items-center">
          <div>
            <p class="text-blue-100 text-xs mb-1">الوردية الحالية (نشطة)</p>
            <h3 class="text-lg font-bold">المشرف: {{ stats.overview.active_shift.supervisor }}</h3>
            <p class="text-sm opacity-90">بدأت {{ stats.overview.active_shift.start_at }}</p>
          </div>
          <div class="text-left">
            <span class="text-2xl font-black">{{
              stats.overview.active_shift.assignments_count
            }}</span>
            <p class="text-xs opacity-80">تكليفات جارية</p>
          </div>
        </div>
        <div v-else class="flex items-center justify-center h-full">
          <p class="font-bold">لا توجد وردية مفتوحة حالياً</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div
        class="lg:col-span-2 bg-white dark:bg-surface-section p-6 rounded-xl border border-surface-border shadow-sm"
      >
        <h3 class="font-bold text-gray-800 dark:text-white mb-6">مراقبة مستويات الخزانات</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="tank in stats.inventory" :key="tank.id" class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="font-medium">{{ tank.name }} ({{ tank.fuel_type }})</span>
              <span
                :class="tank.is_low ? 'text-danger font-bold animate-pulse' : 'text-text-secondary'"
              >
                {{ tank.percentage }}%
              </span>
            </div>
            <div
              class="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div
                class="h-full transition-all duration-1000"
                :class="tank.is_low ? 'bg-danger' : 'bg-primary'"
                :style="{ width: tank.percentage + '%' }"
              ></div>
            </div>
            <p class="text-[10px] text-text-muted">
              المخزون الحالي: {{ formatNumber(tank.stock_level) }} لتر
            </p>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-surface-section p-6 rounded-xl border border-surface-border shadow-sm"
      >
        <h3 class="font-bold text-gray-800 dark:text-white mb-4">التنبيهات العاجلة</h3>
        <div v-if="stats.alerts?.low_stock_tanks.length" class="space-y-3">
          <div
            v-for="alert in stats.alerts.low_stock_tanks"
            :key="alert.id"
            class="p-3 bg-red-50 dark:bg-red-900/20 border-r-4 border-red-500 rounded flex gap-3 items-start"
          >
            <ExclamationTriangleIcon class="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p class="text-sm font-bold text-red-800 dark:text-red-400">انخفاض حاد في المخزون</p>
              <p class="text-xs text-red-700 dark:text-red-300">
                الخزان: {{ alert.name }} وصل إلى {{ alert.percentage }}%
              </p>
            </div>
          </div>
        </div>
        <div v-else class="flex flex-col items-center justify-center h-40 opacity-40">
          <CheckCircleIcon class="h-12 w-12 text-success" />
          <p class="mt-2 text-sm">لا توجد تنبيهات حالياً</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
        class="bg-white dark:bg-surface-section p-6 rounded-xl border border-surface-border shadow-sm"
      >
        <h3 class="font-bold text-gray-800 dark:text-white mb-4">أعلى 5 عمال مبيعاً (اليوم)</h3>
        <div class="space-y-4">
          <div
            v-for="(worker, index) in stats.top_workers"
            :key="index"
            class="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <div class="flex items-center gap-3">
              <span
                class="w-6 h-6 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-bold text-primary"
              >
                {{ index + 1 }}
              </span>
              <span class="font-medium">{{ worker.name }}</span>
            </div>
            <span class="font-bold text-primary">{{ formatCurrency(worker.sales) }}</span>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-surface-section p-6 rounded-xl border border-surface-border shadow-sm"
      >
        <h3 class="font-bold text-gray-800 dark:text-white mb-4">تحليل طرق الدفع</h3>
        <div class="space-y-6 mt-8">
          <div
            v-for="method in stats.payment_breakdown"
            :key="method.payment_method"
            class="relative pt-1"
          >
            <div class="flex mb-2 items-center justify-between">
              <div>
                <span
                  class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-blue-100 text-blue-600"
                >
                  {{ getPaymentLabel(method.payment_method) }}
                </span>
              </div>
              <div class="text-right">
                <span class="text-sm font-bold text-blue-600">{{
                  formatCurrency(method.total)
                }}</span>
              </div>
            </div>
            <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
              <div
                class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                :style="{ width: calculatePaymentPercentage(method.total) + '%' }"
              ></div>
            </div>
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

const todayDate = computed(() => {
  return new Intl.DateTimeFormat('ar-EG', { dateStyle: 'long' }).format(new Date())
})

// تنسيقات
const formatCurrency = (val) => {
  return new Intl.NumberFormat('ar-SD', {
    style: 'currency',
    currency: 'SDG',
    maximumFractionDigits: 0,
  }).format(val || 0)
}

const formatNumber = (val) => new Intl.NumberFormat('ar-EG').format(val || 0)

const getPaymentLabel = (method) => {
  const labels = { cash: 'نقدي', visa: 'بطاقة إلكترونية', sadad: 'سداد/بنكك', transfer: 'تحويل' }
  return labels[method] || method
}

const calculatePaymentPercentage = (amount) => {
  const total = store.stats.overview?.total_revenue_today || 1
  return (amount / total) * 100
}
</script>
