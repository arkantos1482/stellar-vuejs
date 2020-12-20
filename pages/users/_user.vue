<template>
  <div>
    <v-stepper v-model="stepNum">
      <v-stepper-header>
        <v-stepper-step :complete="stepNum > 1" step="1"> اطلاعات شخصی</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="stepNum > 2" step="2"> اطلاعات مالی</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="3"> اطلاعات تکمیلی</v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-row>
            <v-col cols="6">
              <a-text-field :background-color="verifyState.ssn|toColor"
                            v-model="user.name" label="نام"/>
              <a-text-field :background-color="verifyState.ssn|toColor"
                            v-model="user.last_name" label="نام خانوادگی"/>
            </v-col>
            <v-col cols="6">
              <a-text-field :background-color="verifyState.ssn|toColor"
                            v-model="user.ssn" label="کد ملی"/>
              <v-text-field dense outlined :background-color="verifyState.cell_phone|toColor"
                            v-model="user.cell_phone" label="موبایل">
                <template v-slot:append>
                  <v-btn @click="requestMobileOtp" :loading="l.mobileRequest"
                         depressed small color="primary">درخواست توکن
                  </v-btn>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row class="mt-n4">
            <v-col cols="6">
              <v-file-input dense prepend-icon=""
                            prepend-inner-icon="mdi-camera"
                            height="96px"
                            outlined label="تصویر کارت ملی" show-size @change="ssn=$event"/>
              <v-btn class="mt-n8" small depressed color="primary"
                     :loading="l.ssn" @click="uploadSsn">ارسال
              </v-btn>
            </v-col>
          </v-row>
        </v-stepper-content>


        <v-stepper-content step="2">
          <v-row justify="center">
            <v-col cols="6">
              <a-text-field :background-color="verifyState.bank_card|toColor"
                            v-model="user.bank_card" label="شماره کارت"/>
              <a-text-field :background-color="verifyState.bank_shaba|toColor"
                            v-model="user.bank_shaba" label="شماره شبا"/>
            </v-col>
            <v-col cols="6">
              <a-text-field :background-color="verifyState.bank_account|toColor"
                            v-model="user.bank_account" label="شماره حساب"/>
              <v-row class="mt-n4">
                <v-col>
                  <v-file-input dense prepend-icon=""
                                prepend-inner-icon="mdi-camera"
                                height="96px"
                                outlined label="تصویر کارت بانکی" show-size @change="bankCard=$event"/>
                  <v-btn class="mt-n8" depressed small color="primary"
                         :loading="l.bankCard" @click="uploadBankCard">ارسال
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-row>
            <v-col cols="6">
              <a-text-field :background-color="verifyState.address|toColor"
                            v-model="user.city" label="شهر"/>
              <a-text-field :background-color="verifyState.address|toColor"
                            v-model="user.address" label="آدرس"/>
            </v-col>
            <v-col cols="6">

              <a-text-field :background-color="verifyState.address|toColor"
                            v-model="user.postal_code" label="کدپستی"/>
              <v-text-field dense outlined :background-color="verifyState.phone|toColor"
                            v-model="user.phone" label="تلفن ثابت">
                <template v-slot:append>
                  <v-btn small depressed color="primary" @click="requestPhoneOtp"
                         :loading="l.phoneRequest">درخواست توکن
                  </v-btn>
                </template>
              </v-text-field>

            </v-col>
          </v-row>

          <v-row class="mt-n4">
            <v-col cols="6">
              <v-file-input dense prepend-icon=""
                            prepend-inner-icon="mdi-camera"
                            height="96px"
                            outlined label="تصویر قبض تلفن" show-size @change="bill=$event"/>
              <v-btn class="mt-n8" small depressed color="primary"
                     :loading="l.bill" @click="uploadBill">ارسال
              </v-btn>
            </v-col>
          </v-row>
        </v-stepper-content>
      </v-stepper-items>

      <v-col cols="4" class="d-flex pb-4 px-8">
        <v-btn class="flex-grow-1 ml-2" outlined color="primary" @click=prev text> {{ prevLabel }}</v-btn>
        <v-btn class="flex-grow-1" @click=next :loading="l.send" color="primary"> {{ nextLabel }}</v-btn>
      </v-col>
    </v-stepper>

    <v-dialog v-model="dialog.send" max-width="400">
      <v-card>
        <v-card-title> آیا از ارسال مشخصات خود اطمینان دارید؟</v-card-title>
        <v-card-actions>
          <v-btn text color="primary" @click="send">confirm</v-btn>
          <v-btn text @click="dialog.send=false">cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog.mobileOtp" max-width="400">
      <v-card>
        <v-card-title>احراز اصالت موبایل</v-card-title>
        <v-card-text>
          <a-text-field v-model="mobile.otp" outlined label="رمز یکبار مصرف"/>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="primary" @click="submitMobileOtp" :loading="l.mobileSubmit">تایید توکن</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog.phoneOtp" max-width="400">
      <v-card class="mt-8 mb-8">
        <v-card-title>احراز اصالت تلفن ثابت</v-card-title>
        <v-card-text>
          <a-text-field v-model="phone.otp" outlined label="رمز یکبار مصرف"/>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="primary" @click="submitPhoneOtp" :loading="l.phoneSubmit">تایید توکن</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div class="text-center">
      <v-btn v-show="isAdmin" :to="`/admin/verify/`+userId" color="red">تایید مدارک (ادمین)</v-btn>
    </div>
  </div>
