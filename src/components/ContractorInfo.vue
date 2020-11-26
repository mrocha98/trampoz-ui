<template>
  <figure class="p-d-flex p-jc-start p-ai-center">
    <img :src="logoLink" class="p-mr-2">
    <figcaption>{{ name }}</figcaption>
  </figure>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    name!: String,
    logoLink!: String
  }
})
</script>

<style lang="scss" scoped>
  img {
    border-radius: 50%;

    height: 32px;
    widows: 32px;
  }
</style>
