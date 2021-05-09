<template>
  <two-sided-panel title="ثبت نام در بیترا">
    <template v-slot:pic>
      <v-img max-width="280px" max-height="280px"
             :src="require('../assets/images/Bitra_Logo_Final_Edition-18@3x.png')"/>
    </template>

    <div>
      <!--      <v-tabs>-->
      <!--        <v-tab>حقیقی</v-tab>-->
      <!--        <v-tab>حقوقی</v-tab>-->
      <!--      </v-tabs>-->
      <!--      <v-divider/>-->
      <v-form dir="ltr" @submit.prevent="register" v-model="form" ref="form">
        <a-text-field eng :rules="[rules.required, rules.email]" class="mt-4" label="ایمیل" v-model="email"/>
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
        <a-text-field :disabled="hasReferral"
                      eng filled label="کد معرف(اختیاری)" v-model="referral_code"/>
        <div dir="rtl">
          <v-checkbox v-model="terms" :rules="[rules.required]">
            <template v-slot:label>
              <a class=" text-body-2" @click="gotoTerms">قوانین و شرایط</a>
              <span class="text-body-2">&nbsp;بیترا را می پذیرم.</span>
            </template>
          </v-checkbox>
        </div>
        <v-btn type="submit" :loading="l.reg"
               class="mb-8 mt-4" color="primary " block> ادامه
        </v-btn>
      </v-form>
      <span class="text-body-2">قبلا ثبت نام کرده اید؟</span>
      <nuxt-link class="text-body-2 " to="/Login">وارد شوید</nuxt-link>
    </div>
  </two-sided-panel>
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
  computed: {
    hasReferral() {
      return !!this.$route.query.referral_code
    }
  },
  mounted() {
    if (this.$route.query.email) this.email = this.$route.query.email
    if (this.$route.query.referral_code) this.referral_code = this.$route.query.referral_code
  },
  data() {
    return {
      form: false,
      showPass: false,
      email: '',
      password: '',
      passwordConfirm: '',
      referral_code: '',
      terms: false,
      l: {reg: false},
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
            captcha_token: this.captcha_token
          })
          this.$store.commit('credentials/set', {
            email: this.email,
            password: this.password,
            referral_code: this.referral_code
          })
          await this.$router.push('/RegisterVerify')
          this.l.reg = false
        } else {
          this.$bus.$emit('snack', 'رمز عبور با تکرار تطابق ندارد.', 'error')
        }
      }
    },
    gotoTerms() {
      window.open('https://bitra.market/terms/', '_blank')
    }
  }
}
</script>

<style scoped>

</style>