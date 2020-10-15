<template>
  <div>

    <v-row class="justify-center text-center">
      <v-col cols="6">
        <v-text-field label="حساب مقصد"/>
        <v-btn :loading="wLoading">برداشت</v-btn>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="6">
        <h3 class="mt-8"> crypto LTC transactions</h3>
        <json-viewer dir="auto" :value="ltcTxs"/>
      </v-col>
      <v-col cols="6">
        <h3> crypto LTC account</h3>
        <json-viewer dir="auto" :value="ltcAccount"/>
      </v-col>
    </v-row>

    <json-viewer dir="auto" :value="refreshResult"/>
    <v-btn @click="refreshDeposits" :loading="rLoading" class="mt-2">refresh ltc</v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      wLoading: false,
      rLoading: false,
      stellarAccount: '',
      ltcAccount: '',
      ltcTxs: '',
      refreshResult: ''
    }
  },
  async fetch() {
    let res = await this.$axios.$get('/profiles/stellar');
    this.stellarAccount = {time: res.last_modified_time, balances: res.balances}
    try {
      this.ltcAccount = await this.$axios.$get('/crypto/ltc/address')
      this.ltcTxs = await this.$axios.$get('/crypto/ltc/txs/basic')
    } catch (e) {
      this.ltcAccount = 'حساب ltc ایجاد نشده است.'
      this.ltcTxs = 'حساب ltc ایجاد نشده است.'
    }
  }, methods: {
    async refreshDeposits() {
      this.loading = true
      this.refreshResult = await this.$axios.$get('/crypto/ltc/refresh')
      this.loading = false
    }
  }
}
</script>

<style scoped>

</style>