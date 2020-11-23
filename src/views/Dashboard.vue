<template>
  <section class="dashboard">
    <h1>Welcome!</h1>
    <p>Logged as: {{ email }}</p>
    <img alt="illustration" src="@/assets/dashboard.png" />
  </section>
</template>

<script lang="ts">
import { computed } from 'vue'
import { Vue } from 'vue-class-component'
import { useStore } from '@/store'

export default class Dashboard extends Vue {
  public store = useStore()
  public email = computed(() => this.store.state.user.email)
}
</script>

<style lang="scss" scoped>
  img {
    min-height: 256px;
    min-width: 328px;

    max-height: 75%;
    max-width: 75%;
  }
</style>
