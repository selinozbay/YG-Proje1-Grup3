import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)

app.use(createPinia())
useAuthStore().init() // oturum dinlemeye başlar (Firebase veya demo modu)
app.use(router)

// İlk sayfa belli olunca (oturum kontrolü dahil) uygulama ekrana basılır;
// böylece giriş yapmamış kullanıcı menülü çerçeveyi bir anlığına bile görmez.
router.isReady().then(() => app.mount('#app'))
