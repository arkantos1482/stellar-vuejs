<template>
  <v-row>
    <!--    BTC-->
    <v-col cols="4">
      <v-text-field v-model="btcActual" label="btc fee"/>
      <json-viewer dir="ltr" :value="btcRemote"/>
      <v-btn @click="btcUpdate" :loading="bLoading">update</v-btn>
      <v-text-field v-model="destAddress" label="حساب مقصد"/>
      <v-text-field v-model="amount" label="مقدار"/>
      <v-btn @click="getBtcSize" :loading="sLoading">Tx Size</v-btn>
      <p>{{ btcSize }}</p>
    </v-col>

    <!--    ETH-->
    <v-col cols="4">
      <v-text-field v-model="ethActual" label="eth fee"/>
      <json-viewer dir="ltr" :value="ethRemote"/>
      <v-btn @click="ethUpdate" :loading="eLoading">update</v-btn>
    </v-col>

    <!--    LTC-->
    <v-col cols="4">
      <v-text-field v-model="ltcActual" label="ltc fee"/>
      <json-viewer dir="ltr" :value="ltcRemote"/>
      <v-btn @click="ltcUpdate" :loading="lLoading">update</v-btn>
    </v-col>
  </v-row>
</template>

<script>

export default {
  data() {
    return {
      btcActual: '',
      btcRemote: '',
      bLoading: false,
      ethActual: '',
      ethRemote: '',
      eLoading: false,
      ltcActual: '',
      ltcRemote: '',
      lLoading: false,
      sLoading: false,
      btcSize: '',
      destAddress: '',
      amount: '',
    }
  },
  async fetch() {
    let btc = await this.$axios.$get('crypto/btc/fee');
    this.btcActual = btc.actual
    this.btcRemote = btc.remote
    let eth = await this.$axios.$get('crypto/eth/fee');
    this.ethActual = eth.actual
    this.ethRemote = eth.remote
    let ltc = await this.$axios.$get('crypto/ltc/fee');
    this.ltcActual = ltc.actual
    this.ltcRemote = ltc.remote
  },
  methods: {
    async btcUpdate() {
      this.bLoading = true
      this.btcActual = (await this.$axios.$post('crypto/btc/fee/update', {fee: this.btcActual}))
      this.bLoading = false
    },
    async getBtcSize() {
      this.sLoading = true
      this.btcSize = await this.$axios.$post(`/crypto/btc/fee/size`, {
        to: this.destAddress,
        amount: this.amount
      })
      this.sLoading = false
    },
    async ethUpdate() {
      this.eLoading = true
      this.ethActual = (await this.$axios.$post('crypto/eth/fee/update', {fee: this.ethActual}))
      this.eLoading = false
    },
    async ltcUpdate() {
      this.lLoading = true
      this.ltcActual = (await this.$axios.$post('crypto/ltc/fee/update', {fee: this.ltcActual}))
      this.lLoading = false
    },
  }
}
</script>

