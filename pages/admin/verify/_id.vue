<template>
  <v-row justify="center">
    <v-col cols="9">
      <v-carousel >
        <v-carousel-item contain :src="docs.ssn"/>
        <v-carousel-item contain :src="docs.bill"/>
        <v-carousel-item contain :src="docs.bank_card"/>
      </v-carousel>

      <h2 class="mt-8">مشخصات استعلامی</h2>
      <v-simple-table>
        <thead>
        <tr>
          <th>موضوع</th>
          <th>پاسخ</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td><h2>کدپستی</h2></td>
        </tr>
        <tr>
          <td>آدرس</td>
          <td>{{ kyc.postal_code.address }}</td>
        </tr>

        <tr>
          <td><h2>کارت بانکی</h2></td>
        </tr>
        <tr>
          <td>نام و نام خانوادگی</td>
          <td>{{ kyc.bank_card.firstName + ' ' + kyc.bank_card.lastName }}</td>
        </tr>
        <tr>
          <td>نام بانک</td>
          <td>{{ kyc.bank_card.bank }}</td>
        </tr>
        <tr>
          <td>شبا</td>
          <td>{{ kyc.bank_card.iban }}</td>
        </tr>
        <tr>
          <td>شماره حساب</td>
          <td>{{ kyc.bank_card.accountNumber }}</td>
        </tr>

        <tr>
          <td><h2>شبا</h2></td>
        </tr>
        <tr>
          <td>نام و نام خانوادگی</td>
          <td>{{ kyc.bank_shaba.firstName + ' ' + kyc.bank_shaba.lastName }}</td>
        </tr>
        <tr>
          <td>نام بانک</td>
          <td>{{ kyc.bank_shaba.bank }}</td>
        </tr>
        <tr>
          <td>شبا</td>
          <td>{{ kyc.bank_shaba.iban }}</td>
        </tr>
        <tr>
          <td>شماره حساب</td>
          <td>{{ kyc.bank_shaba.accountNumber }}</td>
        </tr>

        <tr>
          <td><h2>سایر</h2></td>
        </tr>
        <tr>
          <td>تطابق موبایل و کدملی</td>
          <td>{{ kyc.match_ssn_mobile.matched }}</td>
        </tr>
        </tbody>
      </v-simple-table>

      <h1 class="mt-16">تایید مدارک</h1>
      <v-row>
        <v-col cols="4">
          <h3>اطلاعات شخصی</h3>
          <v-switch label="ایمیل" v-model="state.email"/>
          <v-switch label="موبایل" v-model="state.cell_phone"/>
          <v-switch label="کارت ملی" v-model="state.ssn"/>
          <v-switch label="تصویر هویت" v-model="state.bank_account"/>
        </v-col>

        <v-col cols="4">
          <h3>اطلاعات تکمیلی</h3>
          <v-switch label="تلفن ثابت" v-model="state.phone"/>
          <v-switch label="آدرس" v-model="state.address"/>
        </v-col>

        <v-col cols="4">
          <h3>اطلاعات مالی</h3>
          <v-switch label="شماره کارت" v-model="state.bank_card"/>
          <v-switch label="شبا" v-model="state.bank_shaba"/>
        </v-col>
      </v-row>

      <div class="text-center">
        <v-btn @click="apply" :loading="l.apply" color="red">اعمال تغییر</v-btn>
        <v-btn @click="$router.back()">بازگشت</v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import ps from '@/mixins/pstopper'

export default {
  mixins: [ps],
  data() {
    return {
      l: {apply: false},
      kyc: {
        bank_card: '',
        bank_shaba: '',
        postal_code: '',
        match_ssn_mobile: '',
      },
      state: {
        email: false,
        cell_phone: false,
        phone: false,
        ssn: false,
        address: false,
        bank_card: false,
        bank_shaba: false,
        bank_account: false
      },
      userId: this.$route.params.id,
      docs: {ssn: '', bill: '', bank_card: ''},
      verifyList: []
    }
  },
  async mounted() {
    this.$axios.$get('/profiles/' + this.userId + '/verifies')
        .then(res => this.state = res)

    this.$axios.$get('/kyc/' + this.userId + '/postal-code')
        .then(res => this.kyc.postal_code = res)
    this.$axios.$get('/kyc/' + this.userId + '/bank-card')
        .then(res => this.kyc.bank_card = res)
    this.$axios.$get('/kyc/' + this.userId + '/bank-shaba')
        .then(res => this.kyc.bank_shaba = res)
    this.$axios.$get('/kyc/' + this.userId + '/match-ssn-mobile')
        .then(res => this.kyc.match_ssn_mobile = res)

    this.$axios.$get('/profiles/' + this.userId + '/docs/ssn')
        .then(res => this.docs.ssn = res)
    this.$axios.$get('/profiles/' + this.userId + '/docs/bill')
        .then(res => this.docs.bill = res)
    this.$axios.$get('/profiles/' + this.userId + '/docs/bank-card')
        .then(res => this.docs.bank_card = res)
  },
  methods: {
    async apply() {
      this.l.apply = true
      await this.$axios.$put('/profiles/' + this.userId + '/verifies', this.state)
      this.l.apply = false
    }
  }
}
</script>

<style scoped>

</style>

