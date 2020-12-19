<template>
  <div class="d-flex align-items-stretch mt-8">
    <a-card class="ml-4" width="30%" title="واریز">
      <a-text-field readonly v-model="type" label="نوع ارز"
                    class="mt-8"/>
      <a-text-field readonly :value="parseFloat(balance)" label="موجودی"/>

      <div class="mt-12 text-center" v-if="address">
        <vue-qrcode :value="address"/>
        <p>{{ address }}</p>
      </div>
      <v-btn v-else @click="createCrypto" :loading="l.create"
             class="mt-16 mb-8" block color="primary">ایجاد
      </v-btn>
    </a-card>

    <a-card class="ml-4" width="70%">
      <deposits/>
    </a-card>
  </div>
</template>

<script>
import collect from "collect.js";
import VueQrcode from 'vue-qrcode'
import ACard from "@/components/ACard";
import Deposits from "@/pages/wallets/deposits/index";
import ATextField from "@/components/ATextField";
import pstopper from "@/mixins/pstopper";

export default {
  mixins: [pstopper],
  components: {Deposits, VueQrcode, ACard, ATextField},
  data() {
    return {
      type: this.$route.params.type.toUpperCase(),
      address: '',
      balance: '',
      l: {create: false}
    }
  },
  async mounted() {
    let arrayedAddress = await this.$axios.$get('/profiles/me/addresses')
    let keyValuedAddress = collect(arrayedAddress)
        .map(item => ({[item.type]: item.address}))
        .reduce((_acc, item) => ({..._acc, ...item})) ?? []
    this.address = keyValuedAddress[this.type]

    let arrayedBalances = (await this.$axios.$get('/profiles/me/stellar')).balances
    let keyValuedBalances = collect(arrayedBalances)
        .map(item => ({[item.asset_code]: item.balance}))
        .reduce((_acc, item) => ({..._acc, ...item})) ?? []
    this.balance = keyValuedBalances[this.type]
  },
  methods: {
    async createCrypto() {
      this.l.create = true
      this.address = await this.$axios.$post('/crypto/' + this.type.toLowerCase() + '/address/create')
      this.l.create = false
    }
  }
}
</script>

<style scoped>

</style>