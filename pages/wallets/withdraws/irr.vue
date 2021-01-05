<template>
  <div class="d-flex align-items-stretch mt-12">

    <a-card class="ml-4 py-8" width="45%" title="برداشت">
      <crypto-upper :balance="balance" :type="type"/>
      <p class="text-display-2 ma-0">
        باقی مانده برداشت روزانه:<span class="font-weight-medium">&nbsp{{ daily_rem_usage }}</span>
      </p>
      <p class="text-display-2 ma-0">باقی مانده برداشت ماهیانه:
        <span class="font-weight-medium">&nbsp{{ monthly_rem_usage }}</span>
      </p>

      <a-text-field v-model="amount" label="مبلغ"/>
      <v-btn @click="onWithdraw" :loading="l.withdraw"
             block color="primary" class="mt-4">برداشت
      </v-btn>
    </a-card>

    <withdraws/>
  </div>
</template>

<script>
import ps from '@/mixins/pstopper'
import Withdraws from "@/pages/wallets/withdraws/index";
import ACard from "@/components/ACard";
import ATextField from "@/components/ATextField";
import CryptoUpper from "@/components/CryptoUpper";

export default {
  mixins: [ps],
  components: {CryptoUpper, Withdraws, ACard, ATextField},
  computed: {
    balance() {
      return this.$store.state.balances.list[this.type]
    }
  },
  data() {
    return {
      type: 'IRR',
      daily_rem_usage: 0,
      monthly_rem_usage: 0,
      amount: '',
      l: {withdraw: false}
    }
  },
  mounted() {
    this.$store.dispatch('balances/refresh')
    this.$store.dispatch('addresses/refresh')
    this.$axios.$post('/access/limits/remained', {resource: 'irr'})
        .then(res => {
          this.daily_rem_usage = (res.daily_rem_usage !== -1) ? res.daily_rem_usage + 'ریال' : 'نامحدود'
          this.monthly_rem_usage = (res.monthly_rem_usage !== -1) ? res.monthly_rem_usage + 'ریال' : 'نامحدود'
        })
  },
  methods: {
    async onWithdraw() {
      if (this.balance >= parseFloat(this.amount)) {
        try {
          this.l.withdraw = true
          await this.$axios.$post('/irr/withdraw', {amount: this.amount})

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