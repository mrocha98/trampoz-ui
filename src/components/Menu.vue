<template>
  <Menubar :model="items" class="p-mb-3">
    <template #start>
      <img alt="logo" src="@/assets/logo.png" />
    </template>
    <template #end>
      <Button v-if="isVisible()" label="Logout" icon="pi pi-power-off" class="p-button-danger p-mr-3" />
    </template>
  </Menubar>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from '@/store'

export type MenuItem = {
  label: string
  icon: string
  items?: MenuItem[]
  to?: string
  command?: () => unknown
  visible?: () => boolean
} | { separator: boolean }

export type MenuItems = MenuItem[]

export default defineComponent({
  setup () {
    const store = useStore()
    const isVisible = () => store.state.auth.signed

    const items = ref([
      { label: 'Dashboard', icon: 'pi pi-fw pi-chart-line', to: '/dashboard', visible: isVisible },
      { label: 'Jobs', icon: 'pi pi-fw pi-briefcase', to: '/jobs', visible: isVisible },
      { label: 'Contractors', icon: 'pi pi-fw pi-users', to: '/contractors', visible: isVisible }
    ] as MenuItems)

    return { items, isVisible }
  }
})
</script>

<style lang="scss">
  .p-menubar {
    position: sticky;
    top: 0;
    width: 100%;

    .p-menubar-start {
      img {
        height: 64px;
        width: 64px;
      }
    }
  }
</style>
