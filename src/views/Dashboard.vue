<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">

    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>

    <form @submit.prevent="greet">
      <InputText type="text" v-model="text"/>
      <Button type="submit" label="Submit"/>
      <h3>{{message}}</h3>
    </form>
  </div>

  <Paginator :rows="10" :totalRecords="50"></Paginator>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import HelloWorld from '@/components/HelloWorld.vue' // @ is an alias to /src

@Options({
  components: {
    HelloWorld
  }
})
export default class Dashboard extends Vue {
  public message = '';
  public text = '';
  public greet () {
    if (this.text.length) {
      this.message = 'Hello ' + this.text
    }
  }
}
</script>

<style lang="scss" scoped>
  .p-button {
    margin-left: .2em;
  }
  form {
    margin-top: 2em;
  }
</style>
