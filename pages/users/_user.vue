<template>
  <div>
    <v-card class="d-flex align-stretch" style="height: 85vh">
      <v-col cols="3" class="secondary d-flex justify-end">
        <div class="text-h4 d-flex flex-column justify-space-between align-end ml-n5 mb-16">
          <v-row align="center" style="cursor: pointer"
                 @click="navigate(0)">
            <div class="ml-6" :class="stepTextColor(0)">اطلاعات شخصی</div>
            <v-avatar :class="circleTextColor(0)" :color="circleColor(0)" size="42">1</v-avatar>
          </v-row>
          <v-row align="center" style="cursor: pointer"
                 @click="navigate(1)">
            <div class="ml-6" :class="stepTextColor(1)">اطلاعات مالی</div>
            <v-avatar :class="circleTextColor(1)" :color="circleColor(1)" size="42">2</v-avatar>
          </v-row>
          <v-row align="center" style="cursor: pointer"
                 @click="navigate(2)">
            <div class="ml-6" :class="stepTextColor(2)">اطلاعات تکمیلی</div>
            <v-avatar :class="circleTextColor(2)" :color="circleColor(2)" size="42">3</v-avatar>
          </v-row>
        </div>
      </v-col>

      <v-col cols="9">
        <v-window vertical reverse v-model="stepNum" style="padding: 2px 96px ">
          <v-window-item>
            <v-form v-model="valid.step0" ref="stepOneForm">
              <v-row>
                <v-col cols="6">
                  <a-text-field :rules="[rules.required,rules.persian]"
                                v-model="user.name" label="نام"
                                hint="احمد"
                                :disabled="verifyState.ssn"/>
                  <a-text-field :rules="[rules.required,rules.persian]"
                                v-model="user.last_name" label="نام خانوادگی"
                                hint="برزین"
                                :disabled="verifyState.ssn"/>

                  <div class="mt-4">
                    <p class="text-h6 mb-1">تاریخ تولد</p>
                    <custom-date-picker v-model="user.birth_date" :disabled="verifyState.ssn">
                      <template slot="label">
                      </template>
                    </custom-date-picker>
                  </div>
                  <div class="mt-8">
                    <p class="text-h6 mb-2">تصویر کارت ملی</p>
                    <vue2-dropzone id="ssn_id" :options="dropzoneOptions.ssn" :useCustomSlot=true>
                      <v-row align="center">
                        <v-icon color="primary">mdi-camera</v-icon>
                        <div class="text-h6 mr-2">فرمت فایل png jpg باشد و حداکثر حجم ۵۰۰ کیلوبایت</div>
                      </v-row>
                    </vue2-dropzone>
                  </div>
                </v-col>
                <v-col cols="6">
                  <a-text-field :rules="[rules.required,rules.tenDigit]"
                                mask="##########"
                                hint="1234567890"
                                v-model="user.ssn" label="کد ملی"
                                :disabled="verifyState.ssn"/>

                  <a-text-field :rules="[rules.required,rules.elevenDigit]"
                                mask="###########"
                                v-model="user.cell_phone" label="موبایل"
                                hint="09121234567"
                                :disabled="verifyState.cell_phone">
                    <v-btn @click="requestMobileOtp" :loading="l.mobileRequest"
                           outlined tile depressed small class="primary--text inside-btn" color="primary lighten-4">
                      دریافت
                      کد
                      تایید
                    </v-btn>
                  </a-text-field>

                  <div class="mt-3">
                    <p class="text-h6 mb-1">جنسیت</p>
                    <v-select dense outlined flat
                              :items="genderList" v-model="user.gender"
                              :disabled="verifyState.ssn"/>
                  </div>

                  <div class="mt-n2">
                    <p class="text-h6 mb-2">
                      تصویر تایید هویت
                      <span>&nbsp<v-icon @click="onGuide" color="success">mdi-alert-circle-outline</v-icon></span>
                    </p>
                    <vue2-dropzone id="bank_card_id" :options="dropzoneOptions.bankCard" :useCustomSlot=true>
                      <v-row align="center">
                        <v-icon color="primary">mdi-camera</v-icon>
                        <div class="text-h6 mr-2">فرمت فایل png jpg باشد و حداکثر حجم ۵۰۰ کیلوبایت</div>
                      </v-row>
                    </vue2-dropzone>
                  </div>
                </v-col>
              </v-row>
            </v-form>
          </v-window-item>
          <v-window-item>
            <v-form v-model="valid.step1" ref="stepTwoForm">
              <v-row justify="center">
                <v-col cols="6" dir="ltr">
                  <a-text-field
                      :rules="[rules.required]"
                      mask="################"
                      hint="6037991234567890"
                      v-model="user.bank_card" label="شماره کارت"
                      :disabled="verifyState.bank_card"/>
                  <a-text-field
                      :rules="[rules.required]"
                      mask="AA########################"
                      hint="IR123456789012345678901234"
                      v-model="user.bank_shaba" label="شماره شبا"
                      :disabled="verifyState.bank_shaba"/>
                </v-col>
              </v-row>
            </v-form>
          </v-window-item>
          <v-window-item>
            <v-form v-model="valid.step2" ref="stepThreeForm">
              <v-row class="mt-4">
                <v-col cols="6">
                  <div class="mb-n6">
                    <p class="text-h6 mb-1">استان</p>
                    <v-select dense outlined flat :rules="[rules.required]"
                              :items="provinceList" v-model="user.province"
                              :disabled="verifyState.address"/>
                  </div>

                  <a-text-field
                      :rules="[rules.required]"
                      v-model="user.address" label="آدرس"
                      :disabled="verifyState.address"/>

                  <a-text-field hint="02112345678"
                                mask="###############"
                                :rules="[rules.required]"
                                v-model="user.phone" label="تلفن ثابت"
                                :disabled="verifyState.phone">
                    <v-btn outlined tile depressed small class="primary--text inside-btn" color="primary lighten-4"
                           @click="requestPhoneOtp" :loading="l.phoneRequest">دریافت کد تایید
                    </v-btn>
                  </a-text-field>

                </v-col>
                <v-col cols="6">
                  <div class="mb-n6">
                    <p class="text-h6 mb-1">شهر</p>
                    <v-select dense outlined flat :rules="[rules.required]"
                              :items="cityList(user.province)" v-model="user.city"
                              :disabled="verifyState.address"/>
                  </div>

                  <a-text-field
                      :rules="[rules.required, rules.tenDigit ]"
                      mask="##########"
                      hint="1234567890"
                      v-model="user.postal_code" label="کدپستی"
                      :disabled="verifyState.address"/>

                  <div class="mt-4">
                    <p class="text-h6 mb-1">تصویر قبض تلفن یا قبوض خدماتی</p>
                    <vue2-dropzone id="bill_id" :options="dropzoneOptions.bill" :useCustomSlot=true>
                      <v-row align="center">
                        <v-icon color="primary">mdi-camera</v-icon>
                        <div class="text-h6 mr-2">فرمت فایل png jpg باشد و حداکثر حجم ۵۰۰ کیلوبایت</div>
                      </v-row>
                    </vue2-dropzone>
                  </div>

                </v-col>
              </v-row>
            </v-form>
          </v-window-item>
        </v-window>
        <!--        <div>-->
        <div style=" position: absolute; bottom: 0; width: 100%">
          <v-divider class="my-0 ml-6"/>
          <div class="d-flex py-4">
            <v-btn style="border: 1px solid #0074ff" class="px-16 ml-2" outlined color="primary" @click=prev text>
              {{ prevLabel }}
            </v-btn>
            <v-btn class="px-16" @click=next :loading="l.send" color="primary"> {{ nextLabel }}</v-btn>
          </div>
        </div>
      </v-col>
    </v-card>

    <div>
      <v-dialog v-model="dialog.mobileOtp" max-width="400">
        <a-card title="احراز اصالت موبایل"
                subtitle="کد تایید ۶رقمی ارسال شده به شماره موبایل خود را وارد کنید.">
          <otp :loading="l.mobileSubmit" class="mt-8" @send="submitMobileOtp" @otp="mobile.otp=$event"
               label="کد تایید"/>
        </a-card>
      </v-dialog>

      <v-dialog v-model="dialog.phoneOtp" max-width="400">
        <a-card title="احراز اصالت تلفن ثابت"
                subtitle="کد تایید ۶رقمی ارسال شده به شماره تلفن ثابت خود را وارد کنید.">
          <otp :loading="l.phoneSubmit" class="mt-8" @send="submitPhoneOtp" @otp="phone.otp=$event" label="کد تایید"/>
        </a-card>
      </v-dialog>

      <div class="text-center">
        <v-btn v-show="isAdmin" :to="`/admin/verify/`+userId" color="red">تایید مدارک (ادمین)</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'

