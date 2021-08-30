<template>
  <tr>
    <td>
      <div class="d-flex align-center">
        <v-img class="ml-2" max-width="36" max-height="36"
               :src="type|toCoinIcon"/>
        {{ namad }}&nbsp({{ type.toUpperCase()|irtFix }})
      </div>
    </td>
    <td v-if="balance">{{ adjustDp(balance.balance)|toFloat|separated }}</td>
    <td v-else></td>
    <td v-if="balance">{{ adjustDp(balance.actual_balance)|toFloat|separated }}</td>
    <td v-else></td>
    <td v-if="balance">{{ adjustDp(balance.selling_liabilities)|toFloat|separated }}</td>
    <td v-else></td>
    <td></td>
    <td>
      <v-btn :disabled="isDepositDisabled" small text color="primary" @click="onDeposit">
        {{ depositLabel }}
      </v-btn>
      <v-btn :disabled="isWithdrawDisabled" small text color="primary" class="mx-8" @click="onWithdraw">
        {{ withdrawLabel }}
      </v-btn>
      <v-btn :disabled="isRefreshDisabled" icon @click="onSync" :loading="l.sync">
        <v-icon color="primary">mdi-refresh</v-icon>
      </v-btn>
    </td>
  </tr>
</template>
<script>
import ps from '@/mixins/pstopper'
import {safeDecimal} from "@/models/NumberUtil"
import {getDp} from "@/models/cryptoPrecision"

export default {
  mixins: [ps],
  name: 'CryptoAddressTr',
  props: ['type', 'address', 'balance', 'namad'],
  computed: {
    isRefreshDisabled() {
      const type = this.type.toUpperCase();
      return 'IRR' === type || this.isInternal()
    },
    isDepositDisabled() {
      return false
    },
    isWithdrawDisabled() {
      const type = this.type.toUpperCase();
      return ['ETH', 'BCH', 'BNB'].includes(type)
      // return false
    },
    withdrawLabel() {
      return this.isInternal() ? 'ارسال' : 'برداشت'
    },
    depositLabel() {
      return this.isInternal() ? 'دریافت' : 'واریز'
    }
  },
  data() {
    return {
      l: {create: false, sync: false}
    }
  },
  methods: {
    async onDeposit() {
      await this.$router.push({path: '/wallets/deposits/' + this.type})
    },
    async onWithdraw() {
      await this.$router.push({path: '/wallets/withdraws/' + this.type})
    },
    async onSync() {
      this.l.sync = true
      if (this.type === 'usdt') {
        await this.$axios.$get(`/crypto/usdt_tron/sync`)
      }
      await this.$axios.$get(`/crypto/${this.type}/sync`)
      await this.$store.dispatch('balances/refresh')
      this.l.sync = false
    },
    isInternal() {
      return ['AMN', 'EBG', 'SHA', 'ART', 'ZRK', 'TLS', 'WIT'].includes(this.type.toUpperCase())
    },
    adjustDp(val) {
      return safeDecimal(val).todp(getDp(this.type))
    }
  }
}
</script>
