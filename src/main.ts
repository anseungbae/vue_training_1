import ElementPlus from 'element-plus'
import { createApp } from 'vue'
import App from './App.vue'
import { setupRouter } from './router'
import 'ag-grid-community/styles/ag-grid.css' // Mandatory CSS required by the grid
import 'ag-grid-community/styles/ag-theme-quartz.css' // Optional Theme applied to the grid
import '@/styles/app.css'
import 'element-plus/dist/index.css'
import '@/styles/index.scss'
import { setupStore } from '@/store'
import { setupAxios } from '@/config/axios'

const setupAll = async () => {
  const app = createApp(App)

  setupStore(app)

  await setupRouter(app)

  setupAxios(app)

  app.use(ElementPlus)

  app.mount('#app')
}

setupAll()
