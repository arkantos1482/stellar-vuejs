<template>
  <login-reg-card title="ورود به حساب کاربری">
    <v-card-text>
      <v-form @submit.prevent="login">
        <a-text-field class="a-field" v-model="email" label="ایمیل"/>
        <a-text-field v-model="password" label="رمز عبور" :type="showPass ? 'text' : 'password'">
          <v-icon class="px-2 py-1" size="20px" @click="showPass = !showPass">
            {{ showPass ? 'mdi-eye' : 'mdi-eye-off' }}
          </v-icon>
        </a-text-field>
        <v-btn type="submit" :loading="l.login"
               block color="primary" class="mt-12">تایید
        </v-btn>
      </v-form>
      <v-row justify="space-between" dense class="mt-2">
        <v-btn small text color="grey" to="/ForgetPass">بازیابی رمز عبور</v-btn>
        <v-btn small text color="primary" to="/Register">ایجاد حساب کاربری</v-btn>
      </v-row>
    </v-card-text>
  </login-reg-card>
</template>

<script>
import captcha from "@/mixins/captcha";
import ATextField from "@/components/ATextField";
import LoginRegCard from "@/components/LoginRegCard";

export default {
  components: {LoginRegCard, ATextField},
  mixins: [captcha],
  layout: 'noToolbar',
  data() {
    return {
      showPass: false,
      l: {login: false},
      email: '',
      password: '',
    }
  },
  methods: {
    async login() {
      this.l.login = true
      try {
        await this.getCaptcha()
        await this.$axios.$get('/csrf-cookie')
        const loginState = await this.$axios.$post('/login', {
          email: this.email,
          password: this.password,
          captcha_token: this.captcha_token
        });
        if (loginState.meta === 'success') {
          await this.$router.replace('/')
        } else if (loginState.meta === 'token_needed') {
          this.$store.commit('credentials/set', {email: this.email, password: this.password})
          await this.$router.push('/LoginOtp')
        }
      } finally {
        this.l.login = false
      }
    },
  }
}
</script>

<style scoped>
.a-field fieldset {
  border: 1px solid #eee !important;
}
</style>

