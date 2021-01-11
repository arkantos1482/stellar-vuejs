<template>
  <div class="d-flex align-items-stretch">
    <a-card class="ml-4" width="45%" :title="actionTitle">
      <crypto-upper :balance="balance" :type="type"/>
      <p class="text-display-2 ma-0">
        باقی مانده برداشت روزانه:<span class="font-weight-medium">&nbsp{{ daily_rem_usage }}</span>
      </p>
      <p class="text-display-2 ma-0">باقی مانده برداشت ماهیانه:
        <span class="font-weight-medium">&nbsp{{ monthly_rem_usage }}</span>
      </p>

      <v-form @submit.prevent="withdraw" v-model="form" ref="form">
        <a-text-field :rules="[rules.required]" :mask="mask" v-model="amount" label="مبلغ"/>
        <a-text-field :rules="[rules.required]" v-model="destAddress" label="آدرس کیف پول مقصد"/>
        <p class="mt-4 grey--text"> کارمزد تراکنش <span class="black--text">{{ withdrawFee }}</span> است.</p>
        <v-btn type="submit" :loading="l.withdraw"
               block color="primary" class="mt-4">{{ actionTitle }}
        </v-btn>
      </v-form>
    </a-card>

    <withdraws :type="type" :title="listTitle"/>
  </div>
</template>

<script>
import Withdraws from "@/pages/wallets/withdraws/index";
import ACard from "@/components/ACard";
import ATextField from "@/components/ATextField";
import pstopper from "@/mixins/pstopper";
import CryptoUpper from "@/components/CryptoUpper";
import {toSeparated} from "@/models/NumberUtil";

export default {
  mixins: [pstopper],
  components: {CryptoUpper, Withdraws, ACard, ATextField},
  computed: {
    balance() {
      return this.$store.state.balances.list[this.type]
    },
    actionTitle() {
      return ('AMN' === this.type || 'EBG' === this.type) ? 'ارسال' : 'برداشت'
    },
    listTitle() {
      return ('AMN' === this.type || 'EBG' === this.type) ? 'لیست ارسال ها' : 'لیست برداشت ها'
    },
    mask() {
      return ('AMN' === this.type || 'EBG' === this.type) ? '###############' : ''
    }
  },
  data() {
    return {
      type: this.$route.params.type.toUpperCase(),
      daily_rem_usage: 0,
      monthly_rem_usage: 0,
      destAddress: '',
      amount: '',
      withdrawFee: '',
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
    this.$axios.$get('/crypto/fees/' + this.type.toLowerCase())
        .then(res => this.withdrawFee = res);
    this.$axios.$post('/access/limits/remained', {resource: 'crypto'})
        .then(res => {
          this.daily_rem_usage = (res.daily_rem_usage !== -1) ? toSeparated(res.daily_rem_usage) + 'ریال' : 'نامحدود'
          this.monthly_rem_usage = (res.monthly_rem_usage !== -1) ? toSeparated(res.monthly_rem_usage) + 'ریال' : 'نامحدود'
        })
  },
  methods: {
    async withdraw() {
      this.$refs.form.validate()
      if (this.form) {
        if (this.balance >= parseFloat(this.amount) + parseFloat(this.withdrawFee)) {
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
      }
    },
  }
}
</script>

<style scoped>

</style>