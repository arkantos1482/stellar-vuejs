<template>
  <a-row class="align-stretch">
    <v-col cols="4" class="pa-4 d-flex flex-column">
      <div class="text-h4 mb-6 text-right">برداشت</div>
      <v-card class="px-16 py-12 flex-grow-1" width="100%">
        <crypto-upper :balance="balance" :type="type" @balanceClick="onBalanceClicked"/>
        <p class="text-display-2 mt-8 mb-0">
          باقی مانده برداشت روزانه:<span class="font-weight-medium">&nbsp{{ daily_rem_usage }}</span>
        </p>
        <p class="text-display-2 mb-0">باقی مانده برداشت ماهیانه:
          <span class="font-weight-medium">&nbsp{{ monthly_rem_usage }}</span>
        </p>

        <v-form class="mt-8" @submit.prevent="onWithdraw" v-model="form" ref="form">
          <div class="text-left">
            <v-btn class="mb-n14" text color="primary" @click="onMaxClicked">Max</v-btn>
          </div>

          <a-text-field separated :rules="[rules.required]"
                        is-coin coin="IRR" v-model="amount" label="مبلغ"/>
          <p class="mt-1 grey--text"> کارمزد تراکنش
            <span class="white--text">{{ withdrawFee }}</span> می باشد.</p>
          <p class="mt-n4 grey--text"> مقدار خالص برداشت
            <span class="white--text">{{ actualAmount }}</span> می باشد.</p>

          <p class="grey--text mt-2 mb-1 text-body-2">شبا</p>
          <v-select dense outlined flat :items="shabaList" v-model="shaba">
            <template v-slot:no-data>شبا وارد نشده است.</template>
          </v-select>

          <v-btn type="submit" :loading="l.withdraw"
                 block color="primary" class="my-4">برداشت
          </v-btn>
          <v-btn block color="primary" outlined @click="$router.back()">بازگشت</v-btn>
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
import CryptoUpper from "@/components/wallet/CryptoUpper";
import {safeDecimal, toSeparated} from "@/models/NumberUtil";
import {getDp} from "@/models/cryptoPrecision";

export default {
  mixins: [ps],
  components: {CryptoUpper, Withdraws, ACard, ATextField},
  computed: {
    balance() {
      return this.$store.state.balances.list[this.type]?.actual_balance
    },
    actualAmount() {
      let amount = safeDecimal(this.amount - this.withdrawFee).todp(getDp(this.type))
      return amount > 0 ? amount : 0
    }
  },
  data() {
    return {
      type: 'IRR',
      daily_rem_usage: 0,
      monthly_rem_usage: 0,
      amount: '',
      withdrawFee: '',
      shaba: '',
      shabaList: [],
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
    this.getFee()
    this.$axios.$post('/access/limits/remained', {resource: 'irr'})
        .then(res => {
          this.daily_rem_usage = (res.daily_rem_usage !== -1) ? toSeparated(res.daily_rem_usage) + 'تومان' : 'نامحدود'
          this.monthly_rem_usage = (res.monthly_rem_usage !== -1) ? toSeparated(res.monthly_rem_usage) + 'تومان' : 'نامحدود'
        })

    // make shaba list
    let shaba = this.$store.state.auth.profile.bank_shaba
    if (shaba) this.shabaList.push(shaba)
    let shaba2 = this.$store.state.auth.profile.bank_shaba_2
    if (shaba2) this.shabaList.push(shaba2)

    this.shaba = shaba
  },
  methods: {
    async onWithdraw() {
      this.$refs.form.validate()
      if (this.form) {
        if (this.balance >= parseFloat(this.amount)) {
          try {
            this.l.withdraw = true
            await this.$axios.$post('/irr/withdraw', {amount: this.amount, shaba: this.shaba})

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
    getFee() {
      this.$axios.$get('/crypto/fees/' + this.type.toLowerCase())
          .then(res => this.withdrawFee = res);
    },
    onBalanceClicked(event) {
      this.amount = safeDecimal(event).todp(getDp(this.type))
    },
    onMaxClicked() {
      this.amount = safeDecimal(this.balance).todp(getDp(this.type))
    },
  }
}
</script>

<style scoped>

</style>