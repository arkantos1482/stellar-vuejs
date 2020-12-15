<template>
  <login-reg-card title="ایجاد حساب کاربری"
                  subtitle="خوش آمدید">
    <v-card-text>
      <v-tabs>
        <v-tab>حقیقی</v-tab>
        <v-tab>حقوقی</v-tab>
      </v-tabs>
      <v-divider/>
      <a-text-field class="mt-4" label="ایمیل" v-model="email"/>
      <a-text-field type="password" label="رمز عبور" v-model="password"/>
      <a-text-field type="password" label="تکرار رمز عبور" v-model="passwordConfirm"/>
      <a-text-field filled="true" label="کد معرف(اختیاری)" v-model="referral_code"/>
      <v-checkbox v-model="terms" class="mt-0">
        <template v-slot:label>
          <a href="#">قوانین و شرایط</a>
          <span>&nbsp;بیترا را می پذیرم.</span>
        </template>
      </v-checkbox>
      <v-btn @click="register" :loading="l.reg"
             class="mb-8" color="primary" block> تایید
      </v-btn>
      <span>قبلا ثبت نام کرده اید؟</span>
      <nuxt-link to="/Login">ورود</nuxt-link>
    </v-card-text>
  </login-reg-card>
</template>

<script>
import captcha from "@/mixins/captcha";
import pstopper from "@/mixins/pstopper";
import ATextField from "@/components/ATextField";
import LoginRegCard from "@/components/LoginRegCard";

export default {
  components: {ATextField, LoginRegCard},
  mixins: [captcha, pstopper],
  layout: 'noToolbar',
  data() {
    return {
      email: '',
      password: '',
      passwordConfirm: '',
      referral_code: null,
      terms: false,
      l: {reg: false}
    }
  },
  methods: {
    async register() {
      if (this.password === this.passwordConfirm) {
        this.l.reg = true
        await this.getCaptcha()
        await this.$axios.$get('/csrf-cookie')
        await this.$axios.$post('/register', {
          email: this.email,
          password: this.password,
          referral_code: this.referral_code,
          captcha_token: this.captcha_token
        })
        this.$store.commit('credentials/set', {email: this.email})
        await this.$router.push('/RegisterVerify')
        this.l.reg = false
      }
    }
  }
}
</script>

<style scoped>

</style>