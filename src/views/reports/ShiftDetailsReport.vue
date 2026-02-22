<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-text-primary">
          تقرير تفصيل الورديات
        </h1>
        <p class="text-sm text-gray-500 dark:text-text-secondary mt-1">
          مراجعة التكليفات والمبيعات والمضخات لوردية محددة
        </p>
      </div>

      <div
        class="flex flex-wrap items-center gap-3 bg-white dark:bg-surface-section p-3 rounded-lg border border-gray-200 dark:border-surface-border shadow-sm"
      >
        <div class="flex items-center gap-2">
          <label
            for="shift_date"
            class="text-sm font-medium text-gray-700 dark:text-text-secondary whitespace-nowrap"
            >التاريخ:</label
          >
          <input
            id="shift_date"
            type="date"
            v-model="selectedDate"
            @change="fetchReport"
            class="p-2 border border-gray-300 dark:border-surface-border rounded-md bg-gray-50 dark:bg-surface-ground text-gray-900 dark:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div
          v-if="hasData && reportStore.shiftDetailsData.shifts.length > 0"
          class="flex items-center gap-2 border-r border-gray-300 dark:border-gray-600 pr-3"
        >
          <label
            for="shift_select"
            class="text-sm font-medium text-gray-700 dark:text-text-secondary whitespace-nowrap"
            >اختر الوردية:</label
          >
          <select
            id="shift_select"
            v-model="selectedShiftId"
            class="p-2 border border-gray-300 dark:border-surface-border rounded-md bg-white dark:bg-surface-ground text-gray-900 dark:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary min-w-[150px]"
          >
            <option
              v-for="shift in reportStore.shiftDetailsData.shifts"
              :key="shift.id"
              :value="shift.id"
            >
              {{ shift.shift_name }}
            </option>
          </select>
        </div>

        <AppButton
          variant="secondary"
          @click="printReport"
          :disabled="!selectedShift || reportStore.loading"
        >
          <i class="pi pi-print mr-1"></i> طباعة الوردية
        </AppButton>

        <AppButton variant="primary" @click="fetchReport" :disabled="reportStore.loading">
          <i class="pi pi-refresh mr-1" :class="{ 'animate-spin': reportStore.loading }"></i> تحديث
        </AppButton>
      </div>
    </div>

    <div v-if="reportStore.loading" class="flex justify-center p-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>

    <div v-else-if="hasData" class="space-y-8">
      <div
        v-if="reportStore.shiftDetailsData.shifts.length === 0"
        class="text-center p-12 bg-white dark:bg-surface-section rounded-lg border border-gray-200 dark:border-surface-border"
      >
        <p class="text-gray-500 dark:text-text-secondary text-lg font-bold">
          لا توجد ورديات مسجلة في هذا التاريخ.
        </p>
      </div>

      <div
        v-else-if="selectedShift"
        class="bg-white dark:bg-surface-section rounded-lg shadow-sm border-2 border-gray-300 dark:border-surface-border overflow-hidden transition-all"
      >
        <div
          class="bg-gray-100 dark:bg-gray-800 p-4 border-b border-gray-300 dark:border-surface-border flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <div class="flex items-center gap-3">
            <span
              class="p-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full"
            >
              <i class="pi pi-clock text-xl"></i>
            </span>
            <div>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                {{ selectedShift.shift_name }}
              </h2>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1" dir="ltr">
                {{ formatDateTime(selectedShift.start_time) }} -
                {{
                  selectedShift.end_time
                    ? formatDateTime(selectedShift.end_time)
                    : 'مستمرة حتى الآن'
                }}
              </p>
            </div>
          </div>
          <div class="flex gap-6 text-center">
            <div>
              <p class="text-[10px] uppercase font-bold text-gray-500 mb-1">حالة الوردية</p>
              <span
                class="px-3 py-1 text-xs font-bold rounded-full"
                :class="
                  selectedShift.status === 'closed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                "
              >
                {{ selectedShift.status === 'closed' ? 'مغلقة' : 'مفتوحة' }}
              </span>
            </div>
            <div>
              <p class="text-[10px] uppercase font-bold text-gray-500 mb-1">
                إجمالي اللترات المباعة
              </p>
              <p class="font-black text-gray-800 dark:text-gray-200" dir="ltr">
                {{ formatNumber(selectedShift.total_liters) }} L
              </p>
            </div>
            <div>
              <p class="text-[10px] uppercase font-bold text-gray-500 mb-1">
                إجمالي المبالغ المطلوبة
              </p>
              <p class="font-black text-emerald-600 dark:text-emerald-400" dir="ltr">
                {{ formatCurrency(selectedShift.total_amount) }}
              </p>
            </div>
          </div>
        </div>

        <div class="p-4 overflow-x-auto">
          <h3
            class="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 border-b-2 border-gray-200 inline-block pb-1"
          >
            تفاصيل التكليفات (المضخات والعمال)
          </h3>
          <table class="w-full text-right border-collapse table-auto">
            <thead>
              <tr class="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 text-xs">
                <th class="p-2 border border-gray-200 dark:border-gray-700">العامل</th>
                <th class="p-2 border border-gray-200 dark:border-gray-700">المضخة</th>
                <th class="p-2 border border-gray-200 dark:border-gray-700">الوقود</th>
                <th class="p-2 border border-gray-200 dark:border-gray-700 text-center">
                  بداية العداد
                </th>
                <th class="p-2 border border-gray-200 dark:border-gray-700 text-center">
                  نهاية العداد
                </th>
                <th
                  class="p-2 border border-gray-200 dark:border-gray-700 text-center text-blue-700 dark:text-blue-400"
                >
                  الكمية (لتر)
                </th>
                <th
                  class="p-2 border border-gray-200 dark:border-gray-700 text-center text-emerald-700 dark:text-emerald-400"
                >
                  المبلغ المطلوب
                </th>
              </tr>
            </thead>
            <tbody class="text-sm text-gray-800 dark:text-gray-200">
              <tr
                v-for="assign in selectedShift.assignments"
                :key="assign.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <td class="p-2 border border-gray-200 dark:border-gray-700 font-bold">
                  {{ assign.worker_name }}
                </td>
                <td class="p-2 border border-gray-200 dark:border-gray-700">
                  {{ assign.pump_name }}
                </td>
                <td class="p-2 border border-gray-200 dark:border-gray-700 text-xs font-bold">
                  {{ assign.fuel_type }}
                </td>

                <td
                  class="p-2 border border-gray-200 dark:border-gray-700 text-center text-gray-500"
                  dir="ltr"
                >
                  {{ assign.start_counter_1 }}
                  <span v-if="assign.start_counter_2" class="block text-[10px] text-gray-400"
                    >+ {{ assign.start_counter_2 }}</span
                  >
                </td>
                <td
                  class="p-2 border border-gray-200 dark:border-gray-700 text-center font-bold"
                  dir="ltr"
                >
                  {{ assign.end_counter_1 || '---' }}
                  <span v-if="assign.end_counter_2" class="block text-[10px] font-normal"
                    >+ {{ assign.end_counter_2 }}</span
                  >
                </td>

                <td
                  class="p-2 border border-gray-200 dark:border-gray-700 text-center font-black text-blue-700 dark:text-blue-400 bg-blue-50/30 dark:bg-blue-900/10"
                  dir="ltr"
                >
                  {{ formatNumber(assign.total_liters) }}
                </td>
                <td
                  class="p-2 border border-gray-200 dark:border-gray-700 text-center font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-900/10"
                  dir="ltr"
                >
                  {{ formatCurrency(assign.total_amount) }}
                </td>
              </tr>
              <tr v-if="selectedShift.assignments.length === 0">
                <td colspan="7" class="p-4 text-center text-gray-500">
                  لا توجد تكليفات مسجلة في هذه الوردية.
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
import { ref, computed, onMounted } from 'vue'
import { useReportStore } from '@/stores/reportStore'
import AppButton from '@/components/ui/AppButton.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const reportStore = useReportStore()
const selectedDate = ref(new Date().toISOString().split('T')[0])

