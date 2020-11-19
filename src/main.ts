import { createApp } from 'vue'
import VueAxios from 'vue-axios'
import App from './App.vue'
import router from './router'
import store from './store'
import api from './services/api'
import primevue from './primevue-setup'

const app = createApp(App)

app
  .use(store)
  .use(router)
  .use(VueAxios, api)
  .use(primevue.ToastService)

app
  .component('Button', primevue.Button)
  .component('AutoComplete', primevue.AutoComplete)
  .component('Calendar', primevue.Calendar)
  .component('Editor', primevue.Calendar)
  .component('InputNumber', primevue.InputNumber)
  .component('InputText', primevue.InputText)
  .component('SelectButton', primevue.SelectButton)
  .component('Password', primevue.Password)
  .component('Paginator', primevue.Paginator)
  .component('Dialog', primevue.Dialog)
  .component('Message', primevue.Message)
  .component('Toast', primevue.Toast)
  .component('Menubar', primevue.Menubar)
  .component('ProgressSpinner', primevue.ProgressSpinner)
  .component('Card', primevue.Card)

app.config.globalProperties.$primevue = { ripple: true }

app.mount('#app')
