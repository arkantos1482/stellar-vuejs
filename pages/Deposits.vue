<template>
  <v-row>
    <v-col cols="6">
      <json-viewer :value="deposits" dir="ltr"/>
    </v-col>

    <v-col cols="6">
      <h3> crypto LTC transactions</h3>
      <json-viewer dir="auto" :value="ltcTxs"/>
    </v-col>
  </v-row>
</template>

<script>
import collect from "collect.js";

export default {
  name: "Deposits",
  data() {
    return {
      deposits: [],
      ltcTxs: '',
    }
  },
  async mounted() {
    let list = (await this.$axios.$get('/effects'))._embedded.records;
    this.deposits = collect(list).filter(item => item.type === 'account_credited').all();
    try {
      this.ltcTxs = await this.$axios.$get('/crypto/ltc/txs/basic')
    } catch (e) {
      this.ltcTxs = 'حساب ltc ایجاد نشده است.'
    }
  }
}
</script>

<style scoped>

</style>