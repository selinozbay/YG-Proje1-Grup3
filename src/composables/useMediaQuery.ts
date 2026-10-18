import { onScopeDispose, ref } from 'vue'

/**
 * Bir CSS medya sorgusunun şu an eşleşip eşleşmediğini reaktif olarak verir.
 * Örnek: const isDesktop = useMediaQuery('(min-width: 768px)')
 * Bileşen (ya da store) kaldırılınca dinleme kendiliğinden biter.
 */
export function useMediaQuery(query: string) {
  const media = window.matchMedia(query)
  const matches = ref(media.matches)

  const update = (event: MediaQueryListEvent) => (matches.value = event.matches)
  media.addEventListener('change', update)
  onScopeDispose(() => media.removeEventListener('change', update))

  return matches
}
