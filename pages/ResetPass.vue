<template>
  <login-reg-card title="ایجاد رمز عبور جدید">
    <a-text-field type="password" v-model="password" label="رمز عبور"
                  class="mt-16"/>
    <a-text-field type="password" v-model="password" label="تکرار رمز عبور"/>
    <v-btn :loading="l.send" @click="onSend"
           block color="primary" class="mt-8">تایید
    </v-btn>
  </login-reg-card>
</template>

<script>
import captcha from "@/mixins/captcha";
import pstopper from "@/mixins/pstopper";
import ATextField from "@/components/ATextField";
import LoginRegCard from "@/components/LoginRegCard";

export default {
  components: {LoginRegCard, ATextField},
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