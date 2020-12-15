<template>
  <v-row justify="center" class="text-center">
    <v-col cols="4">
      <v-card class="pt-12 pb-8 px-4" elevation="6">
        <div class="text-h5">ورود به حساب کاربری</div>
        <v-card-text class="mt-16">
          <a-text-field v-model="email" label="ایمیل"/>
          <a-text-field v-model="password" label="رمز عبور" type="password"/>
          <v-btn @click="login" :loading="l.login"
                 block color="primary" class="mt-8">تایید
          </v-btn>
          <v-row justify="space-between" dense class="mt-2">
            <v-btn small text color="grey" to="/ForgetPass">بازیابی رمز عبور</v-btn>
            <v-btn small text color="primary" to="/Register">ایجاد حساب کاربری</v-btn>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import captcha from "@/mixins/captcha";
import ATextField from "@/components/ATextField";

export default {
  components: {ATextField},
  mixins: [captcha],
  layout: 'noToolbar',
  data() {
    return {
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

