import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config.ts'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      // Testler her zaman demo modunda çalışır; .env.local dolu olsa bile gerçek Firebase'e bağlanmaz.
      env: { VITE_FIREBASE_API_KEY: '' },
      exclude: [...configDefaults.exclude, 'e2e/**', 'test/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  }),
)
