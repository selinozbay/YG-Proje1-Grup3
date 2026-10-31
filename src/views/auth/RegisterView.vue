<script setup lang="ts">
import { ref, useId } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import AuthCard from '@/components/auth/AuthCard.vue'
import PasswordStrengthMeter from '@/components/auth/PasswordStrengthMeter.vue'
import SubmitButton from '@/components/auth/SubmitButton.vue'
import TextField from '@/components/common/TextField.vue'
import { getAuthErrorMessage } from '@/services/auth'
import { checkPasswordStrength, isStudentEmail } from '@/services/auth/registration'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const strengthId = useId()

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
  if (!isStudentEmail(email.value)) {
    error.value = 'Öğrenci e-postanızı girin (ör. 123456@ogr.ktu.edu.tr).'
    return
  }
  // Yalnızca güçlü şifreyle kayıt olunur; zayıf ve orta şifreler reddedilir (#7).
  if (checkPasswordStrength(password.value).level !== 'strong') {
    error.value =
      'Şifre yeterince güçlü değil. En az 10 karakter kullanın ve küçük harf, büyük harf, rakam ve simgeden en az üçünü karıştırın.'
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
  <AuthCard title="Kayıt ol" :error="error" @submit="submit">
    <TextField v-model="displayName" label="Ad soyad" autocomplete="name" required />
    <TextField
      v-model="email"
      label="Öğrenci e-postası"
      type="email"
      autocomplete="email"
      hint="Öğrenci numaranızla: 123456@ogr.ktu.edu.tr"
      required
    />
    <div>
      <!-- minlength yok: kısa şifrede tarayıcının değil, formun Türkçe uyarısı görünsün. -->
      <TextField
        v-model="password"
        label="Şifre"
        type="password"
        autocomplete="new-password"
        hint="En az 10 karakter; küçük-büyük harf, rakam ve simgeden en az üçü."
        :describedby="strengthId"
        required
      />
      <PasswordStrengthMeter :id="strengthId" :password="password" />
    </div>

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
