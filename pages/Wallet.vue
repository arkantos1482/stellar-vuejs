<template>
  <div>
    <json-viewer dir="auto" :value="refreshResult"/>
    <v-btn @click="refreshDeposits" class="mt-2">refresh ltc</v-btn>

    <v-row>
      <v-col cols="6">
        <h3> stellar account</h3>
        <p>{{ stellarAccount.time }}</p>
        <json-viewer dir="auto" :value="stellarAccount.balances"/>
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
      refreshResult: ''
    }
  },
  async mounted() {
    let res = await this.$axios.$get('/profiles/stellar');
    this.stellarAccount = {time: res.last_modified_time, balances: res.balances}
    this.ltcAccount = await this.$axios.$get('/crypto/ltc/txs/basic')

  }, methods: {
    async refreshDeposits() {
      this.refreshResult = await this.$axios.$get('/crypto/ltc/refresh')
    }
  }
}
</script>

<style scoped>

</style>