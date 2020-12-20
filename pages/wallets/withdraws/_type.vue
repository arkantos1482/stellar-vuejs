<template>
  <div class="d-flex align-items-stretch mt-8">

    <a-card class="ml-4 py-8" width="30%" title="برداشت">
      <crypto-upper :balance="balance" :type="type"/>

      <a-text-field v-model="amount" label="مبلغ"/>
      <a-text-field v-model="destAddress" label="آدرس کیف پول مقصد"/>
      <p class="mt-4 grey--text"> کارمزد تراکنش <span class="black--text">{{ withdrawFee }}</span> است.</p>
      <v-btn @click="withdraw" :loading="l.withdraw"
             block color="primary" class="mt-4">تایید
      </v-btn>
    </a-card>

    <a-card class="ml-4" width="70%">
      <withdraws/>
    </a-card>
  </div>
</template>

<script>
import Withdraws from "@/pages/wallets/withdraws/index";
import ACard from "@/components/ACard";
import ATextField from "@/components/ATextField";
import collect from "collect.js";
import pstopper from "@/mixins/pstopper";
import CryptoUpper from "@/components/CryptoUpper";

export default {
  mixins: [pstopper],
  components: {CryptoUpper, Withdraws, ACard, ATextField},
  data() {
    return {
      type: this.$route.params.type.toUpperCase(),
      balance: '',
      destAddress: '',
      amount: '',
      withdrawFee: '',
      l: {withdraw: false}
    }
  },
  async mounted() {
    let arrayedBalances = (await this.$axios.$get('/profiles/me/stellar')).balances
    let keyValuedBalances = collect(arrayedBalances)
        .map(item => ({[item.asset_code]: item.balance}))
        .reduce((_acc, item) => ({..._acc, ...item})) ?? []
    this.balance = keyValuedBalances[this.type]

    this.$axios.$get('/crypto/fees/' + this.type.toLowerCase())
        .then(res => this.withdrawFee = res);
  },
  methods: {
    async withdraw() {
      if (this.balance >= (this.amount + this.withdrawFee)) {
        console.log((this.balance >= (this.amount + this.withdrawFee)))
        console.log((this.amount + this.withdrawFee))
        console.log(this.balance)
        try {
          this.l.withdraw = true
          await this.$axios.$post(`/crypto/${this.type.toLowerCase()}/withdraw`, {
            to: this.destAddress,
            amount: this.amount
          })

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