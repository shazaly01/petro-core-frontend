<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4"
    @click.self="close"
  >
    <div
      class="bg-white dark:bg-surface-section rounded-lg shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100"
    >
      <div
        class="flex justify-between items-center border-b border-gray-200 dark:border-surface-border p-4 mb-2"
      >
        <h3 class="text-lg font-bold text-gray-800 dark:text-text-primary">
          {{ title }}
        </h3>
        <button
          @click="close"
          class="text-gray-400 hover:text-red-500 transition-colors focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div class="p-6 pt-2">
        <SupplyLogForm
          :initial-data="itemData"
          :is-saving="isSaving"
          @submit="handleFormSubmit"
          @cancel="close"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import SupplyLogForm from './SupplyLogForm.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  item: { type: Object, default: null },
  isSaving: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'save'])

const isOpen = ref(props.modelValue)
const itemData = ref(props.item)

const title = computed(() =>
  props.item && props.item.id ? 'تعديل بيانات التوريد' : 'تسجيل توريد جديد',
)

watch(
  () => props.modelValue,
  (val) => {
    isOpen.value = val
  },
)
watch(
  () => props.item,
  (val) => {
    itemData.value = val
  },
)

const close = () => {
  emit('update:modelValue', false)
}

const handleFormSubmit = (formData) => {
  emit('save', formData)
}
</script>
