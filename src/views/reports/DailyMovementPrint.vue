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
          <p class="text-base font-bold text-gray-600">تقرير الحركة اليومية الشامل</p>
        </div>
      </div>

      <div class="text-right text-xs font-medium text-gray-600 border-r-2 border-gray-300 pr-4">
        <p class="mb-1">
          <span class="font-bold">تاريخ الحركة:</span> <span dir="ltr">{{ reportData.date }}</span>
        </p>
        <p><span class="font-bold">وقت الطباعة:</span> {{ currentDate }} - {{ currentTime }}</p>
      </div>
    </div>

    <div class="mb-6 break-inside-avoid">
      <h2 class="text-sm font-bold bg-gray-200 p-2 mb-3 border border-gray-300">
        الملخص المالي لورديات اليوم
      </h2>
      <div class="grid grid-cols-4 gap-3">
        <div class="border border-gray-300 p-3 rounded bg-gray-50 text-center">
          <p class="text-gray-500 text-[10px] font-bold mb-1 uppercase">إجمالي المبيعات (نظام)</p>
          <p class="text-base font-black text-gray-800" dir="ltr">
            {{ formatCurrency(reportData.financial_summary?.total_expected) }}
          </p>
        </div>

        <div class="border border-gray-300 p-3 rounded bg-gray-50 text-center">
          <p class="text-gray-500 text-[10px] font-bold mb-1 uppercase">النقد المحصل (Cash)</p>
          <p class="text-base font-black text-emerald-700" dir="ltr">
            {{ formatCurrency(reportData.financial_summary?.total_cash) }}
          </p>
        </div>

        <div class="border border-gray-300 p-3 rounded bg-gray-50 text-center">
          <p class="text-gray-500 text-[10px] font-bold mb-1 uppercase">الدفع البنكي (Bank/POS)</p>
          <p class="text-base font-black text-purple-700" dir="ltr">
            {{ formatCurrency(reportData.financial_summary?.total_bank) }}
          </p>
        </div>

        <div class="border border-gray-300 p-3 rounded bg-gray-50 text-center">
          <p class="text-gray-500 text-[10px] font-bold mb-1 uppercase">الصافي (عجز / زيادة)</p>
          <p
            class="text-base font-black"
            dir="ltr"
            :class="
              reportData.financial_summary?.total_difference >= 0
                ? 'text-emerald-700'
                : 'text-rose-700'
            "
          >
            <span v-if="reportData.financial_summary?.total_difference > 0">+</span>
            {{ formatCurrency(reportData.financial_summary?.total_difference) }}
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-6 mb-6">
      <div class="break-inside-avoid w-full">
        <h2 class="text-sm font-bold bg-gray-200 p-2 mb-2 border border-gray-300">
          تفصيل المبيعات
        </h2>
        <table class="w-full text-right border-collapse table-auto">
          <thead>
            <tr class="bg-gray-800 text-white print:bg-gray-300 print:text-black text-[11px]">
              <th class="p-1.5 border border-gray-400">نوع الوقود</th>
              <th class="p-1.5 border border-gray-400 w-24">الكمية (لتر)</th>
              <th class="p-1.5 border border-gray-400 w-28">المبلغ</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr v-for="(data, fuelName) in reportData.sales_by_fuel" :key="fuelName">
              <td class="p-1.5 border border-gray-300 font-bold">{{ fuelName }}</td>
              <td class="p-1.5 border border-gray-300 text-center" dir="ltr">
                {{ formatNumber(data.liters) }}
              </td>
              <td class="p-1.5 border border-gray-300 text-left" dir="ltr">
                {{ formatCurrency(data.amount) }}
              </td>
            </tr>
            <tr v-if="Object.keys(reportData.sales_by_fuel || {}).length === 0">
              <td colspan="3" class="p-2 border border-gray-300 text-center text-gray-500">
                لا توجد مبيعات
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="break-inside-avoid w-full">
        <h2 class="text-sm font-bold bg-gray-200 p-2 mb-2 border border-gray-300">
          التوريدات الواردة
        </h2>
        <table class="w-full text-right border-collapse table-auto">
          <thead>
            <tr class="bg-gray-800 text-white print:bg-gray-300 print:text-black text-[11px]">
              <th class="p-1.5 border border-gray-400">نوع الوقود</th>
              <th class="p-1.5 border border-gray-400 w-32">إجمالي المورد (لتر)</th>
            </tr>
          </thead>
          <tbody class="text-[11px]">
            <tr v-for="(liters, fuelName) in reportData.supplies_by_fuel" :key="'sup' + fuelName">
              <td class="p-1.5 border border-gray-300 font-bold">{{ fuelName }}</td>
              <td
                class="p-1.5 border border-gray-300 text-center font-bold text-blue-800"
                dir="ltr"
              >
                + {{ formatNumber(liters) }}
              </td>
            </tr>
            <tr v-if="Object.keys(reportData.supplies_by_fuel || {}).length === 0">
              <td colspan="2" class="p-2 border border-gray-300 text-center text-gray-500">
                لا توجد توريدات
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="mb-8 break-inside-avoid">
      <h2 class="text-sm font-bold bg-gray-200 p-2 mb-2 border border-gray-300">
        حالة الخزانات في نهاية اليوم
      </h2>
      <table class="w-full text-right border-collapse table-auto">
        <thead>
          <tr class="bg-gray-800 text-white print:bg-gray-300 print:text-black text-[11px]">
            <th class="p-1.5 border border-gray-400">الخزان</th>
            <th class="p-1.5 border border-gray-400">نوع الوقود</th>
            <th class="p-1.5 border border-gray-400 w-24 text-center">السعة القصوى</th>
            <th class="p-1.5 border border-gray-400 w-24 text-center">المخزون الحالي</th>
            <th class="p-1.5 border border-gray-400 w-20 text-center">نسبة الامتلاء</th>
          </tr>
        </thead>
        <tbody class="text-[11px]">
          <tr v-for="tank in reportData.tanks_status" :key="tank.id">
            <td class="p-1.5 border border-gray-300 font-bold">{{ tank.name }}</td>
            <td class="p-1.5 border border-gray-300">{{ tank.fuel_type }}</td>
            <td class="p-1.5 border border-gray-300 text-center text-gray-600" dir="ltr">
              {{ formatNumber(tank.capacity) }}
            </td>
            <td class="p-1.5 border border-gray-300 text-center font-black text-gray-900" dir="ltr">
              {{ formatNumber(tank.current_stock) }}
            </td>
            <td class="p-1.5 border border-gray-300 text-center font-bold" dir="ltr">
              {{ tank.fill_percentage }}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      class="mt-12 grid grid-cols-2 gap-4 text-center pt-8 border-t-2 border-gray-800 break-inside-avoid"
    >
      <div class="space-y-10">
        <p class="font-bold text-gray-800 text-sm">محاسب المحطة</p>
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
      نظام إدارة محطات الوقود - صفحة <span class="page-number"></span>
    </div>
  </div>
  <div v-else class="flex justify-center items-center h-screen bg-white">
    <p class="text-xl font-bold text-gray-500">جاري تجهيز التقرير للطباعة...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const reportData = ref(null)
const currentDate = new Date().toLocaleDateString('ar-EG')
const currentTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })

onMounted(() => {
  // جلب البيانات من الجلسة
  const savedData = sessionStorage.getItem('dailyMovementPrintData')
  if (savedData) {
    reportData.value = JSON.parse(savedData)

    // إعطاء المتصفح ثانية واحدة لرسم الجداول قبل فتح نافذة الطباعة
    setTimeout(() => {
      window.print()
    }, 1000)
  } else {
    alert('لا توجد بيانات للطباعة. الرجاء العودة لصفحة التقرير.')
  }
})

const formatNumber = (value) => {
  if (value === undefined || value === null) return '0'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}

const formatCurrency = (value) => {
  if (value === undefined || value === null) return '0.00'
  return (
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value) + ' SDG'
  )
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
  /* إخفاء مسار الصفحة والتاريخ الافتراضي الذي يضيفه المتصفح أعلى وأسفل الورقة */
  @page {
    margin-top: 10mm;
    margin-bottom: 15mm;
  }
}

.print-portrait-container {
  width: 100%;
  max-width: 210mm; /* عرض A4 التقريبي على الشاشة */
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
