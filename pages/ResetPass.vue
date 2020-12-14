<template>
  <v-row justify="center" class="text-center">
    <v-col cols="4">
      <v-text-field filled type="password" v-model="password" label="رمز عبور جدید"/>
      <v-btn color="primary" :loading="l.send" @click="onSend">ثبت</v-btn>
    </v-col>
  </v-row>
</template>

<script>
import captcha from "@/mixins/captcha";
import pstopper from "@/mixins/pstopper";

export default {
  mixins: [captcha, pstopper],
  layout: 'noToolbar',
  data() {
    return {
      l: {send: false},
      password: ''
    }
  },
  methods: {
    async onSend() {
      this.loading = true
      await this.getCaptcha()
      await this.$axios.$post('/reset-pass', {
        email: this.$store.state.credentials.email,
        password: this.password,
        otp: this.$store.state.credentials.otp,
        captcha_token: this.captcha_token
      })
      this.$store.commit('credentials/reset')
      await this.$router.push('/Login')
      this.loading = false
    }
  }
}
</script>

<style scoped>

</style>