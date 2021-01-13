<template>
  <div class="d-flex align-items-stretch mt-8">
    <a-card class="ml-4 py-8" width="45%" title="واریز">
      <crypto-upper :balance="balance" :type="type"/>
      <p class="text-display-2 ma-0">
        باقی مانده واریز روزانه:<span class="font-weight-medium">&nbsp{{ daily_rem_usage }}</span>
      </p>
      <p class="text-display-2 ma-0">باقی مانده واریز ماهیانه:
        <span class="font-weight-medium">&nbsp{{ monthly_rem_usage }}</span>
      </p>

      <v-form class="mt-12" @submit.prevent="onDeposit" v-model="v.deposit" ref="form">
        <a-text-field mask="####################"
                      :rules="[rules.required,rules.moreThanBillion]"
                      hint="حداقل میزان واریز ۱میلیون ریال می باشد." v-model="amount" filled label="مقدار ریال"/>
        <v-btn type="submit" :loading="l.deposit"
               block color="primary" class="mt-4">واریز
        </v-btn>
      </v-form>
    </a-card>

    <deposits :type="type"/>
  </div>
</template>

<script>
import ps from '@/mixins/pstopper'
import Deposits from "@/pages/wallets/deposits/index";
import ACard from "@/components/ACard";
import ATextField from "@/components/ATextField";
import CryptoUpper from "@/components/CryptoUpper";
import {toSeparated} from "@/models/NumberUtil";

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
      v: {deposit: false},
      rules: {
        required: value => !!value || 'الزامی است',
        moreThanBillion: value => !!value && parseFloat(value) >= 1000 * 1000 || 'حداقل باید بیشتر از ۱ میلیون ریال باشد'
      },
      type: 'IRR',
      amount: '',
      link: '',
      l: {deposit: false}
    }
  },
  mounted() {
    this.$store.dispatch('balances/refresh')
    this.$store.dispatch('addresses/refresh')
    this.$axios.$post('/access/limits/remained', {resource: 'irr', action: 'deposit'})
        .then(res => {
          this.daily_rem_usage = (res.daily_rem_usage !== -1) ? toSeparated(res.daily_rem_usage) + 'ریال' : 'نامحدود'
          this.monthly_rem_usage = (res.monthly_rem_usage !== -1) ? toSeparated(res.monthly_rem_usage) + 'ریال' : 'نامحدود'
        })
  },
  methods: {
    async onDeposit() {
      this.$refs.form.validate()
      if (this.v.deposit) {
        this.l.deposit = true
        this.link = await this.$axios.$post('/irr/deposit', {amount: this.amount})
        window.open(this.link, '_blank')
        this.l.deposit = false
      }
    }
  }
}
</script>

<style scoped>

</style>