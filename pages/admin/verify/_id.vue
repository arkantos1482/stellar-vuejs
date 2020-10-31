<template>
  <v-row justify="center">
    <v-col cols="9">
      <p>hello {{ userId }}</p>
      <v-carousel cycle height="400">
        <v-carousel-item :src="docs.ssn"/>
        <v-carousel-item :src="docs.bill"/>
      </v-carousel>
      <h1 class="mt-8">تایید مدارک</h1>
      <v-row>
        <v-switch label="موبایل" v-model="state.cell_phone"/>
        <v-switch label="کارت ملی" v-model="state.ssn"/>
        <v-switch label="آدرس" v-model="state.address"/>
        <v-switch label="حساب بانکی" v-model="state.bank_account"/>
      </v-row>
      <v-btn @click="apply" :loading="l.apply" color="red">اعمال تغییر</v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      l: {apply: false},
      state: {cell_phone: false, ssn: false, address: false, bank_account: false},
      userId: this.$route.params.id,
      docs: {ssn: '', bill: ''},
      verifyList: []
    }
  },
  async fetch() {
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

