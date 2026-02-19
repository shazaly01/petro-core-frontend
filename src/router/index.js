import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// --- استيراد التخطيطات الرئيسية (Layouts) ---
import AppLayout from '@/components/layout/AppLayout.vue'
import AuthLayout from '@/components/layout/AuthLayout.vue'

// --- استيراد الصفحات الأساسية ---
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/dashboard/DashboardView.vue'

// --- 1. البنية التحتية (Infrastructure) ---
const FuelTypesList = () => import('@/views/infrastructure/fuel-types/FuelTypesList.vue')
const IslandsList = () => import('@/views/infrastructure/islands/IslandsList.vue')
const TanksList = () => import('@/views/infrastructure/tanks/TanksList.vue')
const PumpsList = () => import('@/views/infrastructure/pumps/PumpsList.vue')
const NozzlesList = () => import('@/views/infrastructure/nozzles/NozzlesList.vue')

// --- 2. العمليات (Operations) ---
const ShiftsList = () => import('@/views/operations/shifts/ShiftsList.vue')
const AssignmentsList = () => import('@/views/operations/assignments/AssignmentsList.vue')
const TransactionsList = () => import('@/views/operations/transactions/TransactionsList.vue')
const SupplyLogsList = () => import('@/views/operations/supply-logs/SupplyLogsList.vue')

// --- 3. الإدارة والتقارير (تأكد من مطابقة أسماء المجلدات) ---
const UsersList = () => import('@/views/users/UsersList.vue')
const RolesList = () => import('@/views/roles/RolesList.vue')
const DailyMovementReport = () => import('@/views/reports/DailyMovementReport.vue')

// --- استيراد صفحات التقارير ---
//const DailyMovementReport = () => import('@/views/reports/DailyMovementReport.vue')

const routes = [
  // --- 1. المسارات العامة (Public) ---
  {
    path: '/',
    component: AuthLayout,
    children: [
      { path: 'login', name: 'Login', component: LoginView },
      { path: '', redirect: '/login' },
    ],
  },

  // --- 2. المسارات المحمية (Protected) ---
  {
    path: '/app',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      // الصفحة الرئيسية (لوحة المعلومات)
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: DashboardView,
        meta: { permission: 'dashboard.view' },
      },

      // =========================================
      // أ. البنية التحتية (Infrastructure)
      // الصلاحية المشتركة: infrastructure.view
      // =========================================
      {
        path: 'fuel-types',
        name: 'FuelTypesList',
        component: FuelTypesList,
        meta: { permission: 'infrastructure.view' },
      },
      {
        path: 'islands',
        name: 'IslandsList',
        component: IslandsList,
        meta: { permission: 'infrastructure.view' },
      },
      {
        path: 'tanks',
        name: 'TanksList',
        component: TanksList,
        meta: { permission: 'infrastructure.view' },
      },
      {
        path: 'pumps',
        name: 'PumpsList',
        component: PumpsList,
        meta: { permission: 'infrastructure.view' },
      },
      {
        path: 'nozzles',
        name: 'NozzlesList',
        component: NozzlesList,
        meta: { permission: 'infrastructure.view' },
      },

      // =========================================
      // ب. العمليات اليومية (Operations)
      // =========================================
      {
        path: 'shifts',
        name: 'ShiftsList',
        component: ShiftsList,
        meta: { permission: 'shift.view' },
      },
      {
        path: 'assignments',
        name: 'AssignmentsList',
        component: AssignmentsList,
        meta: { permission: 'assignment.view' },
      },
      {
        path: 'transactions',
        name: 'TransactionsList',
        component: TransactionsList,
        meta: { permission: 'transaction.view' },
      },
      {
        path: 'supply-logs',
        name: 'SupplyLogsList',
        component: SupplyLogsList,
        meta: { permission: 'supply.view' },
      },

      // =========================================
      // ج. الإدارة والنظام (Admin)
      // =========================================
      {
        path: 'users',
        name: 'UsersList',
        component: UsersList,
        meta: { permission: 'user.view' },
      },
      {
        path: 'roles',
        name: 'RolesList',
        component: RolesList,
        meta: { permission: 'role.view' },
      },

      // =========================================
      // د. التقارير (Reports)
      // =========================================
      {
        path: 'reports/daily-movement',
        name: 'DailyMovementReport',
        component: DailyMovementReport,
        meta: { permission: 'reports.view' },
      },

      // إعادة التوجيه الافتراضية
      { path: '', redirect: '/app/dashboard' },
    ],
  },

  // صفحة "غير موجود"
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// --- حارس التنقل (Navigation Guard) ---
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  // نفترض أن الـ authStore يحتوي على دالة can للتحقق من الصلاحيات
  // ويحتوي على خاصية isAuthenticated

  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // حفظ المسار الذي حاول المستخدم الذهاب إليه للعودة له بعد تسجيل الدخول
      authStore.returnUrl = to.fullPath
      next({ name: 'Login' })
    } else {
      // التحقق من الصلاحيات (ACL)
      const requiredPermission = to.meta.permission
      if (requiredPermission && !authStore.can(requiredPermission)) {
        console.warn(
          `Access denied: route "${String(to.name)}" requires permission "${requiredPermission}"`,
        )
        // توجيه المستخدم لصفحة لوحة التحكم إذا لم يملك الصلاحية
        next({ name: 'Dashboard' })
      } else {
        next()
      }
    }
  } else {
    next()
  }
})

export default router
