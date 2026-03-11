<template>
  <form @submit.prevent="submitForm" class="space-y-4">
    <div>
      <TanksDropdown
        id="tank_id"
        label="الخزان المستلم"
        v-model="form.tank_id"
        :required="true"
        placeholder="اختر الخزان..."
      />
    </div>

    <hr class="border-gray-200 dark:border-gray-700 my-2" />

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <AppNumberInput
        id="quantity"
        label="الكمية الموردة (لتر)"
        v-model="form.quantity"
        placeholder="أدخل الكمية"
      />

      <AppNumberInput
        id="cost_price"
        label="سعر التكلفة (للتر)"
        v-model="form.cost_price"
        type="number"
        step="0.0001"
        placeholder="0.0000"
        :required="true"
      />
    </div>

    <div
      class="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg border border-gray-200 dark:border-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      <AppNumberInput
        id="stock_before"
        label="مخزون ما قبل التعبئة"
        v-model="form.stock_before"
        type="number"
        step="0.01"
        placeholder="0.00"
        :required="true"
      />

      <div>
        <AppNumberInput
          id="stock_after"
          label="مخزون ما بعد التعبئة"
          v-model="form.stock_after"
          type="number"
          step="0.01"
          placeholder="0.00"
          :required="true"
        />
        <p v-if="calculatedStockAfter > 0" class="text-xs text-gray-500 mt-1">
          المتوقع نظرياً: <span class="font-bold">{{ formatNumber(calculatedStockAfter) }}</span>
        </p>
      </div>
    </div>

    <hr class="border-gray-200 dark:border-gray-700 my-2" />

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <AppInput
        id="invoice_number"
        label="رقم الاشعار"
        v-model="form.invoice_number"
        placeholder="123-..."
      />

      <AppInput
        id="driver_name"
        label="اسم السائق"
        v-model="form.driver_name"
        placeholder="اسم السائق"
        :required="true"
      />

      <AppInput
        id="truck_plate_number"
        label="رقم الشاحنة (اللوحة)"
        v-model="form.truck_plate_number"
        placeholder="أ 123"
        :required="true"
      />
    </div>

    <div
      class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-surface-border"
    >
      <AppButton type="button" variant="secondary" @click="$emit('cancel')"> إلغاء </AppButton>

      <AppButton type="submit" variant="primary" :disabled="isSaving">
        <span
          v-if="isSaving"
          class="ml-2 animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"
        ></span>
        {{ isSaving ? 'جاري الحفظ...' : 'حفظ التوريد' }}
      </AppButton>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch, computed } from 'vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppNumberInput from '@/components/ui/AppNumberInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import QuantityInput from '@/components/ui/QuantityInput.vue'
import TanksDropdown from '@/components/forms/TanksDropdown.vue'

// 🛑 1. استيراد مخزن المصادقة لجلب بيانات المستخدم الحالي
import { useAuthStore } from '@/stores/authStore'

const props = defineProps({
  initialData: { type: Object, default: null },
  isSaving: { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'cancel'])

// 🛑 2. تهيئة مخزن المصادقة
const authStore = useAuthStore()

const form = reactive({
  tank_id: '',
  quantity: '',
  cost_price: '',
  driver_name: '',
  truck_plate_number: '',
  invoice_number: '',
  stock_before: '',
  stock_after: '',
})

const calculatedStockAfter = computed(() => {
  const before = parseFloat(form.stock_before) || 0
  const qty = parseFloat(form.quantity) || 0
  return before + qty
})

watch([() => form.stock_before, () => form.quantity], () => {
  // الحساب التلقائي يعمل دائماً (في الإضافة والتعديل) بمجرد تغيير الكمية أو المخزون السابق
  form.stock_after = calculatedStockAfter.value
})

watch(
  () => props.initialData,
  (newVal) => {
    if (newVal) {
      form.tank_id = newVal.tank_id
      form.quantity = newVal.quantity
      form.cost_price = newVal.cost_price
      form.driver_name = newVal.driver_name
      form.truck_plate_number = newVal.truck_plate_number
      form.invoice_number = newVal.invoice_number
      form.stock_before = newVal.stock_before
      form.stock_after = newVal.stock_after
    } else {
      form.tank_id = ''
      form.quantity = ''
      form.cost_price = ''
      form.driver_name = ''
      form.truck_plate_number = ''
      form.invoice_number = ''
      form.stock_before = ''
      form.stock_after = ''
    }
  },
  { immediate: true },
)

const submitForm = () => {
  // 🛑 3. إرفاق معرف المستخدم (المشرف) الحالي برمجياً وبشكل مخفي
  const payload = {
    ...form,
    supervisor_id: authStore.user?.id,
  }

  emit('submit', payload)
}

const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num)
}
</script>