</template>

<script>
import pstopper from "@/mixins/pstopper";
import ATextField from "@/components/ATextField";

export default {
  mixins: [pstopper],
  components: {ATextField},
  filters: {
    toColor: value => value
  },
  computed: {
    totalSteps: () => 3
  },
  data() {
    return {
      ssn: '',
      bill: '',
      bankCard: '',
      mobile: {otp: ''},
      phone: {otp: ''},
      config: {headers: {"Content-Type": "multipart/form-data"}},
      l: {
        ssn: false, bill: false, bankCard: false,
        mobileSubmit: false, mobileRequest: false,
        phoneSubmit: false, phoneRequest: false,

        send: false
      },

      userId: this.$route.params.user,
      isAdmin: this.$store.state.auth.profile?.role === 'admin',
      stepNum: 1,
      dialog: {send: false, mobileOtp: false, phoneOtp: false},
      nextLabel: 'بعدی',
      prevLabel: 'قبلی',
      user: {
        name: '',
        last_name: '',
        ssn: '',
        cell_phone: '',
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
    this.user = await this.$axios.$get('/profiles/' + this.userId);
    let id = this.isAdmin ? this.userId : 'me'
    this.verifyState = await this.$axios.$get('/profiles/' + id + '/verifies');
  },
  methods: {
    async send() {
      this.dialog.send = false
      this.l.send = true
      await this.$axios.$put('/profiles/' + this.userId, this.user)
      this.l.send = false
    },
    next() {
      if (this.stepNum === this.totalSteps) {
        this.dialog.send = true
      } else {
        this.stepNum++
        this.setBtnState()
      }
    },
    async prev() {
      if (this.stepNum === 1) {
        // await $router.push('/')
      } else {
        this.stepNum--
        this.setBtnState()
      }
    },
    setBtnState() {
      if (this.stepNum === this.totalSteps) {
        this.nextLabel = 'ارسال'
        this.prevLabel = 'قبلی'
      } else if (this.stepNum === 1) {
        this.nextLabel = 'بعدی'
        this.prevLabel = 'بازگشت'
      } else {
        this.nextLabel = 'بعدی'
        this.prevLabel = 'قبلی'
      }
    },


    async uploadSsn() {
      this.l.ssn = true
      const formData = new FormData();
      formData.append('ssn', this.ssn)
      await this.$axios.$post('/profiles/me/docs', formData, this.config)
      this.l.ssn = false
    },
    async uploadBill() {
      this.l.bill = true
      const formData = new FormData();
      formData.append('bill', this.bill)
      await this.$axios.$post('/profiles/me/docs', formData, this.config)
      this.l.bill = false
    },
    async uploadBankCard() {
      this.l.bankCard = true
      const formData = new FormData();
      formData.append('bank-card', this.bankCard)
      await this.$axios.$post('/profiles/me/docs', formData, this.config)
      this.l.bankCard = false
    },
    async submitMobileOtp() {
      this.l.mobileSubmit = true
      await this.$axios.$post('/otp-m/verify', {otp: this.mobile.otp})
      this.mobile.otp = ''
      this.l.mobileSubmit = false
    },
    async requestMobileOtp() {
      this.dialog.mobileOtp = true
      this.l.mobileRequest = true
      await this.$axios.$get('/otp-m')
      this.l.mobileRequest = false
    },
    async submitPhoneOtp() {
      this.l.phoneSubmit = true
      await this.$axios.$post('/otp-c/verify', {otp: this.phone.otp})
      this.phone.otp = ''
      this.l.phoneSubmit = false
    },
    async requestPhoneOtp() {
      this.dialog.phoneOtp = true
      this.l.phoneRequest = true
      await this.$axios.$get('/otp-c')
      this.l.phoneRequest = false
    },
  }
}
</script>

<style scoped>

</style>