// 🛑 المتغير الجديد لحفظ الـ ID الخاص بالوردية المختارة من القائمة المنسدلة
const selectedShiftId = ref('')

const hasData = computed(
  () => !!reportStore.shiftDetailsData && !!reportStore.shiftDetailsData.shifts,
)

// 🛑 دالة محسوبة تجلب الوردية التي اختارها المستخدم فقط
const selectedShift = computed(() => {
  if (!hasData.value || !selectedShiftId.value) return null
  return reportStore.shiftDetailsData.shifts.find((s) => s.id === selectedShiftId.value)
})

const fetchReport = async () => {
  if (!selectedDate.value) return
  await reportStore.fetchShiftDetails({ date: selectedDate.value })

  // بعد جلب البيانات، نقوم باختيار أول وردية في القائمة تلقائياً (لتسهيل الأمر على المستخدم)
  if (reportStore.shiftDetailsData.shifts && reportStore.shiftDetailsData.shifts.length > 0) {
    selectedShiftId.value = reportStore.shiftDetailsData.shifts[0].id
  } else {
    selectedShiftId.value = ''
  }
}

const formatNumber = (value) => {
  if (!value) return '0'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}

const formatCurrency = (value) => {
  if (!value) return '0.00'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  fetchReport()
})

const printReport = () => {
  if (!selectedShift.value) return

  // حفظ الوردية المختارة فقط في الجلسة
  sessionStorage.setItem('shiftPrintData', JSON.stringify(selectedShift.value))

  // توجيه المتصفح لفتح صفحة الطباعة النظيفة
  const routeData = router.resolve({ name: 'PrintShiftDetails' })
  window.open(routeData.href, '_blank')
}
</script>
