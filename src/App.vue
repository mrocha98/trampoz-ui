<template>
  <Menu class="menu" />
  <router-view class="router-view" />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { useStore } from '@/store'
import Menu from '@/components/Menu.vue'

@Options({
  components: {
    Menu
  }
})
export default class App extends Vue {
  public store = useStore()

  mounted () {
    const IS_SIGNED = this.store.state.auth.signed
    if (IS_SIGNED) this.$router.push('/dashboard')
  }
}
</script>

<style lang="scss">
  html, body, #app {
    height: 100vh;
  }

  body {
    background-color: var(--surface-b);
    color: var(--text-color);
  }

  .router-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    text-align: center;

    height: 90vh;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
</style>
