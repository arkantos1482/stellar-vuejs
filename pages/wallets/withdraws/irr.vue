<template>
  <a-row class="align-stretch mt-12">
    <v-col cols="4" class="pa-4 d-flex flex-column">
      <div class="text-h4 mb-6 text-right">برداشت</div>
      <v-card class="px-16 py-12 flex-grow-1" width="100%">
        <crypto-upper :balance="balance" :type="type" @balanceClick="onBalanceClicked"/>
        <p class="text-display-2 ma-0">
          باقی مانده برداشت روزانه:<span class="font-weight-medium">&nbsp{{ daily_rem_usage }}</span>
        </p>
        <p class="text-display-2 ma-0">باقی مانده برداشت ماهیانه:
          <span class="font-weight-medium">&nbsp{{ monthly_rem_usage }}</span>
        </p>

        <v-form @submit.prevent="onWithdraw" v-model="form" ref="form">
          <a-text-field separated :rules="[rules.required]"
                        mask="####################" v-model="amount" label="مبلغ"/>
          <v-btn type="submit" :loading="l.withdraw"
                 block color="primary" class="mt-4">برداشت
          </v-btn>
        </v-form>
      </v-card>
    </v-col>

    <v-col cols="8" class="pa-0">
      <withdraws :type="type"/>
    </v-col>
  </a-row>
</template>

<script>
import ps from '@/mixins/pstopper'
import Withdraws from "@/pages/wallets/withdraws/index";
import ACard from "@/components/ACard";
import ATextField from "@/components/ATextField";
import CryptoUpper from "@/components/CryptoUpper";
import {toSeparated} from "@/models/NumberUtil";

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
      form: false,
      l: {withdraw: false},
      rules: {
        required: value => !!value || 'الزامی است',
      },
    }
  },
  mounted() {
    this.$store.dispatch('balances/refresh')
    this.$store.dispatch('addresses/refresh')
    this.$axios.$post('/access/limits/remained', {resource: 'irr'})
        .then(res => {
          this.daily_rem_usage = (res.daily_rem_usage !== -1) ? toSeparated(res.daily_rem_usage) + 'تومان' : 'نامحدود'
          this.monthly_rem_usage = (res.monthly_rem_usage !== -1) ? toSeparated(res.monthly_rem_usage) + 'تومان' : 'نامحدود'
        })
  },
  methods: {
    async onWithdraw() {
      this.$refs.form.validate()
      if (this.form) {
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
      }
    },
    onBalanceClicked(event) {
      this.amount = event
    }
  }
}
</script>

<style scoped>

</style>