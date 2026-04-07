<!--src\views\operations\assignments\AssignmentsList.vue-->
<template>
  <div class="p-6">
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white font-display">
          تكليفات المسدسات
        </h1>
        <p class="text-sm text-text-muted mt-1">
          توزيع أطقم العمل على المضخات ومتابعة العدادات اللحظية
        </p>
      </div>

      <AppButton @click="goToCreatePage" variant="primary">
        <PlusIcon class="h-5 w-5 ml-2" />
        تكليف جديد
      </AppButton>
    </div>

    <div class="bg-white dark:bg-surface-section p-4 rounded-xl border border-surface-border mb-6">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AppInput
          id="search-user"
          label="بحث باسم العامل"
          v-model="searchQuery"
          @input="handleSearch"
          placeholder="اسم العامل..."
        />
      </div>
    </div>

    <AssignmentsTable
      :items="assignments"
      :loading="loading"
      @edit="goToEditPage"
      @delete="handleDelete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router' // استيراد الراوتر للتنقل
import { storeToRefs } from 'pinia'
import { useAssignmentStore } from '@/stores/assignmentStore'
import { PlusIcon } from '@heroicons/vue/24/outline'

import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AssignmentsTable from './AssignmentsTable.vue'

// إعداد الراوتر والمتجر
const router = useRouter()
const store = useAssignmentStore()
const { assignments, loading } = storeToRefs(store)

const searchQuery = ref('')

onMounted(() => store.fetchAssignments())

// البحث
const handleSearch = () => {
  store.fetchAssignments(1, searchQuery.value)
}

// الانتقال لصفحة إنشاء تكليف جديد
const goToCreatePage = () => {
  router.push({ name: 'AssignmentCreate' })
}

// الانتقال لصفحة تعديل تكليف موجود
const goToEditPage = (item) => {
  router.push({
    name: 'AssignmentEdit',
    params: { id: item.id },
  })
}

// 🛑 أضف هذه الدالة للتعامل مع حدث الحذف
const handleDelete = async (id) => {
  if (window.confirm('هل أنت متأكد من حذف هذا التكليف؟ سيتم حذفه برمجياً (Soft Delete).')) {
    try {
      await store.deleteAssignment(id)
      // تحديث القائمة بعد نجاح الحذف
      store.fetchAssignments(1, searchQuery.value)
    } catch (error) {
      console.error('Error deleting assignment:', error)
      alert(store.error || 'حدث خطأ أثناء محاولة الحذف.')
    }
  }
}
</script>
