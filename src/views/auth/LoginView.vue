<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import AuthCard from '@/components/auth/AuthCard.vue'
import SubmitButton from '@/components/auth/SubmitButton.vue'
import TextField from '@/components/common/TextField.vue'
import { getAuthErrorMessage } from '@/services/auth'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

// Yalnızca uygulama içi adreslere geri dönülür; başka bir siteye yönlendirme yapılamaz.
function safeRedirect(value: unknown) {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : '/'
}

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(email.value.trim(), password.value)
    await router.replace(safeRedirect(route.query.redirect))
  } catch (e) {
    error.value = getAuthErrorMessage(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthCard
    title="Giriş yap"
    subtitle="Devam etmek için e-posta adresinizi ve şifrenizi girin."
    :error="error"
    @submit="submit"
  >
    <TextField
      v-model="email"
      label="E-posta"
      type="email"
      icon="mail"
      placeholder="E-posta adresinizi giriniz"
      autocomplete="email"
      required
    />
    <div>
      <TextField
        v-model="password"
        label="Şifre"
        type="password"
        icon="lock"
        placeholder="Şifrenizi giriniz"
        autocomplete="current-password"
        required
      />
      <p class="mt-3 text-right text-sm">
        <RouterLink
          to="/sifremi-unuttum"
          class="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          Şifremi unuttum
        </RouterLink>
      </p>
    </div>
    <SubmitButton :loading="loading">Giriş yap</SubmitButton>

    <template #after-form>
      <div class="my-6 flex items-center gap-4 text-sm text-slate-400" aria-hidden="true">
        <span class="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        veya
        <span class="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
      </div>
      <RouterLink
        to="/kayit"
        class="flex h-12 w-full items-center justify-center rounded-xl border border-slate-200 font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-100 dark:hover:bg-slate-900"
      >
        Kayıt olun
      </RouterLink>
      <p class="mt-3 text-center text-sm text-slate-500 dark:text-slate-400">
        Hesabınız yok mu? Birkaç adımda oluşturabilirsiniz.
      </p>
    </template>
  </AuthCard>
</template>
