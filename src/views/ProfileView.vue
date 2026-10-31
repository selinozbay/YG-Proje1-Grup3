<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/common/PageHeader.vue'
import AccountCard from '@/components/profile/AccountCard.vue'
import ProfileStats from '@/components/profile/ProfileStats.vue'
import ThemeSelector from '@/components/profile/ThemeSelector.vue'
import { getProfileStats } from '@/components/profile/stats'
import { getAuthErrorMessage } from '@/services/auth'
import { useAuthStore } from '@/stores/auth'
import { useCatalogStore } from '@/stores/catalog'
import { useProgressStore } from '@/stores/progress'

const auth = useAuthStore()
const catalog = useCatalogStore()
const progress = useProgressStore()
const router = useRouter()

const stats = computed(() => getProfileStats(catalog.courses, progress.tasks))

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
  <PageHeader title="Profil" description="Hesabın, tercihlerin ve ilerlemenin özeti." />

  <div class="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
    <div class="space-y-6">
      <AccountCard />
      <ThemeSelector />
    </div>
    <ProfileStats :stats="stats" />
  </div>

  <section class="mt-8 rounded-xl border border-red-200 p-5 dark:border-red-900">
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
