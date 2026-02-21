<template>
  <div class="p-6 space-y-6 bg-gray-50 dark:bg-surface-ground min-h-screen">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white font-display">
          التسويات الجردية (المخزون الفعلي)
        </h1>
        <p class="text-sm text-text-muted mt-1">
          إدارة الجرد الفعلي للخزانات ومطابقتها مع الأرصدة الدفترية.
        </p>
      </div>
    </div>

    <InventoryAdjustmentsFilter
      :can-create="canCreate"
      @filter="handleFilter"
      @create="openCreateModal"
    />

    <div
      class="bg-white dark:bg-surface-section rounded-xl border border-surface-border shadow-sm overflow-hidden"
    >
      <InventoryAdjustmentsTable
        :items="store.adjustments"
        :loading="store.loading"
        @edit="openEditModal"
        @delete="confirmDelete"
      />

      <div v-if="store.pagination?.last_page > 1" class="p-4 border-t border-surface-border">
        <AppPagination :pagination="store.pagination" @page-changed="changePage" />
      </div>
    </div>

    <InventoryAdjustmentModal
      v-model="isModalOpen"
      :item="selectedItem"
      :is-saving="store.loading"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useInventoryAdjustmentStore } from '@/stores/inventoryAdjustmentStore'

// استيراد المكونات التي أنشأناها
import InventoryAdjustmentsFilter from './InventoryAdjustmentsFilter.vue'
import InventoryAdjustmentsTable from './InventoryAdjustmentsTable.vue'
import InventoryAdjustmentModal from './InventoryAdjustmentModal.vue'

// إذا كان لديك مكون AppPagination جاهز، قم باستيراده، وإلا استخدم المتاح لديك
import AppPagination from '@/components/ui/AppPagination.vue'

// --- التهيئة ---
const store = useInventoryAdjustmentStore()
const isModalOpen = ref(false)
const selectedItem = ref(null)

// حالة الفلتر الحالية
const currentFilters = ref({
  search: '',
  tank_id: '',
})

// 🛑 الصلاحيات (اربطها بنظام الصلاحيات لديك، مثلاً عبر auth store أو composable)
// كمثال مؤقت نفترض أن المستخدم لديه الصلاحية
const canCreate = computed(() => true)

// --- جلب البيانات ---
const fetchData = async (page = 1) => {
  // ملاحظة: قمنا بتعديل البارامترات لتشمل الخزان والبحث
  await store.fetchAdjustments(page, currentFilters.value)
}

onMounted(() => {
  fetchData()
})

// --- معالجات الأحداث (Event Handlers) ---

// عند التصفية من مكون Filter
const handleFilter = (filters) => {
  currentFilters.value = filters
  fetchData(1) // نعود للصفحة الأولى عند البحث
}

// تغيير الصفحة
const changePage = (page) => {
  fetchData(page)
}

// فتح نافذة إضافة جرد جديد
const openCreateModal = () => {
  selectedItem.value = null
  isModalOpen.value = true
}

// فتح نافذة تعديل جرد (صلاحية مدير)
const openEditModal = (item) => {
  // نأخذ نسخة من العنصر حتى لا يتعدل في الجدول مباشرة قبل الحفظ
  selectedItem.value = { ...item }
  isModalOpen.value = true
}

// حفظ البيانات (إضافة أو تعديل)
const handleSave = async (formData) => {
  try {
    if (formData.id) {
      await store.updateAdjustment(formData.id, formData)
    } else {
      await store.createAdjustment(formData)
    }

    // إغلاق النافذة وتحديث البيانات
    isModalOpen.value = false
    fetchData(store.pagination?.current_page || 1)
  } catch (error) {
    // الأخطاء تتم معالجتها داخل الـ Store، ويمكنك عرض إشعار (Toast) هنا إن أردت
    console.error('فشل الحفظ:', error)
  }
}

// حذف التسوية
const confirmDelete = async (item) => {
  if (window.confirm('هل أنت متأكد من حذف هذه التسوية؟ سيتم عكس تأثيرها على الخزان فوراً.')) {
    try {
      await store.deleteAdjustment(item.id)
      fetchData(store.pagination?.current_page || 1)
    } catch (error) {
      console.error('فشل الحذف:', error)
    }
  }
}
</script>
