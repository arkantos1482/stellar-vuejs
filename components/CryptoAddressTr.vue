<template>
  <tr>
    <td>
      <div class="d-flex align-items-center">
        <v-img class="ml-2" max-width="36" max-height="36"
               :src="type|toCoinIcon"/>
        {{ namad }}
      </div>
    </td>
    <td>{{ balance|toFloat }}&nbsp{{ type.toUpperCase() }}</td>
    <td>
      <v-btn :disabled="isDepositDisabled" small depressed color="#02c0761E" class="success--text" @click="onDeposit">
        واریز
      </v-btn>
      <v-btn :disabled="isWithdrawDisabled" small depressed color="#F849601E" class="error--text" @click="onWithdraw">
        برداشت
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
      return 'AMN' === type || 'EBG' === type || 'IRR' === type
    },
    isDepositDisabled() {
      const type = this.type.toUpperCase();
      // return 'AMN' === type || 'EBG' === type
      return false
    },
    isWithdrawDisabled() {
      const type = this.type.toUpperCase();
      // return 'BCH' === type || 'AMN' === type || 'EBG' === type
      return 'BCH' === type
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
      this.syncResult = await this.$axios.$get(`/crypto/${this.type}/sync`)
      await this.$store.dispatch('balances/refresh')
      this.l.sync = false
    }
  }
}
</script>
