<template>
  <Menubar :model="items" class="p-mb-3">
    <template #start>
      <img alt="logo" src="@/assets/logo.png" />
    </template>
    <template #end>
      <LogoutButton v-if="isVisible()" class="p-mr-3" />
    </template>
  </Menubar>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from '@/store'
import LogoutButton from './LogoutButton.vue'

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
  components: {
    LogoutButton
  },
  setup () {
    const store = useStore()

    const isVisible = () => store.state.auth.signed

    const items = ref([
      { label: 'Dashboard', icon: 'pi pi-fw pi-chart-line', to: '/dashboard', visible: isVisible },
      { label: 'Jobs', icon: 'pi pi-fw pi-briefcase', to: '/jobs', visible: isVisible }
    ] as MenuItems)

    return {
      isVisible,
      items
    }
  }
})
</script>

<style lang="scss">
  .p-menubar {
    position: sticky;
    top: 0;

    width: 100%;

    z-index: 999;

    .p-menubar-start {
      img {
        height: 64px;
        width: 64px;
      }
    }
  }
</style>
