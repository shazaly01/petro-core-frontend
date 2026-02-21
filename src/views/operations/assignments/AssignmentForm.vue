<template>
  <div
    v-if="loading"
    class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-surface-ground"
  >
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-4 text-gray-500 font-bold">جاري تحميل بيانات التكليف...</p>
    </div>
  </div>

  <div v-else class="min-h-screen bg-gray-50 dark:bg-surface-ground py-8 px-4 sm:px-6 lg:px-8">
    <div
      class="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-6"
    >
      <div>
        <h1
          class="text-2xl font-black flex items-center gap-2"
          :class="isCompleted ? 'text-green-600' : 'text-gray-900 dark:text-white'"
        >
          <PencilSquareIcon v-if="isEditMode && !isCompleted" class="h-8 w-8 text-blue-500" />
          <CheckCircleIcon v-else-if="isCompleted" class="h-8 w-8 text-green-500" />
          <PlusCircleIcon v-else class="h-8 w-8 text-blue-500" />
          {{
            !isEditMode
              ? 'فتح تكليف وردية جديد'
              : isCompleted
                ? 'تعديل بيانات الوردية (مغلقة)'
                : 'إغلاق التكليف والتسوية'
          }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">
          نظام إدارة المحطة - تبسيط العمليات والتحصيل
        </p>
      </div>

      <div
        v-if="isEditMode"
        class="flex items-center gap-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div class="text-center">
          <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-1">
            حالة التكليف
          </p>
          <span
            :class="isCompleted ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'"
            class="px-3 py-1 rounded-full text-xs font-black"
          >
            {{ isCompleted ? 'مكتمل ومغلق' : 'قيد العمل (نشط)' }}
          </span>
        </div>
      </div>
    </div>

    <form
      @submit.prevent="handleSubmit"
      class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      <div class="lg:col-span-2 space-y-6">
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h3
            class="text-md font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-3"
          >
            <UserIcon class="h-5 w-5 text-blue-500" /> مسؤولية الوردية
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <WorkersDropdown
              id="user_id"
              v-model="form.user_id"
              label="العامل المسؤول"
              :required="true"
              :disabled="isEditMode"
            />
            <PumpsDropdown
              id="pump_id"
              v-model="form.pump_id"
              label="المضخة المستخدمة"
              :required="true"
              :disabled="isEditMode"
            />
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div
            class="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-gray-700 pb-3"
          >
            <h3 class="text-md font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <CalculatorIcon class="h-5 w-5 text-blue-500" /> قراءات العدادات
            </h3>
            <div
              class="text-sm font-bold text-gray-500 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg"
            >
              سعر اللتر:
              <span class="text-blue-600 dark:text-blue-400 font-black" dir="ltr">{{
                formatCurrency(form.unit_price)
              }}</span>
            </div>
          </div>

          <div
            class="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700"
          >
            <div class="flex items-center gap-2 mb-4">
              <img
                src="/nozzle.png"
                alt="nozzle icon"
                class="w-6 h-6 rounded-full"
                style="transform: scale(1.2)"
              />
              <h4 class="text-base font-black text-gray-800 dark:text-gray-200">
                المسدس الأول (1)
              </h4>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <AppNumberInput
                id="start_counter_1"
                v-model="form.start_counter_1"
                label="عداد البداية (تلقائي)"
                type="number"
                step="0.01"
                disabled
              />
              <AppNumberInput
                id="end_counter_1"
                v-model="form.end_counter_1"
                label="عداد النهاية"
                type="number"
                step="0.01"
                :disabled="!isEditMode"
                :required="isEditMode"
              />
              <div
                class="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 text-center"
              >
                <span class="block text-xs text-gray-500 mb-1">المباع</span>
                <span class="font-black text-lg text-gray-900 dark:text-white" dir="ltr"
                  >{{ calculatedSold1 }} L</span
                >
              </div>
            </div>
          </div>

          <div
            class="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700"
          >
            <div class="flex items-center gap-2 mb-4">
              <img
                src="/nozzle.png"
                alt="nozzle icon"
                class="w-6 h-6 rounded-full"
                style="transform: scale(1.2)"
              />
              <h4 class="text-base font-black text-gray-800 dark:text-gray-200">
                المسدس الثاني (2)
              </h4>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <AppNumberInput
                id="start_counter_2"
                v-model="form.start_counter_2"
                label="عداد البداية (تلقائي)"
                type="number"
                step="0.01"
                disabled
              />
              <AppNumberInput
                id="end_counter_2"
                v-model="form.end_counter_2"
                label="عداد النهاية"
                type="number"
                step="0.01"
                :disabled="!isEditMode"
                :required="isEditMode"
              />
              <div
                class="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 text-center"
              >
                <span class="block text-xs text-gray-500 mb-1">المباع</span>
                <span class="font-black text-lg text-gray-900 dark:text-white" dir="ltr"
                  >{{ calculatedSold2 }} L</span
                >
              </div>
            </div>
          </div>

          <div
            class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 flex justify-between items-center"
          >
            <span class="font-bold text-blue-800 dark:text-blue-300"
              >إجمالي اللترات المباعة للمضخة</span
            >
            <span class="text-2xl font-black text-blue-600 dark:text-blue-400" dir="ltr"
              >{{ calculatedTotalLiters }} L</span
            >
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div
          class="bg-gray-900 dark:bg-gray-950 rounded-2xl p-6 border-t-8 border-green-500 shadow-xl text-white"
        >
          <h3
            class="text-base font-black text-green-400 uppercase mb-6 flex items-center justify-center gap-2"
          >
            <BanknotesIcon class="h-7 w-7" /> التحصيل المالي
          </h3>

          <div v-if="isEditMode" class="space-y-5 mb-8">
            <AppNumberInput
              id="cash_amount"
              v-model="form.cash_amount"
              label="المبلغ المستلم كاش"
              type="number"
              step="0.001"
              placeholder="0.000"
              class="text-black text-lg font-bold"
            />
            <AppNumberInput
              id="bank_amount"
              v-model="form.bank_amount"
              label="مبالغ الشبكة / البنك"
              type="number"
              step="0.001"
              placeholder="0.000"
              class="text-black text-lg font-bold"
            />
          </div>
          <div
            v-else
            class="text-center text-gray-400 text-sm mb-6 bg-gray-800 p-4 rounded-xl border border-gray-700"
          >
            سيتم إدخال النقدية عند نهاية الوردية.
          </div>

          <div class="space-y-4 border-t border-gray-700 pt-6">
            <div class="flex justify-between items-center">
              <span class="text-gray-300 text-base font-bold">القيمة المطلوبة (حسب العداد)</span>
              <span class="text-xl font-black" dir="ltr">{{
                formatCurrency(calculatedExpectedAmount)
              }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-300 text-base font-bold">إجمالي المدخل (كاش + شبكة)</span>
              <span class="text-xl font-black text-blue-400" dir="ltr">{{
                formatCurrency(calculatedTotalPaid)
              }}</span>
            </div>

            <div
              v-if="isEditMode"
              class="mt-8 p-5 rounded-2xl text-center"
              :class="
                calculatedDifference < 0
                  ? 'bg-red-500/20 border-2 border-red-500/50'
                  : calculatedDifference > 0
                    ? 'bg-green-500/20 border-2 border-green-500/50'
                    : 'bg-gray-800 border-2 border-gray-700'
              "
            >
              <p class="text-sm font-black mb-2 uppercase tracking-wider">
                {{
                  calculatedDifference < 0
                    ? 'عجز في العهدة (-)'
                    : calculatedDifference > 0
                      ? 'زيادة في العهدة (+)'
                      : 'الرصيد مطابق تماماً'
                }}
              </p>
              <div
                class="text-4xl font-black"
                :class="
                  calculatedDifference < 0
                    ? 'text-red-400'
                    : calculatedDifference > 0
                      ? 'text-green-400'
                      : 'text-white'
                "
                dir="ltr"
              >
                {{ formatCurrency(Math.abs(calculatedDifference)) }}
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-3 pt-2">
          <AppButton
            type="submit"
            variant="primary"
            :disabled="isSaving"
            class="w-full py-4 text-xl font-black shadow-lg"
          >
            {{
              isSaving
                ? 'جاري المعالجة...'
                : !isEditMode
                  ? 'بدء التكليف (فتح الوردية)'
                  : isCompleted
                    ? 'حفظ التعديلات وتحديث التسوية'
                    : 'إغلاق الوردية والتسوية'
            }}
          </AppButton>

          <button
            type="button"
            @click="cancel"
            class="w-full py-3 text-gray-500 hover:text-red-500 font-bold transition-all bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            إلغاء والعودة للقائمة
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  PencilSquareIcon,
  PlusCircleIcon,
  CheckCircleIcon,
  UserIcon,
  CalculatorIcon,
  BanknotesIcon,
} from '@heroicons/vue/24/outline'
import AppNumberInput from '@/components/ui/AppNumberInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import WorkersDropdown from '@/components/forms/WorkersDropdown.vue'
import PumpsDropdown from '@/components/forms/PumpsDropdown.vue'
import { useAssignmentStore } from '@/stores/assignmentStore'
import { usePumpStore } from '@/stores/pumpStore'

const route = useRoute()
const router = useRouter()
const assignmentStore = useAssignmentStore()
const pumpStore = usePumpStore()

const loading = ref(false)
const isSaving = ref(false)
const assignmentId = route.params.id
const isEditMode = computed(() => !!assignmentId)

const form = reactive({
  user_id: '',
  pump_id: '',
  start_counter_1: '',
  end_counter_1: '',
  start_counter_2: '',
  end_counter_2: '',
  cash_amount: '',
  bank_amount: '',
  unit_price: 0,
  status: 'active',
})

const isCompleted = computed(() => form.status === 'completed')

onMounted(async () => {
  if (isEditMode.value) {
    loading.value = true
    try {
      await assignmentStore.fetchAssignment(assignmentId)
      const data = assignmentStore.currentAssignment

      if (data) {
        form.user_id = data.user?.id || data.user_id || ''
        form.pump_id = data.pump?.id || data.pump_id || ''

        form.start_counter_1 = data.start_counter_1 !== null ? Number(data.start_counter_1) : ''
        form.end_counter_1 = data.end_counter_1 !== null ? Number(data.end_counter_1) : ''
        form.start_counter_2 = data.start_counter_2 !== null ? Number(data.start_counter_2) : ''
        form.end_counter_2 = data.end_counter_2 !== null ? Number(data.end_counter_2) : ''

        form.cash_amount = data.cash_amount !== null ? Number(data.cash_amount) : ''
        form.bank_amount = data.bank_amount !== null ? Number(data.bank_amount) : ''

        form.unit_price = data.unit_price || data.current_live_price || 0
        form.status = data.status || 'active'
      }
    } catch (error) {
      console.error('حدث خطأ أثناء تحميل بيانات التكليف:', error)
    } finally {
      loading.value = false
    }
  }
})

watch(
  () => form.pump_id,
  async (newPumpId) => {
    if (!isEditMode.value && newPumpId) {
      const p = await pumpStore.getPumpById(newPumpId)
      if (p) {
        form.start_counter_1 = p.current_counter_1
        form.start_counter_2 = p.current_counter_2
        form.unit_price = p.tank?.fuelType?.current_price || p.unit_price || 0
      }
    }
  },
)

// --- الحسابات التلقائية (Computed) ---

const formatCurrency = (val) => {
  const num = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0, // 🛑 التعديل هنا: جعلناه 0 لإخفاء الكسور الصفرية
    maximumFractionDigits: 3, // سيظهر الكسر فقط إذا كان موجوداً (حتى 3 خانات)
  }).format(val || 0)

  return `${num} د.ل`
}

