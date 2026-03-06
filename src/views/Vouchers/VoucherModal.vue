<template>
  <Transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto outline-none focus:outline-none"
    >
      <div
        @click="$emit('close')"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      ></div>

      <Transition name="zoom">
        <div
          class="relative w-full max-w-2xl mx-auto bg-surface-section rounded-xl shadow-2xl z-50 overflow-hidden border border-surface-border"
        >
          <div
            class="flex items-center justify-between p-4 border-b border-surface-border bg-surface-ground"
          >
            <h3 class="text-lg font-bold text-text-primary flex items-center gap-2">
              <i class="pi pi-money-bill text-primary"></i>
              سند مالي جديد (إيداع/سحب/مصروف)
            </h3>
            <button
              @click="$emit('close')"
              class="text-text-muted hover:text-text-primary p-1.5 rounded-lg hover:bg-surface-hover transition-colors"
            >
              <i class="pi pi-times"></i>
            </button>
          </div>

          <div class="p-0">
            <VoucherForm @success="handleSuccess" @cancel="$emit('close')" />
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
// 🛑 تحديث الاستيراد إلى الملف الجديد
import VoucherForm from './VoucherForm.vue'

// التعريفات البرمجية
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'refresh'])

/**
 * عند نجاح عملية الحفظ
 */
const handleSuccess = () => {
  emit('close') // إغلاق المودال
  emit('refresh') // تحديث الجدول
}
</script>

<style scoped>
/* تأثير التلاشي للخلفية */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* تأثير التكبير (Zoom) للمحتوى */
.zoom-enter-active,
.zoom-leave-active {
  transition:
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.3s ease;
}
.zoom-enter-from {
  opacity: 0;
  transform: scale(0.95);
}
.zoom-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
