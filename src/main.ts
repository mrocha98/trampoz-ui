import { createApp } from 'vue'
import { router } from './router'
import { store } from './store'
import primevue from './primevue-setup'
import App from './App.vue'

const app = createApp(App)

app
  .use(store)
  .use(router)

app
  .component('Button', primevue.Button)
  .component('Calendar', primevue.Calendar)
  .component('InputNumber', primevue.InputNumber)
  .component('InputText', primevue.InputText)
  .component('Textarea', primevue.Textarea)
  .component('SelectButton', primevue.SelectButton)
  .component('Dropdown', primevue.Dropdown)
  .component('DataTable', primevue.DataTable)
  .component('Column', primevue.Column)
  .component('Dialog', primevue.Dialog)
  .component('Message', primevue.Message)
  .component('Menubar', primevue.Menubar)
  .component('Card', primevue.Card)
  .component('Toolbar', primevue.Toolbar)

app.config.globalProperties.$primevue = { ripple: true }

app.mount('#app')
