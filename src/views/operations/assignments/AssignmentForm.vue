<template>
  <div
    v-if="loading"
    class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-surface-ground"
  >
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p class="mt-4 text-gray-500">جاري تحميل بيانات التكليف...</p>
    </div>
  </div>

  <div
    v-else
    class="min-h-screen bg-gray-50 dark:bg-surface-ground py-8 px-4 sm:px-6 lg:px-8 font-english"
  >
    <div
      class="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-6"
    >
      <div>
        <h1 class="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
          <PencilSquareIcon v-if="isEditMode" class="h-8 w-8 text-blue-500" />
          <PlusCircleIcon v-else class="h-8 w-8 text-green-500" />
          {{ isEditMode ? 'تعديل وإغلاق التكليف' : 'إنشاء تكليف جديد' }}
        </h1>
        <p class="text-gray-500 dark:text-text-muted mt-1">
          نظام Petro Core - إدارة العمليات والتحصيل المالي
        </p>
      </div>

      <div class="flex items-center gap-4">
        <div class="text-left">
          <p class="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">حالة التكليف</p>
          <span
            :class="
              form.status === 'active'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-green-600 dark:text-green-400'
            "
            class="text-sm font-black"
          >
            ● {{ form.status === 'active' ? 'قيد العمل (Active)' : 'مكتمل (Completed)' }}
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
          class="bg-white dark:bg-surface-section rounded-2xl shadow-sm border border-gray-200 dark:border-surface-border p-6 transition-all hover:shadow-md"
        >
          <h3
            class="text-md font-bold text-gray-800 dark:text-text-primary mb-6 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3"
          >
            <UserIcon class="h-5 w-5 text-blue-500" /> مسؤولية المسدس والعامل
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <WorkersDropdown v-model="form.user_id" label="العامل المسؤول" :required="true" />
            <NozzlesDropdown v-model="form.nozzle_id" label="المسدس المستخدم" :required="true" />
          </div>
        </div>

        <div
          class="bg-white dark:bg-surface-section rounded-2xl shadow-sm border border-gray-200 dark:border-surface-border p-6 transition-all hover:shadow-md"
        >
          <h3
            class="text-md font-bold text-gray-800 dark:text-text-primary mb-6 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3"
          >
            <CalculatorIcon class="h-5 w-5 text-blue-500" /> قراءات العدادات والكميات
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <AppInput v-model="form.start_counter" label="عداد البداية" type="number" step="0.01" />
            <AppInput
              v-model="form.end_counter"
              label="عداد النهاية"
              type="number"
              step="0.01"
              :disabled="form.status === 'active'"
            />
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-text-secondary mb-1"
                >سعر اللتر</label
              >
              <div
                class="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 font-black text-gray-900 dark:text-white text-center text-lg"
                dir="ltr"
              >
                {{ formatCurrency(form.unit_price) }}
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              class="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 flex justify-between items-center"
            >
              <span class="text-sm font-bold text-blue-700 dark:text-blue-400"
                >إجمالي المبيعات (لتر)</span
              >
              <span class="text-2xl font-black text-gray-900 dark:text-white" dir="ltr"
                >{{ calculatedSoldLiters }} L</span
              >
            </div>
            <div
              class="p-4 bg-gray-900 dark:bg-surface-ground rounded-xl border border-gray-800 flex justify-between items-center shadow-inner"
            >
              <span class="text-sm font-bold text-gray-400">القيمة الإجمالية المطلوبة</span>
              <span class="text-2xl font-black text-blue-500" dir="ltr">{{
                formatCurrency(calculatedTotalAmount)
              }}</span>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-surface-section rounded-2xl shadow-sm border border-gray-200 dark:border-surface-border p-6 transition-all hover:shadow-md"
        >
          <div
            class="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-gray-800 pb-3"
          >
            <h3
              class="text-md font-bold text-gray-800 dark:text-text-primary flex items-center gap-2"
            >
              <BanknotesIcon class="h-5 w-5 text-green-500" /> سجل التحصيل المالي
            </h3>
            <span class="text-xs font-bold text-gray-400"
              >إجمالي المحصل: {{ formatCurrency(calculatedGrandTotalPaid) }}</span
            >
          </div>

          <div
            class="flex flex-wrap gap-3 mb-6 bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700"
          >
            <input
              type="number"
              step="0.001"
              v-model="paymentForm.amount"
              placeholder="المبلغ"
              class="flex-1 min-w-[120px] rounded-lg border-gray-300 dark:bg-gray-900 dark:border-gray-600 dark:text-white p-2.5"
            />
            <select
              v-model="paymentForm.payment_method"
              class="rounded-lg border-gray-300 dark:bg-gray-900 dark:border-gray-600 dark:text-white p-2.5"
            >
              <option value="cash">نقدي</option>
              <option value="visa">شبكة</option>
              <option value="sadad">سداد</option>
            </select>
            <button
              type="button"
              @click="addPayment"
              class="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-black transition-all shadow-sm"
            >
              إضافة
            </button>
          </div>

          <div class="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800">
            <table class="w-full text-right text-sm">
              <thead class="bg-gray-50 dark:bg-gray-800 text-gray-400 uppercase text-xs font-bold">
                <tr>
                  <th class="px-4 py-3">المبلغ</th>
                  <th class="px-4 py-3 text-center">الطريقة</th>
                  <th class="px-4 py-3 text-left">التوقيت</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50 dark:divide-gray-800">
                <tr
                  v-for="(txn, idx) in allTransactions"
                  :key="idx"
                  class="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                >
                  <td class="px-4 py-3 font-black text-gray-900 dark:text-white" dir="ltr">
                    {{ formatCurrency(txn.amount) }}
                  </td>
                  <td class="px-4 py-3 text-center">
                    <span
                      class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs uppercase"
                      >{{ txn.payment_method }}</span
                    >
                  </td>
                  <td class="px-4 py-3 text-left text-xs text-gray-400">
                    {{ txn.created_at || 'الآن' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div
          class="bg-white dark:bg-surface-section rounded-2xl shadow-sm border border-gray-200 dark:border-surface-border p-6"
        >
          <h3 class="text-xs font-black text-gray-400 uppercase mb-5 tracking-widest">
            إدارة الوقت والحالة
          </h3>
          <div class="space-y-5">
            <AppInput v-model="form.start_at" label="وقت البدء" type="datetime-local" />
            <AppInput
              v-model="form.end_at"
              label="وقت الإغلاق"
              type="datetime-local"
              :disabled="form.status === 'active'"
            />
            <div class="pt-2">
              <label class="block text-xs font-bold text-gray-500 mb-2">الحالة التشغيلية</label>
              <select
                v-model="form.status"
                class="w-full p-3 rounded-xl border-2 border-gray-200 dark:bg-gray-900 dark:border-gray-700 dark:text-white font-black text-sm transition-all focus:border-blue-500 outline-none"
              >
                <option value="active">جاري العمل (Active)</option>
                <option value="completed">مكتمل (Completed)</option>
              </select>
            </div>
          </div>
        </div>

        <div
          class="bg-gray-900 dark:bg-surface-card rounded-2xl p-6 border-l-8 border-blue-500 shadow-2xl text-white"
        >
          <h3 class="text-xs font-black text-blue-400 uppercase mb-6 tracking-widest text-center">
            التسوية النهائية للوردية
          </h3>
          <div class="space-y-6">
            <div
              class="flex justify-between items-center border-b border-gray-800 dark:border-gray-700 pb-4 font-english"
            >
              <span class="text-gray-400 text-sm">المطلوب (العدادات)</span>
              <span class="text-lg font-black" dir="ltr">{{
                formatCurrency(calculatedTotalAmount)
              }}</span>
            </div>
            <div
              class="flex justify-between items-center border-b border-gray-800 dark:border-gray-700 pb-4 font-english"
            >
              <span class="text-gray-400 text-sm">المحصل (الخزينة)</span>
              <span class="text-lg font-black text-green-400" dir="ltr">{{
                formatCurrency(calculatedGrandTotalPaid)
              }}</span>
            </div>
            <div class="pt-2 text-center">
              <p
                class="text-xs font-bold mb-2 uppercase tracking-tighter"
                :class="parseFloat(calculatedRemainingDue) > 0 ? 'text-red-400' : 'text-blue-400'"
              >
                {{
                  parseFloat(calculatedRemainingDue) > 0 ? 'عجز متبقي في العهدة' : 'الرصيد مطابق'
                }}
              </p>
              <div
                class="text-3xl font-black font-english"
                :class="parseFloat(calculatedRemainingDue) > 0 ? 'text-red-500' : 'text-green-500'"
                dir="ltr"
              >
                {{ formatCurrency(calculatedRemainingDue) }}
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-3 pt-4">
          <AppButton
            type="submit"
            variant="primary"
            :disabled="isSaving"
            class="w-full py-4 text-lg font-black shadow-xl ring-2 ring-blue-500/20"
          >
            {{ isSaving ? 'جاري الحفظ...' : 'حفظ البيانات والتصفية' }}
          </AppButton>
          <button
            type="button"
            @click="cancel"
            class="w-full py-3 text-gray-500 hover:text-red-500 dark:text-gray-400 font-bold transition-all"
          >
            إلغاء والعودة للجدول
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, watch, computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  PencilSquareIcon,
  PlusCircleIcon,
  UserIcon,
  CalculatorIcon,
  BanknotesIcon,
} from '@heroicons/vue/24/outline'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import NozzlesDropdown from '@/components/forms/NozzlesDropdown.vue'
import WorkersDropdown from '@/components/forms/WorkersDropdown.vue'
import { useNozzleStore } from '@/stores/nozzleStore'
import { useAssignmentStore } from '@/stores/assignmentStore'

// إعدادات الرواتر والمتاجر
const route = useRoute()
const router = useRouter()
const nozzleStore = useNozzleStore()
const assignmentStore = useAssignmentStore()

// الحالة (State)
const loading = ref(false)
const isSaving = ref(false)
const assignmentId = route.params.id // الحصول على الـ ID من الرابط
const isEditMode = computed(() => !!assignmentId)
const originalData = ref(null)

const form = reactive({
  user_id: '',
  nozzle_id: '',
  start_at: '',
  end_at: '',
  start_counter: '',
  end_counter: '',
  unit_price: 0,
  status: 'active',
  new_transactions: [],
})

const paymentForm = reactive({ amount: '', payment_method: 'cash' })

// عند تشغيل الصفحة
onMounted(async () => {
  if (isEditMode.value) {
    loading.value = true
    try {
      // جلب بيانات التكليف من الـ Store
      const data = await assignmentStore.getAssignmentById(assignmentId)
      if (data) {
        originalData.value = data
        Object.assign(form, {
          user_id: data.user_id,
          nozzle_id: data.nozzle_id,
          start_at: data.start_at?.substring(0, 16), // تنسيق للـ datetime-local
          end_at: data.end_at?.substring(0, 16),
          start_counter: data.start_counter,
          end_counter: data.end_counter,
          unit_price: data.unit_price,
          status: data.status,
          new_transactions: [],
        })
      }
    } catch (error) {
      console.error('خطأ في جلب البيانات:', error)
    } finally {
      loading.value = false
    }
  }
})

// التنسيقات والحسابات (كما هي مع تعديلات طفيفة)
const formatCurrency = (val) => {
  const num = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(val || 0)
  return `${num} د.ل`
}

const calculatedSoldLiters = computed(() => {
  const diff = (parseFloat(form.end_counter) || 0) - (parseFloat(form.start_counter) || 0)
  return diff > 0 ? diff.toFixed(2) : '0.00'
})

const calculatedTotalAmount = computed(() =>
  (parseFloat(calculatedSoldLiters.value) * form.unit_price).toFixed(3),
)

const calculatedGrandTotalPaid = computed(() => {
  const existing = parseFloat(originalData.value?.total_paid || 0)
  const newlyAdded = form.new_transactions.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)
  return (existing + newlyAdded).toFixed(3)
})

