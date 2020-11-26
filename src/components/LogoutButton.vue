<template>
  <Button label="Logout" @click="logout" icon="pi pi-power-off" class="p-button-danger" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/store'
import { ActionTypes } from '@/store/actions'
import { clearState } from '@/utils/localStorage'

export default defineComponent({
  setup () {
    const store = useStore()
    const router = useRouter()

    const logout = () => {
      store.dispatch(ActionTypes.Logout)
      router.push({ name: 'Login' })
      clearState()
    }

    return {
      logout
    }
  }
})
</script>
