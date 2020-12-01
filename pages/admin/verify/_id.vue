<template>
  <v-row justify="center">
    <v-col cols="9">
      <v-carousel cycle height="400">
        <v-carousel-item :src="docs.ssn"/>
        <v-carousel-item :src="docs.bill"/>
      </v-carousel>


      <h1 class="mt-16">تایید مدارک</h1>
      <v-row>
        <v-col cols="4">
          <h3>اطلاعات شخصی</h3>
          <v-switch label="ایمیل" v-model="state.email"/>
          <v-switch label="موبایل" v-model="state.cell_phone"/>
          <v-switch label="کارت ملی" v-model="state.ssn"/>
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
          <v-switch label="شماره حساب" v-model="state.bank_account"/>
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
export default {
  data() {
    return {
      l: {apply: false},
      state: {
        email: true,
        cell_phone: false,
        phone: false,
        ssn: false,
        address: false,
        bank_card: false,
        bank_shaba: false,
        bank_account: false
      },
      userId: this.$route.params.id,
      docs: {ssn: '', bill: ''},
      verifyList: []
    }
  },
  async mounted() {
    this.state = await this.$axios.$get('/profiles/' + this.userId + '/verifies')
    this.docs.ssn = await this.$axios.$get('/profiles/' + this.userId + '/docs/ssn')
    this.docs.bill = await this.$axios.$get('/profiles/' + this.userId + '/docs/bill')
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

