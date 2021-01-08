<template>
  <login-reg-card title="ایجاد حساب کاربری"
                  subtitle="به بیترا خوش آمدید">
    <v-card-text>
      <v-tabs>
        <v-tab>حقیقی</v-tab>
        <v-tab>حقوقی</v-tab>
      </v-tabs>
      <v-divider/>
      <v-form dir="ltr" @submit.prevent="register" v-model="form" ref="form">
        <a-text-field eng :rules="[rules.email]" class="mt-4" label="ایمیل" v-model="email"/>
        <a-text-field eng :rules="[rules.required, rules.password, rules.counter]"
                      :type="showPass ? 'text' : 'password'" label="رمز عبور" v-model="password">
          <v-icon class="px-2 py-1" size="20px" @click="showPass = !showPass">
            {{ showPass ? 'mdi-eye' : 'mdi-eye-off' }}
          </v-icon>
        </a-text-field>
        <a-text-field eng :type="showPass ? 'text' : 'password'" label="تکرار رمز عبور"
                      v-model="passwordConfirm">
          <v-icon class="px-2 py-1" size="20px" @click="showPass = !showPass">
            {{ showPass ? 'mdi-eye' : 'mdi-eye-off' }}
          </v-icon>
        </a-text-field>
        <a-text-field eng filled label="کد معرف(اختیاری)" v-model="referral_code"/>
        <div dir="rtl">
          <v-checkbox v-model="terms" :rules="[rules.required]">
            <template v-slot:label>
              <a class="text-h6" @click="dialog.terms=true">قوانین و شرایط</a>
              <span class="text-h6">&nbsp;بیترا را می پذیرم.</span>
            </template>
          </v-checkbox>
        </div>
        <v-btn type="submit" :loading="l.reg"
               class="mb-8 mt-4" color="primary" block> تایید
        </v-btn>
      </v-form>
      <span class="text-h6">قبلا ثبت نام کرده اید؟</span>
      <nuxt-link class="text-h6" to="/Login">ورود</nuxt-link>
    </v-card-text>

    <v-dialog v-model="dialog.terms" max-width="400">
      <v-card>
        <v-card-title>قوانین و شرایط استفاده از خدمات بیترا</v-card-title>
        <v-card-text>
          <terms/>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="dialog.terms=false" text color="primary">بله</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </login-reg-card>
</template>

<script>
import captcha from "@/mixins/captcha";
import pstopper from "@/mixins/pstopper";
import ATextField from "@/components/ATextField";
import LoginRegCard from "@/components/LoginRegCard";
import Terms from "@/pages/Terms";

export default {
  components: {ATextField, LoginRegCard, Terms},
  mixins: [captcha, pstopper],
  layout: 'noToolbar',
  data() {
    return {
      form: false,
      showPass: false,
      email: this.$route.query.email,
      password: '',
      passwordConfirm: '',
      referral_code: this.$route.query.referral_code,
      terms: false,
      l: {reg: false},
      dialog: {terms: false},
      rules: {
        required: value => !!value || 'الزامی است',
        counter: value => value.length >= 6 || 'حداقل ۶ کاراکتر',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'ایمیل درست نیست'
        },
        password: value => {
          // at least number - small - capital
          const pattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).+$/
          return pattern.test(value) || 'شامل حداقل یک حرف کوچک، یک حرف بزرگ، و یک عدد باشد'
        },
      }
    }
  },
  methods: {
    async register() {
      this.$refs.form.validate()
      if (this.form) {
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
        } else {
          this.$bus.$emit('snack', 'رمز عبور با تکرار تطابق ندارد.', 'error')
        }
      }
    }
  }
}
</script>

<style scoped>

</style>