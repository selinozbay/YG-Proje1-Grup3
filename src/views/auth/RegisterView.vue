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
  if (!acceptedPrivacy.value) {
    error.value = 'Devam etmek için Aydınlatma Metni’ni okuduğunuzu onaylayın.'
    return
  }
  loading.value = true
  try {
    await auth.register(email.value.trim(), password.value, displayName.value.trim())
    await router.replace({ name: 'home' })
  } catch (e) {
    error.value = getAuthErrorMessage(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthCard title="Kayıt ol" :error="error" @submit="submit">
    <TextField v-model="displayName" label="Ad soyad" autocomplete="name" required />
    <TextField v-model="email" label="E-posta" type="email" autocomplete="email" required />
    <TextField
      v-model="password"
      label="Şifre (en az 6 karakter)"
      type="password"
      autocomplete="new-password"
      :minlength="6"
      required
    />

    <!-- KVKK: kullanıcı, verisi işlenmeden önce aydınlatma metnini okuduğunu onaylar. -->
    <label class="flex items-start gap-2 text-sm">
      <input v-model="acceptedPrivacy" type="checkbox" class="mt-1" required />
      <span>
        <RouterLink
          to="/gizlilik"
          target="_blank"
          class="text-indigo-600 underline dark:text-indigo-400"
        >
          Gizlilik ve KVKK Aydınlatma Metni</RouterLink
        >’ni okudum.
      </span>
    </label>

    <SubmitButton :loading="loading">Kayıt ol</SubmitButton>

    <template #footer>
      <p>
        Zaten hesabınız var mı?
        <RouterLink to="/giris" class="text-indigo-600 underline dark:text-indigo-400">
          Giriş yapın
        </RouterLink>
      </p>
    </template>
  </AuthCard>
</template>
