<template>
  <div class="p-6 space-y-6">
    <div
      class="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-surface-section p-4 rounded-xl border border-surface-border"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white font-display">
          تقرير الحركة اليومية
        </h1>
        <p class="text-sm text-text-muted mt-1">ملخص شامل للمبيعات، التوريدات، والتدفقات المالية</p>
      </div>
      <div class="flex items-center gap-2">
        <label for="report-date" class="text-sm font-medium text-gray-700 dark:text-text-secondary"
          >تاريخ التقرير:</label
        >
        <input
          id="report-date"
          type="date"
          v-model="selectedDate"
          class="block rounded-md shadow-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-primary focus:border-primary dark:bg-surface-ground dark:border-surface-border dark:text-text-primary p-2"
        />
        <AppButton @click="fetchData" variant="primary" :disabled="loading">
          <ArrowPathIcon class="h-5 w-5" :class="{ 'animate-spin': loading }" />
          عرض
        </AppButton>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        class="bg-white dark:bg-surface-section p-5 rounded-xl border border-surface-border shadow-sm"
      >
        <div class="flex items-center gap-4">
          <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <BeakerIcon class="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p class="text-xs text-text-muted mb-1">إجمالي المباع (لتر)</p>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ formatNumber(summary.totalLitersSold) }}
            </h3>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-surface-section p-5 rounded-xl border border-surface-border shadow-sm"
      >
        <div class="flex items-center gap-4">
          <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <BanknotesIcon class="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p class="text-xs text-text-muted mb-1">قيمة المبيعات (المتوقعة)</p>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ formatCurrency(summary.totalSalesExpected) }}
            </h3>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-surface-section p-5 rounded-xl border border-surface-border shadow-sm"
      >
        <div class="flex items-center gap-4">
          <div class="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <CurrencyDollarIcon class="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p class="text-xs text-text-muted mb-1">إجمالي المقبوضات (الفعلية)</p>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ formatCurrency(summary.totalPaymentsReceived) }}
            </h3>
          </div>
        </div>
      </div>

      <div
        class="bg-white dark:bg-surface-section p-5 rounded-xl border border-surface-border shadow-sm"
      >
        <div class="flex items-center gap-4">
          <div class="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
            <TruckIcon class="h-6 w-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <p class="text-xs text-text-muted mb-1">إجمالي الوارد (لتر)</p>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ formatNumber(summary.totalLitersSupplied) }}
            </h3>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
        class="bg-white dark:bg-surface-section rounded-xl border border-surface-border overflow-hidden"
      >
        <div class="p-4 border-b border-surface-border font-bold text-lg flex items-center gap-2">
          <ClipboardDocumentListIcon class="h-5 w-5" />
          تفاصيل حركة المبيعات (التكليفات)
        </div>
        <AppTable
          :headers="assignmentHeaders"
          :items="filteredAssignments"
          :is-loading="loading"
          :row-clickable="false"
        >
          <template #cell-sold_liters="{ item }">
            <span class="font-bold">{{ formatNumber(item.sold_liters) }}</span>
          </template>
          <template #cell-total_amount="{ item }">
            <span class="text-primary font-bold">{{ formatCurrency(item.total_amount) }}</span>
          </template>
        </AppTable>
      </div>

      <div
        class="bg-white dark:bg-surface-section rounded-xl border border-surface-border overflow-hidden"
      >
        <div class="p-4 border-b border-surface-border font-bold text-lg flex items-center gap-2">
          <ArrowDownTrayIcon class="h-5 w-5" />
          تفاصيل حركة التوريد (الوارد)
        </div>
        <AppTable
          :headers="supplyHeaders"
          :items="filteredSupplyLogs"
          :is-loading="loading"
          :row-clickable="false"
        >
          <template #cell-quantity="{ item }">
            <span class="font-bold text-green-600">+{{ formatNumber(item.quantity) }}</span>
          </template>
          <template #cell-tank="{ item }">
            {{ item.tank?.name }}
          </template>
        </AppTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAssignmentStore } from '@/stores/assignmentStore'
