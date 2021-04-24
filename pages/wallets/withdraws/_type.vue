<template>
  <a-row class="align-stretch">
    <v-col cols="4" class="pa-4 d-flex flex-column">
      <div class="text-h4 mb-6 text-right">{{ actionTitle }}</div>
      <v-card class="px-16 py-12 flex-grow-1" width="100%">
        <crypto-upper :balance="balance" :type="type" @balanceClick="onBalanceClicked"/>
        <p class="text-display-2 ma-0">
          باقی مانده برداشت روزانه:<span class="font-weight-medium">&nbsp{{ daily_rem_usage }}</span>
        </p>
        <p class="text-display-2 ma-0">باقی مانده برداشت ماهیانه:
          <span class="font-weight-medium">&nbsp{{ monthly_rem_usage }}</span>
        </p>

        <v-form @submit.prevent="withdraw" v-model="form" ref="form">
          <a-text-field separated :rules="[rules.required]" :mask="mask" v-model="amount" label="مقدار"/>
          <p class="mt-1 grey--text"> کارمزد تراکنش <span class="white--text">{{ withdrawFee }}</span> می باشد.</p>
          <p class="mt-n4 grey--text"> مقدار خالص برداشت <span class="white--text">{{ actualAmount }}</span> می باشد.
          </p>
          <a-text-field :rules="[rules.required]" v-model="destAddress" label="آدرس کیف پول مقصد"/>
          <p class="ma-0 text-display-2 error--text">وارد کردن آدرس اشتباه منجر به از دست رفتن منابع مالی شما خواهد
            شد.</p>
          <v-btn type="submit" :loading="l.withdraw"
                 block color="primary" class="mt-4">{{ actionTitle }}
          </v-btn>
        </v-form>
      </v-card>
    </v-col>


    <v-col cols="8" class="pa-0">
      <withdraws :type="type" :title="listTitle"/>
    </v-col>
  </a-row>
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
      return this.$store.state.balances.list[this.type]?.actual_balance
    },
    actionTitle() {
      return this.isInternal() ? 'ارسال' : 'برداشت'
    },
    listTitle() {
      return this.isInternal() ? 'لیست ارسال ها' : 'لیست برداشت ها'
    },
    mask() {
      return this.isInternal() ? '###############' : ''
    },
    actualAmount() {
      let amount = this.amount - this.withdrawFee;
      return amount > 0 ? amount : 0
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
          this.daily_rem_usage = (res.daily_rem_usage !== -1) ? toSeparated(res.daily_rem_usage) + 'تومان' : 'نامحدود'
          this.monthly_rem_usage = (res.monthly_rem_usage !== -1) ? toSeparated(res.monthly_rem_usage) + 'تومان' : 'نامحدود'
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
    onBalanceClicked(event) {
      this.amount = event
    },
    isInternal() {
      return ['AMN', 'EBG', 'SHA', 'ART', 'ZRK'].includes(this.type)
    }
  }
}
</script>

<style scoped>

</style>