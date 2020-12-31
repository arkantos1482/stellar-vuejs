<template>
  <div class="d-flex align-items-stretch mt-8">
    <a-card class="ml-4 py-8" width="30%" title="واریز">
      <crypto-upper :balance="balance" :type="type"/>
      <a-text-field v-model="amount" filled label="مقدار ریال"/>
      <v-btn @click="onDeposit" :loading="l.deposit"
             block color="primary" class="mt-4">واریز
      </v-btn>
    </a-card>

    <deposits/>
  </div>
</template>

<script>
import ps from '@/mixins/pstopper'
import Deposits from "@/pages/wallets/deposits/index";
import ACard from "@/components/ACard";
import ATextField from "@/components/ATextField";
import CryptoUpper from "@/components/CryptoUpper";

export default {
  mixins: [ps],
  components: {CryptoUpper, Deposits, ACard, ATextField},
  computed: {
    balance() {
      return this.$store.state.balances.list[this.type]
    }
  },
  data() {
    return {
      type: 'IRR',
      amount: '',
      link: '',
      l: {deposit: false}
    }
  },
  mounted() {
    this.$store.dispatch('balances/refresh')
    this.$store.dispatch('addresses/refresh')
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