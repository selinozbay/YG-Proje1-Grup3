<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
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
const deleteConfirmOpen = ref(false)

function askDelete() {
  deleteError.value = ''
  deleteConfirmOpen.value = true
}

// KVKK: kullanıcı hesabını ve tüm verisini silebilmeli. Önce onay penceresi açılır (#35).
async function deleteAccount() {
  deleting.value = true
  try {
    await auth.deleteAccount()
    deleteConfirmOpen.value = false
    await router.replace({ name: 'login' })
  } catch (e) {
    deleteConfirmOpen.value = false
    deleteError.value = getAuthErrorMessage(e)
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <PageHeader title="Profil" description="Hesabın, tercihlerin ve ilerlemenin özeti." />

  <div class="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
    <div class="space-y-6">
      <AccountCard />
      <ThemeSelector />
    </div>
    <ProfileStats :stats="stats" />
  </div>

  <section
    class="mt-8 flex flex-col gap-4 rounded-2xl bg-red-50/60 p-5 ring-1 ring-red-200 sm:flex-row sm:items-center sm:justify-between dark:bg-red-500/5 dark:ring-red-900/70"
  >
    <div>
      <h2 class="text-lg font-bold font-stretch-condensed text-red-800 dark:text-red-300">
        Hesabı sil
      </h2>
      <p class="mt-0.5 text-sm text-slate-700 dark:text-slate-300">
        Hesabınız ve kayıtlı tüm ilerlemeniz kalıcı olarak silinir.
      </p>
      <p v-if="deleteError" role="alert" class="mt-2 text-sm text-red-700 dark:text-red-400">
        {{ deleteError }}
      </p>
    </div>
    <button
      type="button"
      :disabled="deleting"
      aria-haspopup="dialog"
      data-test="delete-account"
      class="shrink-0 self-start rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 sm:self-auto"
      @click="askDelete"
    >
      Hesabımı ve verilerimi sil
    </button>
  </section>

  <ConfirmDialog
    :open="deleteConfirmOpen"
    title="Hesabınız silinsin mi?"
    message="Hesabınız ve tüm ilerlemeniz kalıcı olarak silinecek. Bu işlem geri alınamaz."
    confirm-label="Evet, hesabımı sil"
    cancel-label="Vazgeç"
    busy-label="Siliniyor…"
    :busy="deleting"
    tone="danger"
    @confirm="deleteAccount"
    @cancel="deleteConfirmOpen = false"
  />
</template>
