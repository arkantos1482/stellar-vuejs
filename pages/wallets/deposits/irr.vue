<template>
  <div class="d-flex align-items-stretch mt-8">
    <a-card class="ml-4 py-8" width="30%" title="واریز">
      <crypto-upper :balance="balance" type="IRR"/>
      <a-text-field v-model="amount" filled label="مقدار ریال"/>
      <v-btn @click="onDeposit" :loading="l.deposit"
             block color="primary" class="mt-4">واریز
      </v-btn>
    </a-card>

    <a-card class="ml-4" width="70%">
      <deposits/>
    </a-card>
  </div>
</template>

<script>
import ps from '@/mixins/pstopper'
import Deposits from "@/pages/wallets/deposits/index";
import ACard from "@/components/ACard";
import ATextField from "@/components/ATextField";
import collect from "collect.js";
import CryptoUpper from "@/components/CryptoUpper";

export default {
  mixins: [ps],
  components: {CryptoUpper, Deposits, ACard, ATextField},
  data() {
    return {
      amount: '',
      link: '',
      balance: '',
      l: {deposit: false}
    }
  },
  async mounted() {
    let arrayedBalances = (await this.$axios.$get('/profiles/me/stellar')).balances
    let keyValuedBalances = collect(arrayedBalances)
        .map(item => ({[item.asset_code]: item.balance}))
        .reduce((_acc, item) => ({..._acc, ...item})) ?? []
    this.balance = keyValuedBalances.IRR
  },
  methods: {
    async onDeposit() {
      this.l.deposit = true
      this.link = await this.$axios.$post('/irr/deposit', {amount: this.amount})
      window.open(this.link, '_blank')
      this.l.deposit = false
    }
  }
}
</script>

<style scoped>

</style>