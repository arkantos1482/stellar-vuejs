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

export default {
  mixins: [captcha],
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
      try {
        await this.$axios.$get('/csrf-cookie')
        await this.$axios.$post('/otp-send', {email: this.$store.state.otp.data.email})
        this.$store.commit('otp/set', {
          url: '/reset-pass',
          data: {...this.$store.state.otp.data, password: this.password, captcha_token: this.captcha_token},
          route: '/login'
        })
        await this.$router.push('/Otp')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>

</style>