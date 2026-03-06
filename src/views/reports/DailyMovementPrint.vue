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
          <h1 class="text-2xl font-black text-gray-900 tracking-tight">محطة وقود</h1>
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
      <div class="grid grid-cols-5 gap-2">
        <div class="border border-gray-300 p-2 rounded bg-gray-50 text-center">
          <p class="text-gray-500 text-[9px] font-bold mb-1 uppercase">المبيعات (نظام)</p>
          <p class="text-sm font-black text-gray-800" dir="ltr">
            {{ formatCurrency(reportData.financial_summary?.total_expected) }}
          </p>
        </div>

        <div class="border border-gray-300 p-2 rounded bg-gray-50 text-center">
          <p class="text-gray-500 text-[9px] font-bold mb-1 uppercase">النقد المحصل</p>
          <p class="text-sm font-black text-emerald-700" dir="ltr">
            {{ formatCurrency(reportData.financial_summary?.total_cash) }}
          </p>
        </div>

        <div class="border border-gray-300 p-2 rounded bg-gray-50 text-center">
          <p class="text-gray-500 text-[9px] font-bold mb-1 uppercase">الدفع البنكي</p>
          <p class="text-sm font-black text-purple-700" dir="ltr">
            {{ formatCurrency(reportData.financial_summary?.total_bank) }}
          </p>
        </div>

        <div class="border border-gray-300 p-2 rounded bg-gray-50 text-center">
          <p class="text-gray-500 text-[9px] font-bold mb-1 uppercase">إجمالي المصروفات</p>
          <p class="text-sm font-black text-orange-700" dir="ltr">
            {{ formatCurrency(reportData.financial_summary?.vouchers_summary?.total_expenses) }}
          </p>
        </div>

        <div class="border border-gray-300 p-2 rounded bg-gray-50 text-center">
          <p class="text-gray-500 text-[9px] font-bold mb-1 uppercase">الصافي (عجز/زيادة)</p>
          <p
            class="text-sm font-black"
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
        <h2 class="text-sm font-bold bg-gray-200 p-2 mb-2 border border-gray-300 text-center">
          تفصيل المبيعات
        </h2>
        <table class="w-full text-right border-collapse table-auto border border-gray-400">
          <thead>
            <tr class="bg-gray-100 text-black text-[10px] font-bold">
              <th class="p-1 border border-gray-400">المنتج</th>
              <th class="p-1 border border-gray-400 w-20 text-center">الكمية (L)</th>
              <th class="p-1 border border-gray-400 w-24 text-left">المبلغ</th>
            </tr>
          </thead>
          <tbody class="text-[10px]">
            <tr v-for="(data, fuelName) in reportData.sales_by_fuel" :key="fuelName">
              <td class="p-1 border border-gray-300 font-bold">{{ fuelName }}</td>
              <td class="p-1 border border-gray-300 text-center" dir="ltr">
                {{ formatNumber(data.liters) }}
              </td>
              <td class="p-1 border border-gray-300 text-left" dir="ltr">
                {{ formatCurrency(data.amount) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="break-inside-avoid w-full">
        <h2 class="text-sm font-bold bg-gray-200 p-2 mb-2 border border-gray-300 text-center">
          التوريدات الواردة
        </h2>
        <table class="w-full text-right border-collapse table-auto border border-gray-400">
          <thead>
            <tr class="bg-gray-100 text-black text-[10px] font-bold">
              <th class="p-1 border border-gray-400">المنتج</th>
              <th class="p-1 border border-gray-400 w-24 text-center">الكمية الموردة (L)</th>
            </tr>
          </thead>
          <tbody class="text-[10px]">
            <tr v-for="(liters, fuelName) in reportData.supplies_by_fuel" :key="'sup' + fuelName">
              <td class="p-1 border border-gray-300 font-bold">{{ fuelName }}</td>
              <td class="p-1 border border-gray-300 text-center font-bold text-blue-700" dir="ltr">
                + {{ formatNumber(liters) }}
              </td>
            </tr>
            <tr v-if="Object.keys(reportData.supplies_by_fuel || {}).length === 0">
              <td colspan="2" class="p-1 border border-gray-300 text-center text-gray-400 italic">
                لا توجد توريدات
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="mb-6 break-inside-avoid">
      <h2 class="text-sm font-bold bg-gray-200 p-2 mb-2 border border-gray-300">
        تفصيل حركات الصندوق (سندات الصرف والإيداع)
      </h2>
      <table class="w-full text-right border-collapse table-auto border border-gray-400">
        <thead>
          <tr class="bg-gray-100 text-black text-[10px] font-bold">
            <th class="p-1 border border-gray-400 w-20">النوع</th>
            <th class="p-1 border border-gray-400">البيان / الوصف</th>
            <th class="p-1 border border-gray-400 w-24">الوردية</th>
            <th class="p-1 border border-gray-400 w-24 text-left">المبلغ</th>
          </tr>
        </thead>
        <tbody class="text-[10px]">
          <tr v-for="voucher in reportData.vouchers_list" :key="voucher.id">
            <td class="p-1 border border-gray-300 font-medium">{{ voucher.type_ar }}</td>
            <td class="p-1 border border-gray-300">{{ voucher.description || '---' }}</td>
            <td class="p-1 border border-gray-300 text-[9px]">{{ voucher.shift_name }}</td>
            <td class="p-1 border border-gray-300 text-left font-bold" dir="ltr">
              {{ voucher.type === 'deposit' ? '+' : '-' }} {{ formatCurrency(voucher.amount) }}
            </td>
          </tr>
          <tr v-if="!reportData.vouchers_list || reportData.vouchers_list.length === 0">
            <td colspan="4" class="p-2 border border-gray-300 text-center text-gray-500 italic">
              لا توجد حركات مالية
            </td>
          </tr>
        </tbody>
        <tfoot v-if="reportData.vouchers_list?.length > 0">
          <tr class="bg-gray-50 font-bold text-[10px]">
            <td colspan="3" class="p-1 border border-gray-400 text-left">
              إجمالي المصروفات المنصرفة:
            </td>
            <td class="p-1 border border-gray-400 text-left text-red-700" dir="ltr">
              {{ formatCurrency(reportData.financial_summary?.vouchers_summary?.total_expenses) }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div class="mb-8 break-inside-avoid">
      <h2 class="text-sm font-bold bg-gray-200 p-2 mb-2 border border-gray-300">
        حالة المخزون في الخزانات
      </h2>
      <table class="w-full text-right border-collapse table-auto border border-gray-400">
        <thead>
          <tr class="bg-gray-100 text-black text-[10px] font-bold">
            <th class="p-1 border border-gray-400">الخزان</th>
            <th class="p-1 border border-gray-400">المنتج</th>
            <th class="p-1 border border-gray-400 w-24 text-center">السعة القصوى</th>
            <th class="p-1 border border-gray-400 w-24 text-center">الرصيد الحالي</th>
            <th class="p-1 border border-gray-400 w-20 text-center">نسبة الامتلاء</th>
          </tr>
        </thead>
        <tbody class="text-[10px]">
          <tr v-for="tank in reportData.tanks_status" :key="tank.id">
            <td class="p-1 border border-gray-300 font-bold">{{ tank.name }}</td>
            <td class="p-1 border border-gray-300">{{ tank.fuel_type }}</td>
            <td class="p-1 border border-gray-300 text-center" dir="ltr">
              {{ formatNumber(tank.capacity) }}
            </td>
            <td class="p-1 border border-gray-300 text-center font-black" dir="ltr">
              {{ formatNumber(tank.current_stock) }}
            </td>
            <td class="p-1 border border-gray-300 text-center font-bold" dir="ltr">
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
        <p class="font-bold text-gray-800 text-xs">توقيع المحاسب المختص</p>
        <div class="border-b border-gray-400 w-48 mx-auto"></div>
      </div>
      <div class="space-y-10">
        <p class="font-bold text-gray-800 text-xs">اعتماد مدير المحطة / المالك</p>
        <div class="border-b border-gray-400 w-48 mx-auto"></div>
      </div>
    </div>

    <div
      class="print-footer fixed bottom-0 left-0 w-full text-center text-[9px] text-gray-400 border-t border-gray-200 pt-1 bg-white hidden print:block"
    >
      نظام إدارة محطات وقود - شركة باندا للتكنولوجيا - صفحة
      <span class="page-number text-black font-bold"></span>
    </div>
  </div>

  <div v-else class="flex justify-center items-center h-screen bg-white">
    <div class="text-center">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
      <p class="text-xl font-bold text-gray-500 font-sans">جاري تحضير نسخة الطباعة...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const reportData = ref(null)
const currentDate = new Date().toLocaleDateString('ar-LY')
const currentTime = new Date().toLocaleTimeString('ar-LY', { hour: '2-digit', minute: '2-digit' })

onMounted(() => {
  const savedData = sessionStorage.getItem('dailyMovementPrintData')
  if (savedData) {
    reportData.value = JSON.parse(savedData)
    // تشغيل أمر الطباعة التلقائي بعد رسم الصفحة
    setTimeout(() => {
      window.print()
    }, 1200)
  } else {
    alert('عذراً، لم يتم العثور على بيانات للطباعة.')
  }
})

const formatNumber = (value) => {
  if (value === undefined || value === null) return '0'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}

const formatCurrency = (val) => {
  const number = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  }).format(val || 0)
  return `${number} LYD`
}
</script>

<style scoped>
@media print {
  @page {
    size: A4 portrait;
    margin: 8mm;
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
