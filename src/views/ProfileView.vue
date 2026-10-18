<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'
import PagePlaceholder from '@/components/common/PagePlaceholder.vue'
import { getAuthErrorMessage } from '@/services/auth'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const deleteError = ref('')
const deleting = ref(false)

// KVKK: kullanıcı hesabını ve tüm verisini silebilmeli.
async function deleteAccount() {
  const confirmed = window.confirm(
    'Hesabınız ve tüm ilerlemeniz kalıcı olarak silinecek. Emin misiniz?',
  )
  if (!confirmed) return
  deleteError.value = ''
  deleting.value = true
  try {
    await auth.deleteAccount()
    await router.replace({ name: 'login' })
  } catch (e) {
    deleteError.value = getAuthErrorMessage(e)
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <PageHeader title="Profil" />

  <section class="mb-6">
    <h2 class="mb-2 font-semibold">Hesap bilgileri</h2>
    <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
      <dt class="text-slate-500 dark:text-slate-400">Ad soyad</dt>
      <dd>{{ auth.user?.displayName || '—' }}</dd>
      <dt class="text-slate-500 dark:text-slate-400">E-posta</dt>
      <dd>{{ auth.user?.email }}</dd>
    </dl>
  </section>

  <PagePlaceholder
    class="mb-6"
    title="Profil"
    :items="[
      'Tema seçimi: Aydınlık / Karanlık / Sistem (usePreferencesStore().setTheme)',
      'Kişisel istatistikler (tamamlanan görev, aktif ders sayısı)',
      'Hesap bilgileri kartının tasarımı',
    ]"
  />

  <section class="rounded-xl border border-red-200 p-5 dark:border-red-900">
    <h2 class="font-semibold text-red-700 dark:text-red-400">Hesabı sil</h2>
    <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
      Hesabınız ve kayıtlı tüm ilerlemeniz kalıcı olarak silinir.
    </p>
    <p v-if="deleteError" role="alert" class="mt-2 text-sm text-red-700 dark:text-red-400">
      {{ deleteError }}
    </p>
    <button
      type="button"
      :disabled="deleting"
      class="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
      @click="deleteAccount"
    >
      Hesabımı ve verilerimi sil
    </button>
  </section>
</template>
