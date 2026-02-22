<template>
  <div
    v-if="shiftData"
    class="print-portrait-container bg-white text-black p-6 font-sans"
    dir="rtl"
  >
    <div class="flex justify-between items-center border-b-2 border-gray-900 pb-4 mb-6">
      <div class="flex items-center gap-4">
        <img src="/MainLogo2.png" alt="Logo" class="w-16 h-16 object-contain" />
        <div>
          <h1 class="text-2xl font-black text-gray-900 tracking-tight">محطة الوقود</h1>
          <p class="text-base font-bold text-gray-600">تقرير إغلاق الوردية (التفصيلي)</p>
        </div>
      </div>

      <div class="text-right text-xs font-medium text-gray-600 border-r-2 border-gray-300 pr-4">
        <p><span class="font-bold">تاريخ الطباعة:</span> {{ currentDate }}</p>
        <p class="mt-1"><span class="font-bold">وقت الطباعة:</span> {{ currentTime }}</p>
      </div>
    </div>

    <div
      class="mb-6 break-inside-avoid border-2 border-gray-800 rounded-lg p-4 bg-gray-50 flex justify-between items-center print-exact-colors"
    >
      <div>
        <h2 class="text-xl font-black text-gray-900 mb-1">{{ shiftData.shift_name }}</h2>
        <p class="text-sm text-gray-600 font-bold" dir="ltr">
          {{ formatDateTime(shiftData.start_time) }} إلى
          {{ shiftData.end_time ? formatDateTime(shiftData.end_time) : 'مستمرة حتى الآن' }}
        </p>
      </div>

      <div class="flex gap-8 text-center">
        <div>
          <p class="text-xs uppercase font-bold text-gray-500 mb-1">حالة الوردية</p>
          <span
            class="text-base font-black"
            :class="shiftData.status === 'closed' ? 'text-green-700' : 'text-yellow-700'"
          >
            {{ shiftData.status === 'closed' ? 'مغلقة' : 'مفتوحة' }}
          </span>
        </div>
        <div>
          <p class="text-xs uppercase font-bold text-gray-500 mb-1">إجمالي اللترات</p>
          <p class="font-black text-lg text-gray-900" dir="ltr">
            {{ formatNumber(shiftData.total_liters) }} L
          </p>
        </div>
        <div>
          <p class="text-xs uppercase font-bold text-gray-500 mb-1">إجمالي المبيعات (المطلوب)</p>
          <p class="font-black text-lg text-gray-900" dir="ltr">
            {{ formatCurrency(shiftData.total_amount) }}
          </p>
        </div>
      </div>
    </div>

    <div class="w-full break-inside-avoid mb-8">
      <h2
        class="text-base font-bold text-gray-800 mb-3 border-b-2 border-gray-300 inline-block pb-1"
      >
        تفاصيل حركة المضخات والعمال
      </h2>
      <table class="w-full text-center border-collapse table-auto">
        <thead>
          <tr class="bg-gray-200 text-black text-sm border-y-2 border-gray-800 print-exact-colors">
            <th class="p-2 border border-gray-400 w-1/6">اسم العامل</th>
            <th class="p-2 border border-gray-400 w-1/6">المضخة / الوقود</th>
            <th class="p-2 border border-gray-400 w-[12%]">بداية العداد</th>
            <th class="p-2 border border-gray-400 w-[12%]">نهاية العداد</th>
            <th class="p-2 border border-gray-400 w-1/6">الكمية المباعة (L)</th>
            <th class="p-2 border border-gray-400 w-1/6">المبلغ المطلوب</th>
          </tr>
        </thead>
        <tbody class="text-[13px] font-bold text-gray-900">
          <tr
            v-for="assign in shiftData.assignments"
            :key="assign.id"
            class="border-b border-gray-400"
          >
            <td class="p-2 border border-gray-400 text-right">{{ assign.worker_name }}</td>
            <td class="p-2 border border-gray-400">
              <span class="block">{{ assign.pump_name }}</span>
              <span class="text-[10px] text-gray-600 font-normal">{{ assign.fuel_type }}</span>
            </td>
            <td class="p-2 border border-gray-400 text-gray-700" dir="ltr">
              {{ assign.start_counter_1 }}
              <span v-if="assign.start_counter_2" class="block text-[10px]"
                >+ {{ assign.start_counter_2 }}</span
              >
            </td>
            <td class="p-2 border border-gray-400 text-gray-700" dir="ltr">
              {{ assign.end_counter_1 || '---' }}
              <span v-if="assign.end_counter_2" class="block text-[10px]"
                >+ {{ assign.end_counter_2 }}</span
              >
            </td>
            <td class="p-2 border border-gray-400 text-base" dir="ltr">
              {{ formatNumber(assign.total_liters) }}
            </td>
            <td class="p-2 border border-gray-400 text-base" dir="ltr">
              {{ formatCurrency(assign.total_amount) }}
            </td>
          </tr>
          <tr v-if="shiftData.assignments.length === 0">
            <td
              colspan="6"
              class="p-6 border border-gray-400 text-center text-gray-500 font-normal"
            >
              لا توجد تكليفات مسجلة في هذه الوردية.
            </td>
          </tr>
        </tbody>
        <tfoot
          v-if="shiftData.assignments.length > 0"
          class="bg-gray-100 text-black border-y-2 border-gray-800 print-exact-colors"
        >
          <tr>
            <td colspan="4" class="p-2 border border-gray-400 text-left font-black">
              الإجماليات الكلية:
            </td>
            <td class="p-2 border border-gray-400 font-black text-base" dir="ltr">
              {{ formatNumber(shiftData.total_liters) }} L
            </td>
            <td class="p-2 border border-gray-400 font-black text-base" dir="ltr">
              {{ formatCurrency(shiftData.total_amount) }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div
      class="mt-16 grid grid-cols-2 gap-4 text-center pt-8 border-t-2 border-gray-800 break-inside-avoid"
    >
      <div class="space-y-12">
        <p class="font-bold text-gray-800 text-sm">مشرف الوردية</p>
        <div class="border-b border-gray-400 w-48 mx-auto"></div>
      </div>
      <div class="space-y-12">
        <p class="font-bold text-gray-800 text-sm">اعتماد الإدارة / المحاسب</p>
        <div class="border-b border-gray-400 w-48 mx-auto"></div>
      </div>
    </div>

    <div
      class="print-footer fixed bottom-0 left-0 w-full text-center text-[10px] text-gray-500 border-t border-gray-200 pt-1 bg-white hidden print:block"
    >
      نظام إدارة محطات الوقود | تقرير إغلاق وردية - صفحة <span class="page-number"></span>
    </div>
  </div>
  <div v-else class="flex justify-center items-center h-screen bg-white">
    <p class="text-xl font-bold text-gray-500">جاري تجهيز تقرير الوردية للطباعة...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const shiftData = ref(null)
const currentDate = new Date().toLocaleDateString('ar-EG')
const currentTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })

onMounted(() => {
  const savedData = sessionStorage.getItem('shiftPrintData')
  if (savedData) {
    shiftData.value = JSON.parse(savedData)

    setTimeout(() => {
      window.print()
    }, 800)
  } else {
    alert('لا توجد بيانات للطباعة. الرجاء العودة لصفحة التقرير.')
  }
})

const formatNumber = (value) => {
  if (value === undefined || value === null) return '0.00'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

const formatCurrency = (value) => {
  if (value === undefined || value === null) return '0.00'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
@media print {
  @page {
    size: A4 portrait;
    margin: 10mm;
  }
  body {
    background-color: white !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    margin: 0;
  }
  .print-footer {
    display: block !important;
  }
  .page-number::after {
    content: counter(page);
  }
  .print-exact-colors {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}

.print-portrait-container {
  width: 100%;
  max-width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  background: white;
}

tr {
  break-inside: avoid;
  page-break-inside: avoid;
}
.break-inside-avoid {
  break-inside: avoid;
  page-break-inside: avoid;
}
</style>
