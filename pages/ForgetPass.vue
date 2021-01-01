<template>
  <login-reg-card title="بازیابی رمز عبور">
    <a-text-field v-model="email" label="ایمیل"
                  class="mt-8"/>
    <v-btn @click="onSubmit" :loading="l.submit"
           block color="primary" class="mt-8">ارسال ایمیل بازیابی
    </v-btn>
    <div class="pt-16">
      <span class="text-h6">رمزتان را به خاطر دارید؟</span>
      <nuxt-link class="text-h6" to="/Login">ورود</nuxt-link>
    </div>
  </login-reg-card>
</template>

<script>
import captcha from "@/mixins/captcha";
import pstopper from "@/mixins/pstopper";
import LoginRegCard from "@/components/LoginRegCard";
import ATextField from "@/components/ATextField";

export default {
  components: {ATextField, LoginRegCard},
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