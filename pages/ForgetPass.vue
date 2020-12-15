<template>
  <v-row justify="center">
    <v-col cols="4">
      <a-text-field v-model="email" filled label="ایمیل"/>
      <v-btn @click="onSubmit" :loading="l.submit">ثبت</v-btn>
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
      l: {submit: false},
      email: ''
    }
  },
  methods: {
    async onSubmit() {
      this.l.submit = true
      await this.getCaptcha()
      await this.$axios.$get('/csrf-cookie')
      await this.$axios.$post('/forget-pass', {
        email: this.email,
        captcha_token: this.captcha_token
      })
      this.$store.commit("credentials/set", {email: this.email})
      this.l.submit = false
      await this.$router.push('/ForgetPassVerify')
    }
  }
}
</script>

<style scoped>

</style>