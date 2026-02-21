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
          <p class="text-base font-bold text-gray-600">كشف حساب حركة خزان (Ledger)</p>
        </div>
      </div>

      <div class="text-right text-xs font-medium text-gray-600 border-r-2 border-gray-300 pr-4">
        <p><span class="font-bold">رقم الخزان:</span> {{ reportData.tank_info?.name }}</p>
        <p>
          <span class="font-bold">نوع الوقود:</span> {{ reportData.tank_info?.fuel_type?.name }}
        </p>
        <p class="mt-1">
          <span class="font-bold">تاريخ الطباعة:</span> {{ currentDate }} - {{ currentTime }}
        </p>
      </div>
    </div>

    <div class="bg-gray-100 p-2 text-center text-sm font-bold border border-gray-300 mb-4 rounded">
      الحركات المسجلة للفترة من
      <span dir="ltr">{{ formatDateOnly(reportData.period.from) }}</span> إلى
      <span dir="ltr">{{ formatDateOnly(reportData.period.to) }}</span>
    </div>

    <div class="grid grid-cols-3 gap-4 mb-6 break-inside-avoid">
      <div class="border-2 border-gray-300 p-3 rounded bg-white text-center">
        <p class="text-gray-500 text-[10px] font-bold mb-1 uppercase">الرصيد الافتتاحي</p>
        <p class="text-lg font-bold text-gray-800" dir="ltr">
          {{ formatNumber(reportData.opening_balance) }} L
        </p>
      </div>

      <div class="border-2 border-gray-300 p-3 rounded bg-white text-center">
        <p class="text-gray-500 text-[10px] font-bold mb-1 uppercase">صافي الحركة (وارد - منصرف)</p>
        <p
          class="text-lg font-bold"
          dir="ltr"
          :class="netMovement >= 0 ? 'text-emerald-700' : 'text-rose-700'"
        >
          <span v-if="netMovement > 0">+</span>{{ formatNumber(netMovement) }} L
        </p>
      </div>

      <div class="border-2 border-gray-800 p-3 rounded bg-gray-50 text-center">
        <p class="text-gray-800 text-[11px] font-black mb-1 uppercase">الرصيد الختامي (الحالي)</p>
        <p class="text-xl font-black text-black" dir="ltr">
          {{ formatNumber(reportData.current_balance) }} L
        </p>
      </div>
    </div>

    <div class="w-full">
      <table class="w-full text-right border-collapse table-auto">
        <thead>
          <tr class="bg-gray-800 text-white print:bg-gray-300 print:text-black text-[11px]">
            <th class="p-2 border border-gray-400 w-24">التاريخ والوقت</th>
            <th class="p-2 border border-gray-400 w-32">نوع الحركة</th>
            <th class="p-2 border border-gray-400 w-24 text-center">الكمية (لتر)</th>
            <th class="p-2 border border-gray-400 w-24 text-center">الرصيد قبل</th>
            <th class="p-2 border border-gray-400 w-24 text-center">الرصيد بعد</th>
            <th class="p-2 border border-gray-400">البيان والمستخدم</th>
          </tr>
        </thead>
        <tbody class="text-[11px]">
          <tr
            v-for="move in reportData.movements"
            :key="move.id"
            class="border-b border-gray-300 hover:bg-gray-50"
          >
            <td class="p-1.5 border border-gray-300 text-[10px]" dir="ltr">{{ move.date }}</td>
            <td class="p-1.5 border border-gray-300 font-bold">{{ move.type }}</td>
            <td
              class="p-1.5 border border-gray-300 text-center font-bold"
              dir="ltr"
              :class="getQuantityColorClass(move)"
            >
              <span v-if="isAddition(move)">+</span><span v-else-if="isSubtraction(move)">-</span>
              {{ formatNumber(move.quantity) }}
            </td>
            <td class="p-1.5 border border-gray-300 text-center text-gray-600" dir="ltr">
              {{ formatNumber(move.balance_before) }}
            </td>
            <td class="p-1.5 border border-gray-300 text-center font-black text-gray-900" dir="ltr">
              {{ formatNumber(move.balance_after) }}
            </td>
            <td class="p-1.5 border border-gray-300 text-gray-700">
              <span class="font-bold text-black">{{ move.user || 'نظام' }}</span>
              <span v-if="move.notes" class="block text-[10px] text-gray-500 mt-0.5">{{
                move.notes
              }}</span>
            </td>
          </tr>
          <tr v-if="reportData.movements.length === 0">
            <td colspan="6" class="p-4 border border-gray-300 text-center text-gray-500 font-bold">
              لا توجد أي حركات مسجلة على هذا الخزان خلال الفترة المحددة.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      class="mt-12 grid grid-cols-3 gap-4 text-center pt-8 border-t-2 border-gray-800 break-inside-avoid"
    >
      <div class="space-y-10">
        <p class="font-bold text-gray-800 text-sm">أمين المستودع (المستلم)</p>
        <div class="border-b border-gray-400 w-40 mx-auto"></div>
      </div>
      <div class="space-y-10">
        <p class="font-bold text-gray-800 text-sm">المراجعة المحاسبية</p>
        <div class="border-b border-gray-400 w-40 mx-auto"></div>
      </div>
      <div class="space-y-10">
        <p class="font-bold text-gray-800 text-sm">اعتماد مدير المحطة</p>
        <div class="border-b border-gray-400 w-40 mx-auto"></div>
      </div>
    </div>

    <div
      class="print-footer fixed bottom-0 left-0 w-full text-center text-[10px] text-gray-500 border-t border-gray-200 pt-1 bg-white hidden print:block"
    >
      نظام إدارة محطات الوقود | كشف حساب مخزون - صفحة <span class="page-number"></span>
    </div>
  </div>
  <div v-else class="flex justify-center items-center h-screen bg-white">
    <p class="text-xl font-bold text-gray-500">جاري تجهيز كشف الحساب للطباعة...</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const reportData = ref(null)
const currentDate = new Date().toLocaleDateString('ar-EG')
const currentTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })

onMounted(() => {
  const savedData = sessionStorage.getItem('tankLedgerPrintData')
  if (savedData) {
    reportData.value = JSON.parse(savedData)

    // تأخير بسيط لرسم الجدول قبل استدعاء نافذة الطباعة
    setTimeout(() => {
      window.print()
    }, 1000)
  } else {
    alert('لا توجد بيانات للطباعة. الرجاء العودة لصفحة التقرير.')
  }
})

// العمليات الحسابية
const netMovement = computed(() => {
  if (!reportData.value) return 0
  return reportData.value.current_balance - reportData.value.opening_balance
})

const isAddition = (move) => move.balance_after > move.balance_before
const isSubtraction = (move) => move.balance_after < move.balance_before

const getQuantityColorClass = (move) => {
  if (isAddition(move)) return 'text-emerald-700 print:text-black'
  if (isSubtraction(move)) return 'text-rose-700 print:text-black'
  return 'text-gray-700 print:text-black'
}

// التنسيقات
const formatNumber = (value) => {
  if (value === undefined || value === null) return '0.00'
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

const formatDateOnly = (dateString) => {
  if (!dateString) return ''
  return dateString.split(' ')[0]
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
  @page {
    margin-top: 10mm;
    margin-bottom: 15mm;
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
