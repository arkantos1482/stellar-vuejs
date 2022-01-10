<template>
  <div class="text-center my-8">
    <v-row justify="center">
      <v-btn :href="trade_link">دریافت تمام معاملات</v-btn>
    </v-row>

    <v-divider class="my-8"/>

    <v-row justify="center" align="baseline">
      <v-col cols="3">
        <v-select filled hint="فیلتر" v-model="payment_filter" :items="payment_filter_list"/>
      </v-col>
      <v-col cols="2">
        <v-btn :href="payment_link">دریافت تمام پرداخت ها</v-btn>
      </v-col>
    </v-row>

    <v-divider class="mb-8"/>

    <v-row justify="center">
      <v-btn :href="trade_accounting_link">گزارش معاملات حسابداری</v-btn>
    </v-row>

    <v-divider class="my-8"/>

    <v-row justify="center" align="baseline">
      <v-col cols="4">
        <v-btn :href="all_trade_bills_link">دریافت همه صورت حساب ها</v-btn>
      </v-col>
      <v-col cols="4">
        <v-text-field filled label="شناسه کاربر" v-model="user_id"/>
        <v-btn :href="user_trade_bills_link">دریافت صورت حساب فردی</v-btn>
      </v-col>
    </v-row>

  </div>
</template>

<script>
export default {
  name: "trades",
  computed: {
    payment_filter_list: () => ['trade_fee', 'referral', 'deposit', 'withdraw'],
    trade_link() {
      return this.$axios.defaults.baseURL + '/trades/all/export'
    },
    trade_accounting_link() {
      return this.$axios.defaults.baseURL + '/trades/accounting/all/export'
    },
    all_trade_bills_link() {
      return this.$axios.defaults.baseURL + '/trade-fee-bills'
    },
    user_trade_bills_link() {
      return this.$axios.defaults.baseURL + '/trade-fee-bills/' + this.user_id
    },
    payment_link() {
      return this.$axios.defaults.baseURL + '/payments/all/export?filter=' + this.payment_filter
    }
  },
  data() {
    return {
      payment_filter: 'withdraw',
      user_id: ''
    }
  }

}
</script>

<style scoped>

</style>