<template>
  <div
    class="flex flex-col lg:flex-row gap-4 mb-6 justify-between items-start lg:items-center bg-white dark:bg-surface-section p-4 rounded-xl border border-surface-border shadow-sm"
  >
    <div class="flex flex-col sm:flex-row gap-4 w-full lg:w-auto flex-1">
      <div class="w-full sm:w-80">
        <AppInput
          id="adjustment-search"
          v-model="searchQuery"
          @input="onSearch"
          placeholder="بحث بالسبب، أو اسم المشرف..."
        />
      </div>

      <div class="w-full sm:w-64">
        <TanksDropdown
          id="filter_tank_id"
          v-model="tankId"
          @update:modelValue="onSearch"
          placeholder="جميع الخزانات"
        />
      </div>
    </div>

    <AppButton
      v-if="canCreate"
      @click="$emit('create')"
      variant="primary"
      class="w-full lg:w-auto whitespace-nowrap"
    >
      <PlusIcon class="h-5 w-5 ml-2" />
      تسجيل جرد فعلي
    </AppButton>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import TanksDropdown from '@/components/forms/TanksDropdown.vue'

defineProps({
  canCreate: { type: Boolean, default: false },
})

const emit = defineEmits(['filter', 'create'])

const searchQuery = ref('')
const tankId = ref('')
let debounceTimer = null

const onSearch = () => {
  clearTimeout(debounceTimer)

  // نستخدم الـ Debounce لتأخير إرسال الطلب (ممتاز لتخفيف الضغط على السيرفر)
  debounceTimer = setTimeout(() => {
    emit('filter', {
      search: searchQuery.value,
      tank_id: tankId.value,
    })
  }, 300)
}
</script>