import pstopper from "@/mixins/pstopper";
import ATextField from "@/components/ATextField";
import ACard from "@/components/ACard";
import Otp from "@/components/Otp";
import plist from '@/models/provinceList'
import collect from 'collect.js'
import persianRex from 'persian-rex'

export default {
  mixins: [pstopper],
  components: {vue2Dropzone, Otp, ACard, ATextField},
  computed: {
    totalSteps: () => 3,
    provinceList() {
      return collect(plist).pluck('province').all()
    },
  },
  data() {
    return {
      rules: {
        required: value => !!value || 'الزامی است',
        persian: value => {
          let pattern = /^[\u06A9\u06AF\u06C0\u06CC\u060C\u062A\u062B\u062C\u062D\u062E\u062F\u063A\u064A\u064B\u064C\u064D\u064E\u064F\u067E\u0670\u0686\u0698\u200C\u0621-\u0629\u0630-\u0639\u0641-\u0654\s]+$/
          return pattern.test(value) || 'الزاما فارسی وارد شود'
        },
        tenDigit: value => !!value && value.length === 10 || 'میبایست ۱۰ رقم باشد',
        elevenDigit: value => !!value && value.length === 11 || 'میبایست ۱۱ رقم باشد',
      },
      valid: {step0: false, step1: false, step2: false},
      genderList: ['خانم', 'آقا'],
      ssn: '',
      bill: '',
      bankCard: '',
      mobile: {otp: ''},
      phone: {otp: ''},
      dropzoneOptions: {
        ssn: {
          paramName: 'ssn',
          url: this.$axios.defaults.baseURL + '/profiles/me/docs',
          withCredentials: true,
          headers: {'X-XSRF-TOKEN': this.$cookies.get('XSRF-TOKEN')},
          maxFiles: 1,
          thumbnailWidth: 48,
          thumbnailHeight: 48,
          maxFilesize: 0.5,
        },
        bill: {
          paramName: 'bill',
          url: this.$axios.defaults.baseURL + '/profiles/me/docs',
          withCredentials: true,
          headers: {'X-XSRF-TOKEN': this.$cookies.get('XSRF-TOKEN')},
          maxFiles: 1,
          thumbnailWidth: 48,
          thumbnailHeight: 48,
          maxFilesize: 0.5,
        },
        bankCard: {
          paramName: 'bank-card',
          url: this.$axios.defaults.baseURL + '/profiles/me/docs',
          withCredentials: true,
          headers: {'X-XSRF-TOKEN': this.$cookies.get('XSRF-TOKEN')},
          maxFiles: 1,
          thumbnailWidth: 48,
          thumbnailHeight: 48,
          maxFilesize: 0.5,
        }
      },
      l: {
        mobileSubmit: false, mobileRequest: false,
        phoneSubmit: false, phoneRequest: false,
        send: false
      },

      userId: this.$route.params.user,
      isAdmin: this.$store.state.auth.profile?.role === 'admin',
      stepNum: 0,
      dialog: {send: false, mobileOtp: false, phoneOtp: false},
      nextLabel: 'ارسال',
      prevLabel: 'بازگشت',
      user: {
        name: '',
        last_name: '',
        ssn: '',
        cell_phone: '',
        province: '',
        gender: '',
        birth_date: '',
        city: '',
        address: '',
        postal_code: '',
        phone: '',
        bank_card: '',
        bank_shaba: '',
        bank_account: ''
      },
      verifyState: {
        email: false,
        cell_phone: false,
        phone: false,
        ssn: false,
        address: false,
        bank_card: false,
        bank_shaba: false,
        bank_account: false
      },
    }
  },
  async mounted() {
    window.rex = persianRex
    this.$refs.stepOneForm.resetValidation()
    this.user = await this.$axios.$get('/profiles/' + this.userId);
    let id = this.isAdmin ? this.userId : 'me'
    this.verifyState = await this.$axios.$get('/profiles/' + id + '/verifies');
  },
  methods: {
    cityList(province) {
      return collect(plist)
          .filter(item => item.province === province)
          .pluck('city')
          .all()
    },
    async send() {
      this.l.send = true
      await this.$axios.$put('/profiles/' + this.userId, this.user)
      this.l.send = false
      this.$bus.$emit('snack', 'با موفقیت ثبت شد.', 'success')
    },
    navigate(step) {
      this.stepNum = step
      this.setBtnState()
    },
    async next() {
      if (this.stepNum === 0) this.$refs.stepOneForm.validate()
      if (this.stepNum === 1) this.$refs.stepTwoForm.validate()
      if (this.stepNum === 2) this.$refs.stepThreeForm.validate()

      if ((this.stepNum === 0 && this.valid.step0) ||
          (this.stepNum === 1 && this.valid.step1) ||
          (this.stepNum === 2 && this.valid.step2)) {
        await this.send()
        this.stepNum++
        if (this.stepNum === this.totalSteps) {
          await this.$router.push('/')
        } else {
          this.setBtnState()
        }
      }
    },
    async prev() {
      if (this.stepNum === 0) {
        await this.$router.push('/')
      } else {
        this.stepNum--
        this.setBtnState()
      }
    },
    setBtnState() {
      if (this.stepNum === this.totalSteps - 1) {
        this.nextLabel = 'ارسال'
        this.prevLabel = 'قبلی'
      } else if (this.stepNum === 0) {
        this.nextLabel = 'ارسال'
        this.prevLabel = 'بازگشت'
      } else {
        this.nextLabel = 'ارسال'
        this.prevLabel = 'قبلی'
      }
    },
    circleColor(step) {
      if (step === this.stepNum) {
        return 'primary'
      } else if (step > this.stepNum) {
        return 'white'
      } else {
        return 'secondary'
      }
    },
    circleTextColor(step) {
      if (this.stepNum === step) {
        return 'white--text'
      } else if (step > this.stepNum) {
        return 'grey--text'
      } else {
        return 'white--text'
      }
    },
    stepTextColor(step) {
      return this.stepNum === step ? 'white--text' : 'grey--text';
    },
    async requestMobileOtp() {
      if (!!this.user.cell_phone && this.user.cell_phone.length === 11) {
        this.l.mobileRequest = true
        await this.$axios.$post('/otp-m', {cell_phone: this.user.cell_phone})
        this.l.mobileRequest = false
        this.dialog.mobileOtp = true
      }
    },
    async submitMobileOtp() {
      this.l.mobileSubmit = true
      await this.$axios.$post('/otp-m/verify', {otp: this.mobile.otp})
      this.mobile.otp = ''
      this.l.mobileSubmit = false
      this.dialog.mobileOtp = false
      this.$bus.$emit('snack', 'احراز اصالت موبایل با موفقیت انجام شد.', 'success')
    },
    async requestPhoneOtp() {
      this.l.phoneRequest = true
      await this.$axios.$post('/otp-c', {phone: this.user.phone})
      this.l.phoneRequest = false
      this.dialog.phoneOtp = true
    },
    async submitPhoneOtp() {
      this.l.phoneSubmit = true
      await this.$axios.$post('/otp-c/verify', {otp: this.phone.otp})
      this.phone.otp = ''
      this.l.phoneSubmit = false
      this.dialog.phoneOtp = false
      this.$bus.$emit('snack', 'احراز اصالت تلفن ثابت با موفقیت انجام شد.', 'success')
    },
    onGuide() {
      window.open('https://bitra.market/registerGuide/', '_blank')
    }
  }
}
</script>

<style scoped>
</style>