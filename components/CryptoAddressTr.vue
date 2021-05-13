<template>
  <tr>
    <td>
      <div class="d-flex align-center">
        <v-img class="ml-2" max-width="36" max-height="36"
               :src="type|toCoinIcon"/>
        {{ namad }}
      </div>
    </td>
    <td v-if="balance">{{ balance.balance|toFloat|separated }}&nbsp{{ type.toUpperCase()|irtFix }}</td>
    <td v-else></td>
    <td v-if="balance">{{ balance.actual_balance|toFloat|separated }}&nbsp{{ type.toUpperCase()|irtFix }}</td>
    <td v-else></td>
    <td v-if="balance">{{ balance.selling_liabilities|toFloat|separated }}&nbsp{{ type.toUpperCase()|irtFix }}</td>
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
      return ['ETH', 'IRR'].includes(type)
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
      syncResult: '',
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
      let type = this.usdtTronFix(this.type.toUpperCase()).toLowerCase()
      this.syncResult = await this.$axios.$get(`/crypto/${type}/sync`)
      await this.$store.dispatch('balances/refresh')
      this.l.sync = false
    },
    isInternal() {
      return ['AMN', 'EBG', 'SHA', 'ART', 'ZRK', 'WIT'].includes(this.type.toUpperCase())
    },
    usdtTronFix(type) {
      return type === 'USDT' ? 'USDT_TRON' : type
    }
  }
}
</script>
