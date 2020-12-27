<template>
  <div class="d-flex align-items-stretch mt-8">
    <a-card class="ml-4 py-8" width="30%" title="واریز">
      <div v-show="address !== 'not_loaded'">
        <crypto-upper :balance="balance" :type="type"/>

        <div v-if="address !== 'no_address'" class="mt-12 text-center">
          <vue-qrcode :value="address"/>
          <p>{{ address }}</p>
        </div>
        <v-btn v-else @click="createCrypto" :loading="l.create"
               class="mt-16 mb-8" block color="primary">ایجاد
        </v-btn>
      </div>
    </a-card>

    <a-card class="ml-4" width="70%">
      <deposits/>
    </a-card>
  </div>
</template>

<script>
import VueQrcode from 'vue-qrcode'
import ACard from "@/components/ACard";
import Deposits from "@/pages/wallets/deposits/index";
import pstopper from "@/mixins/pstopper";
import CryptoUpper from "@/components/CryptoUpper";

export default {
  mixins: [pstopper],
  components: {CryptoUpper, Deposits, VueQrcode, ACard},
  computed: {
    balance() {
      return this.$store.state.balances.list[this.type]
    }
  },
  data() {
    return {
      type: this.$route.params.type.toUpperCase(),
      address: 'not_loaded',
      l: {create: false}
    }
  },
  async mounted() {
    await this.$store.dispatch('addresses/refresh')
    const address = this.$store.state.addresses.list[this.type];
    this.address = address ? address : 'no_address';
    await this.$store.dispatch('balances/refresh')
  },
  methods: {
    async createCrypto() {
      this.l.create = true
      this.address = await this.$axios.$post('/crypto/' + this.type.toLowerCase() + '/address/create')
      this.l.create = false
    }
  }
}
</script>