import { useSupplyLogStore } from '@/stores/supplyLogStore'
import { useTransactionStore } from '@/stores/transactionStore'
import AppTable from '@/components/ui/AppTable.vue'
import AppButton from '@/components/ui/AppButton.vue'
import {
  ArrowPathIcon,
  BeakerIcon,
  BanknotesIcon,
  CurrencyDollarIcon,
  TruckIcon,
  ClipboardDocumentListIcon,
  ArrowDownTrayIcon,
} from '@heroicons/vue/24/outline'

// تهيئة المخازن
const assignmentStore = useAssignmentStore()
const supplyLogStore = useSupplyLogStore()
const transactionStore = useTransactionStore()

// التاريخ المحدد (افتراضياً اليوم)
const todayStr = new Date().toISOString().slice(0, 10)
const selectedDate = ref(todayStr)
const loading = ref(false)

// جلب البيانات (محاكاة - في الواقع يجب أن يدعم الباك إند الفلترة بالتاريخ)
const fetchData = async () => {
  loading.value = true
  // ملاحظة: هنا نفترض أن الستورات تجلب كل البيانات أو بيانات اليوم افتراضياً
  // في تطبيق حقيقي، يجب تمرير selectedDate.value كمعامل لدوال الـ fetch
  await Promise.all([
    assignmentStore.fetchAssignments(),
    supplyLogStore.fetchSupplyLogs(),
    transactionStore.fetchTransactions(),
  ])
  loading.value = false
}

onMounted(() => {
  fetchData()
})

// --- تصفية البيانات حسب التاريخ المحدد (Client-side filtering) ---
const filterByDate = (items) => {
  if (!items) return []
  return items.filter((item) => item.created_at && item.created_at.startsWith(selectedDate.value))
}

const filteredAssignments = computed(() => filterByDate(assignmentStore.assignments))
const filteredSupplyLogs = computed(() => filterByDate(supplyLogStore.supplyLogs))
const filteredTransactions = computed(() => filterByDate(transactionStore.transactions))

// --- حساب الملخصات ---
const summary = computed(() => {
  const litersSold = filteredAssignments.value.reduce(
    (sum, item) => sum + (parseFloat(item.sold_liters) || 0),
    0,
  )
  const salesExpected = filteredAssignments.value.reduce(
    (sum, item) => sum + (parseFloat(item.total_amount) || 0),
    0,
  )
  const paymentsReceived = filteredTransactions.value.reduce(
    (sum, item) => sum + (parseFloat(item.amount) || 0),
    0,
  )
  const litersSupplied = filteredSupplyLogs.value.reduce(
    (sum, item) => sum + (parseFloat(item.quantity) || 0),
    0,
  )

  return {
    totalLitersSold: litersSold,
    totalSalesExpected: salesExpected,
    totalPaymentsReceived: paymentsReceived,
    totalLitersSupplied: litersSupplied,
  }
})

// --- إعدادات الجداول ---
const assignmentHeaders = [
  { key: 'nozzle.code', label: 'المسدس' },
  { key: 'user.name', label: 'العامل' },
  { key: 'sold_liters', label: 'مباع (لتر)', class: 'text-left' },
  { key: 'total_amount', label: 'القيمة', class: 'text-left' },
]

const supplyHeaders = [
  { key: 'created_at', label: 'الوقت' },
  { key: 'tank', label: 'الخزان' },
  { key: 'quantity', label: 'وارد (لتر)', class: 'text-left' },
  { key: 'invoice_number', label: 'رقم الفاتورة', class: 'text-left' },
]

// --- دوال تنسيق ---
const formatNumber = (val) => new Intl.NumberFormat('ar-EG').format(val || 0)
const formatCurrency = (val) =>
  new Intl.NumberFormat('ar-SD', {
    style: 'currency',
    currency: 'SDG',
    maximumFractionDigits: 0,
  }).format(val || 0)
</script>