const calculatedSold1 = computed(() => {
  if (!isEditMode.value || !form.end_counter_1) return '0.00'
  const diff = (parseFloat(form.end_counter_1) || 0) - (parseFloat(form.start_counter_1) || 0)
  return diff > 0 ? diff.toFixed(2) : '0.00'
})

const calculatedSold2 = computed(() => {
  if (!isEditMode.value || !form.end_counter_2) return '0.00'
  const diff = (parseFloat(form.end_counter_2) || 0) - (parseFloat(form.start_counter_2) || 0)
  return diff > 0 ? diff.toFixed(2) : '0.00'
})

const calculatedTotalLiters = computed(() => {
  return (parseFloat(calculatedSold1.value) + parseFloat(calculatedSold2.value)).toFixed(2)
})

const calculatedExpectedAmount = computed(() => {
  return (parseFloat(calculatedTotalLiters.value) * form.unit_price).toFixed(3)
})

const calculatedTotalPaid = computed(() => {
  return ((parseFloat(form.cash_amount) || 0) + (parseFloat(form.bank_amount) || 0)).toFixed(3)
})

const calculatedDifference = computed(() => {
  return (
    parseFloat(calculatedTotalPaid.value) - parseFloat(calculatedExpectedAmount.value)
  ).toFixed(3)
})

// --- الحفظ وإرسال البيانات ---
const handleSubmit = async () => {
  isSaving.value = true
  try {
    const payload = { ...form }

    if (!payload.end_counter_1 || payload.end_counter_1 === '') {
      payload.end_counter_1 = payload.start_counter_1
    }

    if (!payload.end_counter_2 || payload.end_counter_2 === '') {
      payload.end_counter_2 = payload.start_counter_2
    }
    if (!payload.cash_amount) payload.cash_amount = 0
    if (!payload.bank_amount) payload.bank_amount = 0

    if (isEditMode.value) {
      payload.status = 'completed' // نرسلها دائماً لضمان حسابها في الباك-إند
      await assignmentStore.updateAssignment(assignmentId, payload)
    } else {
      await assignmentStore.createAssignment(payload)
    }

    router.push({ name: 'AssignmentsList' })
  } catch (error) {
    console.error('خطأ في الحفظ:', error)
  } finally {
    isSaving.value = false
  }
}

const cancel = () => {
  router.push({ name: 'AssignmentsList' })
}
</script>
