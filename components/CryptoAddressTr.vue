<template>
  <tr>
    <td>
      <div class="d-flex align-items-center">
        <v-img class="ml-2" max-width="24" max-height="24"
               :src="icon"/>
        <p>{{ namad }}</p>
      </div>
    </td>
    <td>{{ type.toUpperCase() }}</td>
    <td>{{ parseFloat(balance) }}</td>
    <td>
      <v-btn :disabled="isDepositDisabled" text small color="green" @click="onDeposit">واریز</v-btn>
      <v-btn :disabled="isWithdrawDisabled" text small color="red" @click="onWithdraw">برداشت</v-btn>
      <v-btn :disabled="isDepositDisabled" icon @click="onSync" :loading="l.sync">
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
  props: ['type', 'address', 'balance', 'icon', 'namad'],
  computed: {
    isDepositDisabled() {
      const type = this.type.toUpperCase();
      return 'AMIN' === type || 'BARG' === type
    },
    isWithdrawDisabled() {
      const type = this.type.toUpperCase();
      return 'BCH' === type || 'AMIN' === type || 'BARG' === type
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
      this.l.sync = false
    }
  }
}
</script>
