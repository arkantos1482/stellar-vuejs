<template>
  <v-row justify="center" class="text-center" >
    <v-col cols="4">
      <v-card elevation="6">
        <div class="text-center">ایجاد حساب کاربری</div>
        <v-card-subtitle>خوش آمدید</v-card-subtitle>
        <v-card-text>
          <v-tabs>
            <v-tab>حقیقی</v-tab>
            <v-tab>حقوقی</v-tab>
          </v-tabs>
          <v-divider/>
          <a-text-field class="mt-4" label="ایمیل" v-model="email"/>
          <a-text-field type="password" label="رمز عبور" v-model="password"/>
          <a-text-field type="password" label="تکرار رمز عبور" v-model="password"/>
          <a-text-field label="کد معرف(اختیاری)" v-model="referral_code"/>
          <v-checkbox v-model="terms">
            <template v-slot:label>
              <a href="#">قوانین و شرایط</a>
              <span>بیترا را می پذریم.</span>
            </template>
          </v-checkbox>
          <v-btn @click="register" :loading="l.reg"
                 color="primary" block> تایید
          </v-btn>
          <p>قبلا ثبت نام کرده اید؟</p>
          <nuxt-link to="/Login">ورود</nuxt-link>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import captcha from "@/mixins/captcha";
import pstopper from "@/mixins/pstopper";
import ATextField from "@/components/ATextField";

export default {
  components: {ATextField},
  mixins: [captcha, pstopper],
  layout: 'noToolbar',
  data() {
    return {
      email: '',
      password: '',
      referral_code: null,
      terms: false,
      l: {reg: false}
    }
  },
  methods: {
    async register() {
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
</script>

<style scoped>

</style>