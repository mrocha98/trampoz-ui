<template>
    <Card class="p-px-6 p-pt-2">
      <template v-slot:title>
        <span class="p-text-uppercase">Login</span>
      </template>

      <template v-slot:content>
        <form class="p-text-left">
          <div class="p-fluid">
            <div class="p-field">
              <label for="email">E-mail</label>
              <div class="p-inputgroup">
                <span class="p-inputgroup-addon">
                  <i class="pi pi-envelope" />
                </span>
                <InputText id="email" type="email" />
              </div>
            </div>
            <div class="p-field">
              <label for="password">Password</label>
              <div class="p-inputgroup">
                <span class="p-inputgroup-addon">
                  <i class="pi pi-lock" />
                </span>
                <InputText id="password" type="password" />
              </div>
            </div>
          </div>
          <div class="p-field">
            <Button label="Save" type="submit" />
          </div>
        </form>
      </template>
    </Card>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component'

export default class Login extends Vue {}
</script>

<style lang="scss" scoped>
  .p-card {

  }
</style>
