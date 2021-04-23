<template>
  <div class="pa-6">
    <p class="text-h4 text-right">امنیت</p>
    <v-card width="100%" class="py-8 px-12">
      <a-row class="align-center">
        <v-icon color="grey" large>mdi-google</v-icon>
        <div class="mr-4" style="margin-left: 240px">
          <p class="mb-2">کد دو عاملی</p>
          <p class="mb-0 text-body-2 grey--text">برای برداشت و اصلاحات امنیتی استفاده می شود</p>
        </div>
        <v-btn :loading="l.toggleGmfa"
               small outlined color="primary" class="px-6">
          {{ btnText }}
        </v-btn>
      </a-row>

      <v-divider class="my-6"/>

      <a-row class="align-center">
        <v-icon color="grey" large>mdi-google</v-icon>
        <div class="mr-4" style="margin-left: 240px">
          <p class="mb-2">احراز هویت از طریق پیامک</p>
          <p class="mb-0 text-body-2 grey--text">برای برداشت و اصلاحات امنیتی استفاده می شود</p>
        </div>
        <v-btn @click="onToggle" :loading="l.toggle"
               small outlined color="primary" class="px-6">
          {{ btnText }}
        </v-btn>
      </a-row>
    </v-card>

    <a-row class="pt-3">
      <v-col cols="6" class="pr-0">
        <v-card width="100%" class="pa-6">
          <card-title-with-chevron title="مدیریت دستگاه ها" icon="mdi-cellphone"/>
        </v-card>
      </v-col>

      <v-col cols="6" class="pl-0">
        <v-card width="100%" class="pa-6" @click="d.changePass = true">
          <card-title-with-chevron title="تغییر رمز عبور" icon="mdi-lock"/>
        </v-card>
      </v-col>
    </a-row>

    <v-dialog v-model="d.changePass">
      <a-card divider class="mt-4" title="تغییر رمز عبور">
        <v-row justify="center">
          <v-col cols="4">
            <v-form @submit.prevent="changePass" v-model="form" ref="form">
              <a-text-field eng :type="showPass ? 'text' : 'password'"
                            label="رمز عبور فعلی" v-model="dto.old_password">
                <v-icon class="px-2 py-1" size="20px" @click="showPass = !showPass">
                  {{ showPass ? 'mdi-eye' : 'mdi-eye-off' }}
                </v-icon>
              </a-text-field>

              <a-text-field eng :type="showPass ? 'text' : 'password'"
                            :rules="[rules.required, rules.password, rules.counter]"
                            label="رمز عبور جدید"
                            v-model="dto.new_password">
                <v-icon class="px-2 py-1" size="20px" @click="showPass = !showPass">
                  {{ showPass ? 'mdi-eye' : 'mdi-eye-off' }}
                </v-icon>

              </a-text-field>
              <a-text-field eng :type="showPass ? 'text' : 'password'"
                            label="تکرار رمز عبور جدید"
                            v-model="repeatNewPass">
                <v-icon class="px-2 py-1" size="20px" @click="showPass = !showPass">
                  {{ showPass ? 'mdi-eye' : 'mdi-eye-off' }}
                </v-icon>
              </a-text-field>

              <div class="text-center mt-8">
                <v-btn type="submit" :loading="l.changePass"
                       color="error" depressed> تغییر رمز عبور
                </v-btn>
              </div>
            </v-form>
          </v-col>
        </v-row>
      </a-card>
    </v-dialog>

  </div>

</template>

<script>
import ACard from "@/components/ACard";
import pstopper from "@/mixins/pstopper";
import ATextField from "@/components/ATextField";
import {error, success} from "@/models/snackBus";

export default {
  components: {ATextField, ACard},
  mixins: [pstopper],
  computed: {
    mfaIsEnabled() {
      return this.mfa_method === 'sms'
    },
    getInverted() {
      return this.mfaIsEnabled ? 'none' : 'sms'
    },
    btnText() {
      return this.mfaIsEnabled ? 'غیرفعال سازی' : 'فعال سازی'
    },
    // btnColor() {
    //   return this.mfaIsEnabled ? 'F849601E' : '#02c0761E'
    // },
    // btnClass() {
    //   return this.mfaIsEnabled ? 'error--text' : 'success--text'
    // },
    statusText() {
      return this.mfaIsEnabled ? 'فعال' : 'غیرفعال'
    },
    statusClass() {
      return this.mfaIsEnabled ? 'success--text' : 'error--text'
    }
  },
  data() {
    return {
      mfa_method: '',
      dto: {
        old_password: '',
        new_password: '',
      },
      repeatNewPass: '',
      showPass: false,
      form: false,
      l: {toggle: false, changePass: false, toggleGmfa: false},
      d: {changePass: false},
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
      },
    }
  },
  async mounted() {
    this.mfa_method = (await this.$axios.$get('/profiles/me')).mfa_method
  },
  methods: {
    async onToggle() {
      this.l.toggle = true
      this.mfa_method = await this.$axios.$post('/profiles/me/mfa', {
        mfa_method: this.getInverted
      })
      this.l.toggle = false
    },
    async changePass() {
      this.$refs.form.validate()
      if (this.form) {
        if (this.dto.new_password === this.repeatNewPass) {
          this.l.changePass = true
          await this.$axios.$post('/change-pass', this.dto)
          this.l.changePass = false
          success('رمز عبور با موفقیت تغییر داده شد.')
        } else {
          error('رمز عبور با تکرار تطابق ندارد.')
        }
      }
    },
  }
}
</script>

<style scoped>

</style>