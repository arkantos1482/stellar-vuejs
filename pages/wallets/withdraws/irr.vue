<template>
  <div class="d-flex align-items-stretch mt-12">

    <a-card class="ml-4 py-8" width="30%" title="برداشت">
      <crypto-upper :balance="balance" type="IRR"/>
      <a-text-field v-model="amount" label="مبلغ"/>
      <v-btn @click="onWithdraw" :loading="l.withdraw"
             block color="primary" class="mt-4">تایید
      </v-btn>
    </a-card>

    <a-card class="ml-4" width="70%">
      <withdraws/>
    </a-card>
  </div>
</template>

<script>
import ps from '@/mixins/pstopper'
import Withdraws from "@/pages/wallets/withdraws/index";
import ACard from "@/components/ACard";
import ATextField from "@/components/ATextField";
import collect from "collect.js";
import CryptoUpper from "@/components/CryptoUpper";

export default {
  mixins: [ps],
  components: {CryptoUpper, Withdraws, ACard, ATextField},
  data() {
    return {
      amount: '',
      balance: '',
      l: {withdraw: false}
    }
  },
  async mounted() {
    let arrayedBalances = (await this.$axios.$get('/profiles/me/stellar')).balances
    let keyValuedBalances = collect(arrayedBalances)
        .map(item => ({[item.asset_code]: item.balance}))
        .reduce((_acc, item) => ({..._acc, ...item})) ?? []
    this.balance = parseFloat(keyValuedBalances.IRR)
  },
  methods: {
    async onWithdraw() {
      if (this.balance >= parseFloat(this.amount)) {
        try {
          this.l.withdraw = true
          await this.$axios.$post('/irr/withdraw', {amount: this.amount, type: this.type})

          this.$router.back()
          this.$bus.$emit('snack', 'برداشت با موفقیت انجام شد.', 'success')
        } catch (e) {
          this.$bus.$emit('snack', e.response.data.error.msg, 'error')
        } finally {
          this.l.withdraw = false
        }
      } else {
        this.$bus.$emit('snack', 'موجودی کافی نیست.', 'normal')
      }
    },
  }
}
</script>

<style scoped>

</style>