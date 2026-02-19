<template>
  <div
    class="flex flex-col sm:flex-row gap-4 mb-4 justify-between items-center bg-white dark:bg-surface-section p-4 rounded-xl border border-surface-border"
  >
    <div class="w-full sm:w-80">
      <AppInput
        id="island-search"
        v-model="searchQuery"
        @input="onSearch"
        placeholder="بحث باسم الجزيرة أو الكود..."
      />
    </div>

    <AppButton v-if="canCreate" @click="$emit('create')" variant="primary">
      <PlusIcon class="h-5 w-5 ml-2" />
      إضافة جزيرة جديدة
    </AppButton>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'

defineProps({ canCreate: Boolean })
const emit = defineEmits(['search', 'create'])

const searchQuery = ref('')
let debounceTimer = null

const onSearch = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('search', searchQuery.value)
  }, 300)
}
</script>
