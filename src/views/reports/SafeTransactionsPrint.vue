<template>
  <div
    v-if="reportData"
    class="print-portrait-container bg-white text-black p-8 font-sans"
    dir="rtl"
  >
    <div class="flex justify-between items-center border-b-2 border-gray-900 pb-4 mb-6">
      <div class="flex items-center gap-4">
        <img src="/MainLogo2.png" alt="Logo" class="w-16 h-16 object-contain" />
        <div>
          <h1 class="text-2xl font-black text-gray-900 tracking-tight">محطة وقود</h1>
          <p class="text-base font-bold text-gray-600">كشف حركة الخزينة التفصيلي (الصندوق)</p>
        </div>
      </div>
      <div class="text-right text-xs font-medium text-gray-600 border-r-2 border-gray-300 pr-4">
        <p class="mb-1">
          <span class="font-bold">الفترة:</span>
          <span dir="ltr" class="font-bold">{{ reportData.date_range }}</span>
        </p>
        <p><span class="font-bold">تاريخ الطباعة:</span> {{ currentDate }} - {{ currentTime }}</p>
      </div>
    </div>

    <div class="mb-6 bg-gray-100 p-5 border-2 border-gray-300 rounded-xl text-center">
      <p class="text-sm font-bold text-gray-700 mb-1 uppercase tracking-wider">
        الرصيد الفعلي المتبقي في الخزينة
      </p>
      <h2 class="text-4xl font-black text-gray-900" dir="ltr">
        {{ formatCurrency(reportData.current_safe_balance) }}
      </h2>
    </div>

    <div class="grid grid-cols-4 gap-4 mb-8">
      <div class="border border-gray-400 p-3 rounded-lg text-center bg-gray-50">
        <p class="text-[10px] font-bold text-gray-500 uppercase mb-1">إجمالي الإيداعات (+)</p>
        <p class="text-base font-bold text-green-800" dir="ltr">
          {{ formatCurrency(reportData.summary.total_deposits) }}
        </p>
      </div>
      <div class="border border-gray-400 p-3 rounded-lg text-center bg-gray-50">
        <p class="text-[10px] font-bold text-gray-500 uppercase mb-1">إجمالي المصروفات (-)</p>
        <p class="text-base font-bold text-orange-800" dir="ltr">
          {{ formatCurrency(reportData.summary.total_expenses) }}
        </p>
      </div>
      <div class="border border-gray-400 p-3 rounded-lg text-center bg-gray-50">
        <p class="text-[10px] font-bold text-gray-500 uppercase mb-1">مسحوبات بنكية (-)</p>
        <p class="text-base font-bold text-red-800" dir="ltr">
          {{ formatCurrency(reportData.summary.total_withdrawals) }}
        </p>
      </div>
      <div class="border border-gray-400 p-3 rounded-lg text-center bg-gray-50">
        <p class="text-[10px] font-bold text-gray-500 uppercase mb-1">عدد العمليات</p>
        <p class="text-base font-bold text-gray-900">{{ reportData.summary.transactions_count }}</p>
      </div>
    </div>

    <div class="mb-8">
      <h3 class="text-sm font-bold mb-3 border-r-4 border-gray-800 pr-2">سجل الحركات التفصيلي:</h3>
      <table class="w-full text-right border-collapse table-auto border border-gray-500">
        <thead>
          <tr class="bg-gray-800 text-white print:bg-gray-200 print:text-black text-[11px]">
            <th class="p-2 border border-gray-500 w-32">رقم السند</th>
            <th class="p-2 border border-gray-500 w-24 text-center">النوع</th>
            <th class="p-2 border border-gray-500">البيان / الوصف</th>
            <th class="p-2 border border-gray-500 w-32 text-center">التاريخ والوقت</th>
            <th class="p-2 border border-gray-500 w-28 text-left">المبلغ</th>
          </tr>
        </thead>
        <tbody class="text-[10px]">
          <tr
            v-for="voucher in reportData.vouchers"
            :key="voucher.id"
            class="border-b border-gray-300"
          >
            <td class="p-2 border-r border-gray-300 font-mono text-center">
              #{{ voucher.voucher_no }}
            </td>
            <td class="p-2 border-r border-gray-300 text-center font-bold">
              {{ voucher.type_ar }}
            </td>
            <td class="p-2 border-r border-gray-300">{{ voucher.description || '---' }}</td>
            <td class="p-2 border-r border-gray-300 text-center font-mono text-[9px]" dir="ltr">
              {{ voucher.date }}
            </td>
            <td class="p-2 font-bold text-left whitespace-nowrap" dir="ltr">
              {{ voucher.type === 'deposit' ? '+' : '-' }} {{ formatCurrency(voucher.amount) }}
            </td>
          </tr>
          <tr v-if="!reportData.vouchers || reportData.vouchers.length === 0">
            <td colspan="5" class="p-4 text-center text-gray-500 italic">
              لا توجد حركات مالية مسجلة لهذه الفترة.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      class="mt-20 grid grid-cols-2 gap-10 text-center pt-8 border-t-2 border-gray-800 break-inside-avoid"
    >
      <div class="space-y-12">
        <p class="font-bold text-gray-900 text-sm italic underline">
          توقيع المسؤول المالي / المحاسب
        </p>
        <div class="border-b border-gray-400 w-64 mx-auto mt-4"></div>
        <p class="text-[10px] text-gray-500 italic">
          الاسم: ............................................
        </p>
      </div>
      <div class="space-y-12">
        <p class="font-bold text-gray-900 text-sm italic underline">اعتماد مدير المحطة / المالك</p>
        <div class="border-b border-gray-400 w-64 mx-auto mt-4"></div>
        <p class="text-[10px] text-gray-500 italic">الختم الرسمي:</p>
      </div>
    </div>

    <div
      class="print-footer fixed bottom-0 left-0 w-full text-center text-[9px] text-gray-500 border-t border-gray-200 pt-1 bg-white hidden print:block"
    >
      نظام إدارة محطات وقود باندا - كشف حساب الخزينة - صفحة
      <span class="page-number font-bold text-black"></span>
    </div>
  </div>

  <div v-else class="flex justify-center items-center h-screen bg-white">
    <div class="text-center">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
      <p class="text-lg font-bold text-gray-400">جاري تحضير المستند للطباعة...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const reportData = ref(null)
const currentDate = new Date().toLocaleDateString('ar-LY')
const currentTime = new Date().toLocaleTimeString('ar-LY', { hour: '2-digit', minute: '2-digit' })

onMounted(() => {
  // جلب البيانات من الجلسة التي تم تخزينها من صفحة التقرير
  const savedData = sessionStorage.getItem('safeTransactionsPrintData')
  if (savedData) {
    reportData.value = JSON.parse(savedData)

    // تشغيل نافذة الطباعة تلقائياً بعد ثانية واحدة لضمان رسم الجداول
    setTimeout(() => {
      window.print()
    }, 1000)
  } else {
    alert('عذراً، لا توجد بيانات متاحة للطباعة.')
  }
})

// تنسيق المبالغ المالية
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
    margin: 12mm;
  }
  body {
    background-color: white !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
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
}

/* منع قطع الجداول والصفوف بين الصفحات */
tr,
table,
.break-inside-avoid {
  break-inside: avoid;
  page-break-inside: avoid;
}

/* تجميل شكل الطباعة */
table {
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #374151; /* gray-700 */
}
</style>
