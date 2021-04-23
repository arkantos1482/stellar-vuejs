<template>
  <div>
    <v-card class="d-flex flex-column align-center">
      <v-stepper v-model="stepNum" style="width: 50%;background: #00061a">
        <v-stepper-header>
          <v-stepper-step step="0">اطلاعات شخصی</v-stepper-step>
          <v-divider/>
          <v-stepper-step step="1">اطلاعات بانکی</v-stepper-step>
          <v-divider/>
          <v-stepper-step step="2">تایید هویت</v-stepper-step>
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content step="0" class="pt-0">
            <v-form v-model="valid.step0" ref="stepOneForm">
              <!--              1-ROW-->
              <a-row>
                <v-col cols="6" class="py-0">
                  <a-text-field :rules="[rules.required,rules.persian]"
                                v-model="user.name" label="نام"
                                hint="احمد"
                                :disabled="verifyState.ssn"/>
                </v-col>
                <v-col cols="6" class="py-0">
                  <a-text-field :rules="[rules.required,rules.persian]"
                                v-model="user.last_name" label="نام خانوادگی"
                                hint="برزین"
                                :disabled="verifyState.ssn"/>
                </v-col>
              </a-row>

              <!--              2-ROW-->
              <a-row>
                <v-col cols="6" class="py-0">
                  <a-text-field :rules="[rules.required,rules.elevenDigit]"
                                mask="###########"
                                v-model="user.cell_phone" label="شماره موبایل"
                                hint="09121234567"
                                :disabled="verifyState.cell_phone">
                    <v-btn @click="requestMobileOtp" :loading="l.mobileRequest"
                           outlined tile depressed small class="primary--text inside-btn" color="primary lighten-4">
                      دریافت
                      کد
                      تایید
                    </v-btn>
                  </a-text-field>
                </v-col>
                <v-col cols="6" class="py-0">
                  <a-text-field :rules="[rules.required,rules.tenDigit]"
                                mask="##########"
                                hint="1234567890"
                                v-model="user.ssn" label="کد ملی"
                                :disabled="verifyState.ssn"/>
                </v-col>
              </a-row>

              <!--              3-ROW-->
              <a-row>
                <v-col cols="6" class="py-0">
                  <p class=" mb-1">جنسیت</p>
                  <v-select dense outlined flat
                            :items="genderList" v-model="user.gender"
                            :disabled="verifyState.ssn"/>
                </v-col>
                <v-col cols="6" class="py-0">
                  <p class=" mb-1">تاریخ تولد</p>
                  <custom-date-picker v-model="user.birth_date" :disabled="verifyState.ssn">
                    <template slot="label">
                    </template>
                  </custom-date-picker>
                </v-col>
              </a-row>

              <!--              4-ROW-->
              <a-row>
                <v-col cols="6" class="py-0">
                  <p class=" mb-3">تصویر کارت ملی</p>
                  <vue2-dropzone id="ssn_id"
                                 :options="dropzoneOptions.ssn" :useCustomSlot=true>
                    <v-row align="center">
                      <v-icon color="primary">mdi-camera</v-icon>
                      <p class=" mr-2" style="line-height: 1.4">فرمت فایل png jpg باشد و
                        <br>حداکثر حجم ۵۰۰ کیلوبایت
                      </p>
                    </v-row>
                  </vue2-dropzone>
                </v-col>

                <v-col cols="6" class="py-0">
                  <p class=" mb-2">
                    تصویر تایید هویت
                    <span>&nbsp<v-icon @click="onGuide" color="success">mdi-alert-circle-outline</v-icon></span>
                  </p>
                  <vue2-dropzone id="bank_card_id"
                                 :options="dropzoneOptions.bankCard" :useCustomSlot=true>
                    <v-row align="center">
                      <v-icon color="primary">mdi-camera</v-icon>
                      <p class=" mr-2" style="line-height: 1.4">فرمت فایل png jpg باشد و
                        <br>حداکثر حجم ۵۰۰ کیلوبایت
                      </p>
                    </v-row>
                  </vue2-dropzone>
                </v-col>
              </a-row>
            </v-form>
          </v-stepper-content>
          <v-stepper-content step="1" class="pt-0">
            <v-form v-model="valid.step1" ref="stepTwoForm">
              <v-row justify="center">
                <v-col cols="6" class="py-0" dir="ltr">
                  <a-text-field
                      :rules="[rules.required]"
                      mask="################"
                      hint="6037991234567890"
                      v-model="user.bank_card" label="شماره کارت"
                      :disabled="verifyState.bank_card"/>
                  <a-text-field
                      mask="################"
                      hint="6037991234567890"
                      v-model="user.bank_card_2" label="شماره کارت۲"
                      :disabled="verifyState.bank_card_2"/>
                  <a-text-field
                      :rules="[rules.required]"
                      mask="AA########################"
                      hint="IR123456789012345678901234"
                      v-model="user.bank_shaba" label="شماره شبا"
                      :disabled="verifyState.bank_shaba"/>
                  <a-text-field
                      mask="AA########################"
                      hint="IR123456789012345678901234"
                      v-model="user.bank_shaba_2" label="شماره شبا۲"
                      :disabled="verifyState.bank_shaba_2"/>
                </v-col>
              </v-row>
            </v-form>
          </v-stepper-content>
          <v-stepper-content step="2" class="pt-0">
            <v-form v-model="valid.step2" ref="stepThreeForm">
              <v-row class="mt-4">
                <v-col cols="6" class="py-0">
                  <div>
                    <p class=" mb-1">استان</p>
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
                <v-col cols="6" class="py-0">
                  <div>
                    <p class=" mb-1">شهر</p>
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
                    <p class=" mb-1">تصویر قبض تلفن یا قبوض خدماتی</p>
                    <vue2-dropzone id="bill_id"
                                   :options="dropzoneOptions.bill" :useCustomSlot=true>
                      <v-row align="center">
                        <v-icon color="primary">mdi-camera</v-icon>
                        <p class=" mr-2" style="line-height: 1.4">فرمت فایل png jpg باشد و
                          <br>حداکثر حجم ۵۰۰ کیلوبایت
                        </p>
                      </v-row>
                    </vue2-dropzone>
                  </div>

                </v-col>
              </v-row>
            </v-form>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>

      <!--      <div style=" position: absolute; bottom: 0; width: 100%">-->
      <div>
        <v-divider class="my-0 ml-6"/>
        <div class="d-flex py-4">
          <v-btn style="border: 1px solid #0074ff" class="px-16 ml-2" outlined color="primary" @click=prev text>
            {{ prevLabel }}
          </v-btn>
          <v-btn class="px-16" @click=next :loading="l.send" color="primary"> {{ nextLabel }}</v-btn>
          <v-btn class="mr-4" v-show="isAdmin" :to="`/admin/verify/`+userId" color="red">تایید مدارک (ادمین)</v-btn>
        </div>
      </div>
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

