<template>
  <section class="login">
    <Card class="p-px-6 p-pt-2">
      <template v-slot:title>
        <span class="p-text-uppercase">Login</span>
      </template>

      <template v-slot:content>
        <form @submit.prevent="login" class="p-text-left">
          <div class="p-fluid">
            <Message severity="warn" :closable="false" class="p-field" v-if="errorMessage.length">
              {{ errorMessage }}
            </Message>

            <div class="p-field">
              <label for="email">E-mail</label>
              <div class="p-inputgroup">
                <span class="p-inputgroup-addon">
                  <i class="pi pi-envelope" />
                </span>
                <InputText id="email" name="email" type="email" v-model="email" required />
              </div>
            </div>

            <div class="p-field">
              <label for="password">Password</label>
              <div class="p-inputgroup">
                <span class="p-inputgroup-addon">
                  <i class="pi pi-lock" />
                </span>
                <InputText id="password" name="password" type="password" v-model="password" required />
              </div>
            </div>
          </div>
          <div class="p-field">
            <Button type="submit" label="Save" />
          </div>
        </form>
      </template>
    </Card>
  </section>
</template>

<script lang="ts">
import { computed } from 'vue'
import { Vue } from 'vue-class-component'
import { useStore } from '@/store'
import { ActionTypes } from '@/store/actions'

export default class Login extends Vue {
  public store = useStore()
  public email = ''
  public password = ''
  public errorMessage = computed(() => this.store.state.auth.errorMessage)

  public async login (): Promise<void> {
    const user = { email: this.email, password: this.password }
    try {
      await this.store.dispatch(ActionTypes.Login, user)
      this.$router.push('/dashboard')
    } catch {}
  }
}
</script>
