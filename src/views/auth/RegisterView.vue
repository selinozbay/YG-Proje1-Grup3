<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import AuthCard from '@/components/auth/AuthCard.vue'
import SubmitButton from '@/components/auth/SubmitButton.vue'
import TextField from '@/components/common/TextField.vue'
import { getAuthErrorMessage } from '@/services/auth'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const displayName = ref('')
const email = ref('')
const password = ref('')
const acceptedPrivacy = ref(false)
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  // Yalnızca boşluk yazılmış ad tarayıcının `required` denetimini geçer (#71).
  const name = displayName.value.trim()
  if (!name) {
    error.value = 'Ad soyad alanını doldurun.'
    return
  }
  if (!acceptedPrivacy.value) {
    error.value = 'Devam etmek için Aydınlatma Metni’ni okuduğunuzu onaylayın.'
    return
  }
  loading.value = true
  try {
    await auth.register(email.value.trim(), password.value, name)
    await router.replace({ name: 'home' })
  } catch (e) {
    error.value = getAuthErrorMessage(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthCard
    title="Kayıt ol"
    subtitle="Hesabını oluştur, derslerini ve görevlerini takip etmeye başla."
    :error="error"
    @submit="submit"
  >
    <TextField
      v-model="displayName"
      label="Ad soyad"
      icon="user"
      placeholder="Adın ve soyadın"
      autocomplete="name"
      required
    />
    <TextField
      v-model="email"
      label="E-posta"
      type="email"
      icon="mail"
      placeholder="ornek@eposta.com"
      autocomplete="email"
      required
    />
    <TextField
      v-model="password"
      label="Şifre (en az 6 karakter)"
      type="password"
      icon="lock"
      autocomplete="new-password"
      :minlength="6"
      required
    />

    <!-- KVKK: kullanıcı, verisi işlenmeden önce aydınlatma metnini okuduğunu onaylar. -->
    <label
      class="flex cursor-pointer items-start gap-3 rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800/60"
    >
      <input
        v-model="acceptedPrivacy"
        type="checkbox"
        class="mt-0.5 size-4 shrink-0 accent-indigo-600"
        required
      />
      <span>
        <RouterLink
          to="/gizlilik"
          target="_blank"
          class="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          Gizlilik ve KVKK Aydınlatma Metni</RouterLink
        >’ni okudum.
      </span>
    </label>

    <SubmitButton :loading="loading">Kayıt ol</SubmitButton>

    <template #footer>
      <p>
        Zaten hesabınız var mı?
        <RouterLink
          to="/giris"
          class="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          Giriş yapın
        </RouterLink>
      </p>
    </template>
  </AuthCard>
</template>
