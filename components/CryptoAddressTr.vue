<template>
  <tr>
    <td>{{ type }}</td>
    <td>{{ balance }}</td>
    <td>
      <v-btn text small color="green" @click="onDeposit">واریز</v-btn>
      <v-btn text small color="red" @click="onWithdraw">برداشت</v-btn>
      <v-btn icon @click="onSync" :loading="l.sync">
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
  props: ['type', 'address', 'balance'],
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
      this.syncResult = await this.$axios.$get(`/crypto/${this.asset}/sync`)
      this.l.sync = false
    }
  }
}
</script>
