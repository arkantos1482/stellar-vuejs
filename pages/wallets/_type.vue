<template>
  <div>

    <v-row class="justify-center text-center">
      <v-col cols="6">
        <v-text-field label="حساب مقصد"/>
        <v-btn :loading="wLoading">برداشت</v-btn>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="6">
        <json-viewer dir="auto" :value="txs"/>
      </v-col>
      <v-col cols="6">
        <json-viewer dir="auto" :value="account"/>
      </v-col>
    </v-row>

    <json-viewer dir="auto" :value="refreshResult"/>
    <v-btn @click="syncDeposits" :loading="rLoading" class="mt-2">sync deposits</v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      type: this.$route.params.type,
      wLoading: false,
      account: '',
      txs: '',
      rLoading: false,
      refreshResult: ''
    }
  },
  async fetch() {
    try {
      this.account = await this.$axios.$get(`/crypto/${this.type}/address`)
      this.txs = await this.$axios.$get(`/crypto/${this.type}/txs/basic`)
    } catch (e) {
      this.account = 'خطایی رخ داده است.'
      this.txs = 'خطایی رخ داده است.'
    }
  },
  methods: {
    async syncDeposits() {
      this.rLoading = true
      this.refreshResult = await this.$axios.$get(`/crypto/${this.type}/sync`)
      this.rLoading = false
    }
  }
}
</script>

<style scoped>

</style>