export default {
  mixins: [pstopper],
  components: {vue2Dropzone, Otp, ACard, ATextField},
  computed: {
    totalSteps: () => 3,
    provinceList() {
      return collect(plist).pluck('province').all()
    },
    dropzoneOptions() {
      return {
        ssn: {
          ...this.baseDropZoneConfig,
          paramName: 'ssn',
        },
        bill: {
          ...this.baseDropZoneConfig,
          paramName: 'bill',
        },
        bankCard: {
          ...this.baseDropZoneConfig,
          paramName: 'bank-card',
        }
      }
    }
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
      baseDropZoneConfig: {
        url: this.$axios.defaults.baseURL + '/profiles/me/docs',
        withCredentials: true,
        headers: {'X-XSRF-TOKEN': this.$cookies.get('XSRF-TOKEN')},
        // acceptedFiles: 'image/jpeg,image/png',
        maxFiles: 1,
        addRemoveLinks: true,
        thumbnailWidth: 128,
        thumbnailHeight: 128,
        maxFilesize: 0.5,
        dictRemoveFile: 'لغو ارسال',
        dictMaxFilesExceeded: 'تنها یک تصویر',
        dictFileTooBig: 'حجم غیرمجاز',
        dictInvalidFileType: 'نوع فایل غیرمجاز',
        dictResponseError: 'پذیرفته نشد'
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
        bank_card_2: '',
        bank_shaba: '',
        bank_shaba_2: '',
        bank_account: ''
      },
      verifyState: {
        email: false,
        cell_phone: false,
        phone: false,
        ssn: false,
        address: false,
        bank_card: false,
        bank_card_2: false,
        bank_shaba: false,
        bank_shaba_2: false,
        bank_account: false
      },
    }
  },
  async mounted() {
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
      // await this.$axios.$put('/profiles/' + this.userId, this.user)
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
        this.nextLabel = 'ثبت و ادامه'
        this.prevLabel = 'انصراف'
      } else if (this.stepNum === 0) {
        this.nextLabel = 'ثبت و ادامه'
        this.prevLabel = 'انصراف'
      } else {
        this.nextLabel = 'ثبت و ادامه'
        this.prevLabel = 'انصراف'
      }
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