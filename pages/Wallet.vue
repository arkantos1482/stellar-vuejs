<template>
  <div>
    <h3 class="text-center"> stellar account</h3>
    <!--    <p>{{ stellarAccount.time }}</p>-->
    <json-viewer dir="auto" :value="stellarAccount.balances"/>

    <v-row class="mt-4">
      <v-col cols="6">
        <json-viewer dir="auto" :value="refreshResult"/>
        <v-btn @click="refreshDeposits" :loading="loading" class="mt-2">refresh ltc</v-btn>
      </v-col>
      <v-col cols="6">
        <h3> crypto LTC account</h3>
        <json-viewer dir="auto" :value="ltcAccount"/>
      </v-col>
    </v-row>

  </div>
</template>

<script>

export default {
  name: "Wallet",
  data() {
    return {
      stellarAccount: '',
      ltcAccount: '',
      refreshResult: '',
      loading: false
    }
  },
  async mounted() {
    let res = await this.$axios.$get('/profiles/stellar');
    this.stellarAccount = {time: res.last_modified_time, balances: res.balances}
    try {
      this.ltcAccount = await this.$axios.$get('/crypto/ltc/address')
    } catch (e) {
      this.ltcAccount = 'حساب ltc ایجاد نشده است.'
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