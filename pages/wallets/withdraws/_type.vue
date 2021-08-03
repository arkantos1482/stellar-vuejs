<template>
  <div class="mt-0">
    <v-alert v-if="type === 'USDT'"
             color="primary" class="text-display-2 px-12" colored-border border="left" elevation="2">
      <ul>
        <li>
          برای برداشت تتر بر روی شبکه ترون، کافیست آدرس TRC20 خود را در کادر آدرس کیف پول مقصد ثبت نمایید تا انتقال بر
          روی شبکه ترون انجام شود.
        </li>
        <li>
          برای برداشت تتر بر روی شبکه اتریوم، کافیست آدرس ERC20 خود را در کادر آدرس کیف پول مقصد ثبت نمایید تا انتقال بر
          روی شبکه اترویم انجام شود.
        </li>
      </ul>
    </v-alert>

    <a-row class="align-stretch">
      <v-col cols="4" class="pa-4 d-flex flex-column">
        <div class="text-h4 mb-6 text-right">{{ actionTitle }}</div>
        <v-card class="px-16 py-12 flex-grow-1" width="100%">

          <div v-if="type === 'USDT'" class="text-center mb-8">
            <v-btn-toggle mandatory dense color="primary" v-model="usdtSelector">
              <v-btn value="TRON">TRC20</v-btn>
              <v-btn value="ETHER">ERC20</v-btn>
            </v-btn-toggle>
          </div>

          <crypto-upper :balance="balance" :type="type" @balanceClick="onBalanceClicked"/>
          <p class="text-display-2 ma-0">
            باقی مانده برداشت روزانه:<span class="font-weight-medium">&nbsp{{ daily_rem_usage }}</span>
          </p>
          <p class="text-display-2 ma-0">باقی مانده برداشت ماهیانه:
            <span class="font-weight-medium">&nbsp{{ monthly_rem_usage }}</span>
          </p>

          <v-form @submit.prevent="showWithdrawDialog" v-model="form" ref="form">
            <div class="text-left">
              <v-btn class="mb-n14" text color="primary" @click="onMaxClicked">Max</v-btn>
            </div>
            <a-text-field separated :rules="[rules.required]"
                          is-coin :coin="type" v-model="amount" label="مقدار"/>
            <p class="mt-1 grey--text"> کارمزد تراکنش <span class="white--text">{{ withdrawFee }}</span> می باشد.</p>
            <p class="mt-n4 grey--text"> مقدار خالص برداشت <span class="white--text">{{ actualAmount }}</span> می باشد.
            </p>
            <a-text-field :rules="[rules.required]" v-model="destAddress" label="آدرس کیف پول مقصد"/>
            <p class="ma-0 text-display-2 error--text">وارد کردن آدرس اشتباه منجر به از دست رفتن منابع مالی شما خواهد
              شد.</p>
            <v-btn type="submit" :loading="l.withdraw"
                   block color="primary" class="my-4">{{ actionTitle }}
            </v-btn>
            <v-btn block color="primary" outlined @click="$router.back()">بازگشت</v-btn>

          </v-form>
        </v-card>
      </v-col>


      <v-col cols="8" class="pa-0">
        <withdraws :type="type" :title="listTitle"/>
      </v-col>
    </a-row>

    <v-dialog v-model="d.withdraw" width="520px">
      <v-card class="px-12 py-6 text-center">
        <p class="primary--text text-h4">اطمینان دارید؟</p>
        <p>با انجام این تراکنش مقدار</p>
        <p class="primary--text">{{ actualAmount + ' ' + type }}</p>
        <p>به شماره مقصد:</p>
        <p class="primary--text">{{ destAddress }}</p>
        <p>جا به جا خواهد شد. آیا از انجام این تراکنش اطمینان دارید؟</p>
        <div class="mt-8">
          <v-btn class="px-12 mx-2" color="primary" @click="withdraw">بله</v-btn>
          <v-btn class="px-12 mx-2" outlined color="primary" @click="d.withdraw=false">خیر</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Withdraws from "@/pages/wallets/withdraws/index";
import ACard from "@/components/ACard";
import ATextField from "@/components/ATextField";
import pstopper from "@/mixins/pstopper";
import CryptoUpper from "@/components/CryptoUpper";
import {safeDecimal, toSeparated} from "@/models/NumberUtil";
import {getDp} from "@/models/cryptoPrecision";

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
    actualAmount() {
      let amount = this.amount - this.withdrawFee;
      return amount > 0 ? amount : 0
    }
  },
  watch: {
    usdtSelector(val) {
      this.getFee()
    }
  },
  data() {
    return {
      type: this.$route.params.type.toUpperCase(),
      usdtSelector: 'TRON',
      daily_rem_usage: 0,
      monthly_rem_usage: 0,
      destAddress: '',
      amount: '',
      withdrawFee: '',
      form: false,
      l: {withdraw: false},
      d: {withdraw: false},
      rules: {
        required: value => !!value || 'الزامی است',
      },
    }
  },
  mounted() {
    this.$store.dispatch('balances/refresh')
    this.$store.dispatch('addresses/refresh')
    this.getFee()
    this.$axios.$post('/access/limits/remained', {resource: 'crypto'})
        .then(res => {
          this.daily_rem_usage = (res.daily_rem_usage !== -1) ? toSeparated(res.daily_rem_usage) + 'تومان' : 'نامحدود'
          this.monthly_rem_usage = (res.monthly_rem_usage !== -1) ? toSeparated(res.monthly_rem_usage) + 'تومان' : 'نامحدود'
        })
  },
  methods: {
    getFee() {
      this.$axios.$get('/crypto/fees/' + this.usdtTronFix(this.type).toLowerCase())
          .then(res => this.withdrawFee = res);
    },
    showWithdrawDialog() {
      this.$refs.form.validate()
      if (this.form) {
        if (this.balance >= parseFloat(this.amount) && this.amount > parseFloat(this.withdrawFee)) {
          this.d.withdraw = true
        } else {
          this.$bus.$emit('snack', 'موجودی کافی نیست.', 'normal')
        }
      }
    },
    async withdraw() {
      this.d.withdraw = false

      try {
        this.l.withdraw = true
        await this.$axios.$post(`/crypto/${this.usdtTronFix(this.type).toLowerCase()}/withdraw`, {
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
    },
    onBalanceClicked(event) {
      this.amount = safeDecimal(event).todp(getDp(this.type))
    },
    onMaxClicked() {
      this.amount = safeDecimal(this.balance).todp(getDp(this.type))
    },
    isInternal() {
      return ['AMN', 'EBG', 'SHA', 'ART', 'ZRK', 'TLS', 'WIT'].includes(this.type)
    },
    usdtTronFix(type) {
      return (type === 'USDT' && this.usdtSelector === 'TRON') ? 'USDT_TRON' : type
    }
  }
}
</script>

<style scoped>

</style>