const calculatedRemainingDue = computed(() => {
  const res = parseFloat(calculatedTotalAmount.value) - parseFloat(calculatedGrandTotalPaid.value)
  return res > 0 ? res.toFixed(3) : '0.000'
})

const addPayment = () => {
  if (paymentForm.amount > 0) {
    form.new_transactions.push({ ...paymentForm })
    paymentForm.amount = ''
  }
}

const allTransactions = computed(() => [
  ...(originalData.value?.transactions || []),
  ...form.new_transactions,
])

// مراقبة تغيير المسدس لجلب السعر والقراءة الابتدائية
watch(
  () => form.nozzle_id,
  (id) => {
    if (!isEditMode.value) {
      // فقط في حالة الإضافة الجديدة
      const n = nozzleStore.nozzles.find((x) => x.id === id)
      if (n) {
        form.unit_price = n.fuel_price || 0
        form.start_counter = n.current_counter
      }
    }
  },
)

// الحفظ والعودة
const handleSubmit = async () => {
  isSaving.value = true
  try {
    const payload = {
      ...form,
      sold_liters: calculatedSoldLiters.value,
      total_amount: calculatedTotalAmount.value,
    }

    if (isEditMode.value) {
      await assignmentStore.updateAssignment(assignmentId, payload)
    } else {
      await assignmentStore.createAssignment(payload)
    }

    router.push({ name: 'AssignmentsList' }) // العودة للجدول بعد النجاح
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

<style scoped>
.font-english {
  font-family: 'Inter', system-ui, sans-serif;
}
</style>
