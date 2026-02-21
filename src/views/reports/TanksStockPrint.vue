<template>
  <div
    v-if="reportData"
    class="print-portrait-container bg-white text-black p-6 font-sans"
    dir="rtl"
  >
    <div class="flex justify-between items-center border-b-2 border-gray-900 pb-4 mb-6">
      <div class="flex items-center gap-4">
        <img src="/MainLogo2.png" alt="Logo" class="w-16 h-16 object-contain" />
        <div>
          <h1 class="text-2xl font-black text-gray-900 tracking-tight">محطة الوقود</h1>
          <p class="text-base font-bold text-gray-600">تقرير جرد الخزانات اللحظي</p>
        </div>
      </div>

      <div class="text-right text-xs font-medium text-gray-600 border-r-2 border-gray-300 pr-4">
        <p>
          <span class="font-bold">وقت الجرد (النظام):</span>
          <span dir="ltr">{{ reportData.date }}</span>
        </p>
        <p class="mt-1">
          <span class="font-bold">وقت الطباعة:</span> {{ currentDate }} - {{ currentTime }}
        </p>
      </div>
    </div>

    <div class="mb-6 break-inside-avoid">
      <h2 class="text-sm font-bold bg-gray-200 p-2 mb-3 border border-gray-300">
        إجماليات الأرصدة حسب نوع الوقود
      </h2>
      <div class="grid grid-cols-2 gap-4">
        <div
          v-for="(summary, fuelType) in reportData.summary_by_fuel"
          :key="'sum-' + fuelType"
          class="border border-gray-400 p-3 rounded bg-white"
        >
          <h3 class="font-black text-lg text-gray-900 border-b border-gray-300 pb-1 mb-2">
            وقود: {{ fuelType }}
          </h3>
          <div class="flex justify-between text-sm mb-1">
            <span>السعة الكلية:</span>
            <span class="font-bold" dir="ltr">{{ formatNumber(summary.total_capacity) }} L</span>
          </div>
          <div class="flex justify-between text-sm mb-1">
            <span>المخزون الفعلي:</span>
            <span class="font-black text-blue-800" dir="ltr"
              >{{ formatNumber(summary.total_stock) }} L</span
            >
          </div>
          <div class="flex justify-between text-sm border-t border-gray-200 pt-1 mt-1">
            <span>الفراغ المتاح للتوريد:</span>
            <span class="font-bold text-emerald-800" dir="ltr"
              >{{ formatNumber(summary.total_free_space) }} L</span
            >
          </div>
        </div>
      </div>
    </div>

    <div class="w-full break-inside-avoid mb-8">
      <h2 class="text-sm font-bold bg-gray-200 p-2 mb-2 border border-gray-300">
        التفصيل الفردي للخزانات
      </h2>
      <table class="w-full text-center border-collapse table-auto">
        <thead>
          <tr class="bg-gray-800 text-white print:bg-gray-300 print:text-black text-xs">
            <th class="p-2 border border-gray-400">اسم الخزان</th>
            <th class="p-2 border border-gray-400 w-24">نوع الوقود</th>
            <th class="p-2 border border-gray-400 w-28">السعة القصوى (L)</th>
            <th class="p-2 border border-gray-400 w-28">المخزون الحالي (L)</th>
            <th class="p-2 border border-gray-400 w-28">الفراغ المتاح (L)</th>
            <th class="p-2 border border-gray-400 w-20">نسبة الامتلاء</th>
          </tr>
        </thead>
        <tbody class="text-[13px] font-semibold text-gray-900">
          <tr v-for="tank in reportData.tanks" :key="tank.id" class="border-b border-gray-300">
            <td class="p-2 border border-gray-400 font-bold text-right">{{ tank.name }}</td>
            <td class="p-2 border border-gray-400">{{ tank.fuel_type }}</td>
            <td class="p-2 border border-gray-400 text-gray-700" dir="ltr">
              {{ formatNumber(tank.capacity) }}
            </td>
            <td class="p-2 border border-gray-400 font-black" dir="ltr">
              {{ formatNumber(tank.current_stock) }}
            </td>
            <td class="p-2 border border-gray-400 text-gray-700" dir="ltr">
              {{ formatNumber(tank.free_space) }}
            </td>
            <td class="p-2 border border-gray-400" dir="ltr">{{ tank.fill_percentage }}%</td>
          </tr>
          <tr v-if="reportData.tanks.length === 0">
            <td
              colspan="6"
              class="p-4 border border-gray-400 text-center text-gray-500 font-normal"
            >
              لا توجد خزانات مسجلة في النظام.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      class="mt-12 grid grid-cols-2 gap-4 text-center pt-8 border-t-2 border-gray-800 break-inside-avoid"
    >
      <div class="space-y-10">
        <p class="font-bold text-gray-800 text-sm">أمين المستودع (مُعد الجرد)</p>
        <div class="border-b border-gray-400 w-48 mx-auto"></div>
      </div>
      <div class="space-y-10">
        <p class="font-bold text-gray-800 text-sm">اعتماد مدير المحطة</p>
        <div class="border-b border-gray-400 w-48 mx-auto"></div>
      </div>
    </div>

    <div
      class="print-footer fixed bottom-0 left-0 w-full text-center text-[10px] text-gray-500 border-t border-gray-200 pt-1 bg-white hidden print:block"
    >
      نظام إدارة محطات الوقود | تقرير جرد الخزانات - صفحة <span class="page-number"></span>
    </div>
  </div>
  <div v-else class="flex justify-center items-center h-screen bg-white">
    <p class="text-xl font-bold text-gray-500">جاري تجهيز تقرير الخزانات للطباعة...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const reportData = ref(null)
const currentDate = new Date().toLocaleDateString('ar-EG')
const currentTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })

onMounted(() => {
  const savedData = sessionStorage.getItem('tanksStockPrintData')
  if (savedData) {
    reportData.value = JSON.parse(savedData)

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
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
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
