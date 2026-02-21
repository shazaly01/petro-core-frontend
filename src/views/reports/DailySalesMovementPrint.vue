<template>
  <div
    v-if="reportData"
    class="print-landscape-container bg-white text-black p-6 font-sans"
    dir="rtl"
  >
    <div class="flex justify-between items-center pb-4 mb-4 border-b-2 border-gray-900">
      <div class="flex items-center gap-4">
        <img src="/MainLogo2.png" alt="Logo" class="w-16 h-16 object-contain" />
        <div>
          <h1 class="text-2xl font-black text-gray-900 tracking-tight">محطة الوقود</h1>
          <p class="text-base font-bold text-gray-600">ميزان المراجعة اليومي</p>
        </div>
      </div>
      <div class="text-right text-xs font-medium text-gray-600 border-r-2 border-gray-300 pr-4">
        <p>
          <span class="font-bold">تاريخ الحركة:</span> <span dir="ltr">{{ reportData.date }}</span>
        </p>
        <p class="mt-1">
          <span class="font-bold">تاريخ الطباعة:</span> {{ currentDate }} - {{ currentTime }}
        </p>
      </div>
    </div>

    <div class="w-full border-2 border-black print-exact-colors">
      <div
        class="bg-[#1f4e79] text-white text-center py-4 border-b-2 border-black"
        style="background-color: #1f4e79 !important; color: white !important"
      >
        <h2 class="text-3xl font-bold tracking-wide">نموذج حركة المبيعات اليومية للمحطة</h2>
      </div>

      <table class="w-full text-center border-collapse table-fixed">
        <thead>
          <tr
            class="bg-[#b4c6e7] text-black font-bold text-lg border-b-2 border-black"
            style="background-color: #b4c6e7 !important; color: black !important"
          >
            <th class="border border-black p-3 w-[12%]">نوع الوقود</th>
            <th class="border border-black p-3 w-[14%]">مخزون أول المدة</th>
            <th class="border border-black p-3 w-[14%]">مخزون اخر المدة</th>
            <th class="border border-black p-3 w-[14%]">الكمية المباعة</th>
            <th class="border border-black p-3 w-[14%]">الكمية المستلمة</th>
            <th class="border border-black p-3 w-[16%]">الفارق باللتر</th>
            <th class="border border-black p-3 w-[16%]">الفارق بالدينار</th>
          </tr>
        </thead>

        <tbody class="text-black font-bold text-lg bg-white">
          <tr v-for="record in reportData.records" :key="record.fuel_name">
            <td class="border border-black p-3">{{ record.fuel_name }}</td>
            <td class="border border-black p-3" dir="ltr">
              {{ formatNumber(record.opening_stock) }}
            </td>
            <td class="border border-black p-3" dir="ltr">
              {{ formatNumber(record.closing_stock) }}
            </td>
            <td class="border border-black p-3" dir="ltr">{{ formatNumber(record.sold) }}</td>
            <td class="border border-black p-3" dir="ltr">{{ formatNumber(record.received) }}</td>
            <td class="border border-black p-3" dir="ltr">
              {{ formatNumber(record.variance_liters) }}
            </td>
            <td class="border border-black p-3" dir="ltr">
              {{ formatNumber(record.variance_money) }} د.ل
            </td>
          </tr>

          <tr v-if="reportData.records.length === 0">
            <td colspan="7" class="border border-black p-6 text-center text-gray-500 font-normal">
              لا توجد حركة مسجلة لهذا اليوم.
            </td>
          </tr>
        </tbody>

        <tfoot
          v-if="reportData.records.length > 0"
          class="bg-[#b4c6e7] text-black font-black text-lg"
          style="background-color: #b4c6e7 !important; color: black !important"
        >
          <tr>
            <td class="border border-black p-3 text-center">الإجمالي</td>
            <td class="border border-black p-3" dir="ltr">
              {{ formatNumber(reportData.totals.opening_stock) }}
            </td>
            <td class="border border-black p-3" dir="ltr">
              {{ formatNumber(reportData.totals.closing_stock) }}
            </td>
            <td class="border border-black p-3" dir="ltr">
              {{ formatNumber(reportData.totals.sold) }}
            </td>
            <td class="border border-black p-3" dir="ltr">
              {{ formatNumber(reportData.totals.received) }}
            </td>
            <td class="border border-black p-3" dir="ltr">
              {{ formatNumber(reportData.totals.variance_liters) }}
            </td>
            <td class="border border-black p-3" dir="ltr">
              {{ formatNumber(reportData.totals.variance_money) }} د.ل
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div class="mt-16 grid grid-cols-3 gap-4 text-center pt-8 break-inside-avoid">
      <div class="space-y-10">
        <p class="font-bold text-gray-800 text-base">مُعد التقرير</p>
        <div class="border-b-2 border-gray-600 w-48 mx-auto"></div>
      </div>
      <div class="space-y-10">
        <p class="font-bold text-gray-800 text-base">المراجعة والتدقيق</p>
        <div class="border-b-2 border-gray-600 w-48 mx-auto"></div>
      </div>
      <div class="space-y-10">
        <p class="font-bold text-gray-800 text-base">المدير العام</p>
        <div class="border-b-2 border-gray-600 w-48 mx-auto"></div>
      </div>
    </div>

    <div
      class="print-footer fixed bottom-0 left-0 w-full text-center text-[11px] text-gray-500 border-t border-gray-200 pt-1 bg-white hidden print:block"
    >
      نظام إدارة محطات الوقود | نموذج حركة المبيعات اليومية
    </div>
  </div>
  <div v-else class="flex justify-center items-center h-screen bg-white">
    <p class="text-xl font-bold text-gray-500">جاري تجهيز نموذج المبيعات للطباعة...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const reportData = ref(null)
const currentDate = new Date().toLocaleDateString('ar-EG')
const currentTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })

onMounted(() => {
  const savedData = sessionStorage.getItem('fuelReconciliationPrintData')
  if (savedData) {
    reportData.value = JSON.parse(savedData)

    // تأخير لضمان رسم الجدول وتطبيق الألوان قبل فتح نافذة الطباعة
    setTimeout(() => {
      window.print()
    }, 800)
  } else {
    alert('لا توجد بيانات للطباعة. الرجاء العودة لصفحة التقرير.')
  }
})

// تنسيق الأرقام لتبدو تماماً كما في صورتك (3 أصفار عشرية 0.000)
const formatNumber = (value) => {
  if (value === undefined || value === null) return '0.000'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0, // تم التعديل لتطابق الصورة التي تحتوي على 3 أصفار
    maximumFractionDigits: 3,
  }).format(value)
}
</script>

<style scoped>
@media print {
  @page {
    /* 🛑 تم جعل الورقة بالعرض لتستوعب الجدول العريض بشكل مريح 🛑 */
    size: A4 landscape;
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

  /* إجبار الطابعة على طباعة ألوان الخلفية للجدول */
  .print-exact-colors div,
  .print-exact-colors th,
  .print-exact-colors tfoot td {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}

.print-landscape-container {
  width: 100%;
  max-width: 297mm; /* عرض A4 Landscape */
  min-height: 210mm;
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
