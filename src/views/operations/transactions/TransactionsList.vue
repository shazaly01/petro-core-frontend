<template>
  <div class="p-6">
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white font-display">
          سجل المدفوعات والمعاملات
        </h1>
        <p class="text-sm text-text-muted mt-1">تتبع التدفقات النقدية والتحويلات البنكية اليومية</p>
      </div>

      <AppButton @click="openCreateModal" variant="primary">
        <PlusIcon class="h-5 w-5 ml-2" />
        تسجيل دفعة يدوية
      </AppButton>
    </div>

    <div class="bg-white dark:bg-surface-section p-4 rounded-xl border border-surface-border mb-6">
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
        <div class="sm:col-span-2">
          <AppInput
            id="search-ref"
            label="بحث برقم الإيصال أو التكليف"
            v-model="searchQuery"
            @input="handleSearch"
            placeholder="ادخل رقم المرجع..."
          />
        </div>
      </div>
    </div>

    <TransactionsTable :items="transactions" :loading="loading" @edit="openEditModal" />

    <TransactionModal
      v-model="showModal"
      :item="selectedItem"
      :is-saving="isSaving"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTransactionStore } from '@/stores/transactionStore'
import { PlusIcon } from '@heroicons/vue/24/outline'

import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import TransactionsTable from './TransactionsTable.vue'
import TransactionModal from './TransactionModal.vue'

const store = useTransactionStore()
const { transactions, loading } = storeToRefs(store)

const showModal = ref(false)
const selectedItem = ref(null)
const isSaving = ref(false)
const searchQuery = ref('')

onMounted(() => store.fetchTransactions())

const handleSearch = () => {
  store.fetchTransactions(1, searchQuery.value)
}

const openCreateModal = () => {
  selectedItem.value = null
  showModal.value = true
}

const openEditModal = (item) => {
  selectedItem.value = { ...item }
  showModal.value = true
}

const handleSave = async (formData) => {
  isSaving.value = true
  try {
    if (selectedItem.value?.id) {
      await store.updateTransaction(selectedItem.value.id, formData)
    } else {
      await store.createTransaction(formData)
    }
    showModal.value = false
    await store.fetchTransactions()
  } catch (error) {
    console.error('Transaction Save Error:', error)
  } finally {
    isSaving.value = false
  }
}
</script>
