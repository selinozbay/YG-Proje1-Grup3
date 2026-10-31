import { createRouter, createWebHistory } from 'vue-router'
import { APP_NAME } from '@/config'
import { useAuthStore } from '@/stores/auth'
import HomeView from '@/views/HomeView.vue'

declare module 'vue-router' {
  interface RouteMeta {
    /** Sekme başlığında görünür: "Derslerim · Ders Panosu" */
    title?: string
    /** Giriş yapmamış kullanıcı giriş sayfasına yönlendirilir. */
    requiresAuth?: boolean
    /** Giriş yapmış kullanıcı ana sayfaya yönlendirilir (giriş, kayıt). */
    guestOnly?: boolean
    /**
     * 'app': menülü çerçeve (varsayılan), 'public': sade çerçeve,
     * 'auto': giriş yapmışsa menülü, yapmamışsa sade çerçeve (herkese açık sayfalar için),
     * 'auth': giriş, kayıt ve şifremi unuttum ekranlarının iki bölümlü çerçevesi.
     */
    layout?: 'app' | 'public' | 'auto' | 'auth'
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Ana Sayfa', requiresAuth: true },
    },
    {
      path: '/derslerim',
      name: 'courses',
      component: () => import('@/views/CoursesView.vue'),
      meta: { title: 'Derslerim', requiresAuth: true },
    },
    {
      path: '/derslerim/:courseId',
      name: 'course-detail',
      component: () => import('@/views/CourseDetailView.vue'),
      props: (route) => ({ courseId: String(route.params.courseId) }),
      meta: { title: 'Ders', requiresAuth: true },
    },
    {
      path: '/derslerim/:courseId/hafta/:weekNo',
      name: 'week-detail',
      component: () => import('@/views/WeekDetailView.vue'),
      props: (route) => ({
        courseId: String(route.params.courseId),
        // Yalnızca "2" gibi tam sayı yazımı kabul edilir; "2.0" veya "02" hafta bulunamadı olur (#72).
        weekNo: /^[1-9]\d*$/.test(String(route.params.weekNo))
          ? Number(route.params.weekNo)
          : Number.NaN,
      }),
      meta: { title: 'Hafta', requiresAuth: true },
    },
    {
      path: '/gorevlerim',
      name: 'tasks',
      component: () => import('@/views/TasksView.vue'),
      meta: { title: 'Görevlerim', requiresAuth: true },
    },
    {
      path: '/profil',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { title: 'Profil', requiresAuth: true },
    },
    {
      path: '/giris',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { title: 'Giriş yap', guestOnly: true, layout: 'auth' },
    },
    {
      path: '/kayit',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { title: 'Kayıt ol', guestOnly: true, layout: 'auth' },
    },
    {
      path: '/sifremi-unuttum',
      name: 'forgot-password',
      component: () => import('@/views/auth/ForgotPasswordView.vue'),
      meta: { title: 'Şifremi unuttum', guestOnly: true, layout: 'auth' },
    },
    {
      path: '/gizlilik',
      name: 'privacy',
      component: () => import('@/views/PrivacyView.vue'),
      meta: { title: 'Gizlilik ve KVKK', layout: 'auto' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: 'Sayfa bulunamadı', layout: 'public' },
    },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  await auth.waitUntilReady()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'home' }
  }
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} · ${APP_NAME}` : APP_NAME
})

export default router
