<template>
  <v-row justify="center">
    <v-col cols="4">
      <v-text-field v-model="password" label="رمز عبور جدید"/>
      <v-btn :loading="l.send" @click="onSend">ثبت</v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
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
        await this.$axios.$post('/otp-send', {email: this.email})
        this.$store.commit('otp/set', {
          url: '/reset-pass',
          data: {...this.$store.state.otp.data, password: this.password},
          route: '/ResetPass'
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