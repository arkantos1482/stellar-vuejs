<template>
  <a-row class="align-stretch">
    <v-col cols="4" class="pa-4 d-flex flex-column">
      <div class="text-h4 mb-6 text-right">{{ actionTitle }}</div>
      <v-card class="px-16 py-12 flex-grow-1" height="100%">
        <div class="text-center mb-8">
          <v-btn-toggle mandatory dense color="primary" v-model="usdtSelector">
            <v-btn value="TRON">ترون</v-btn>
            <v-btn value="ETHER">اتریوم</v-btn>
          </v-btn-toggle>
        </div>
        <div v-show="address !== 'not_loaded'">
          <crypto-upper :balance="balance" :type="type"/>

          <div v-if="address !== 'no_address'" class="mt-12 text-center">
            <vue-qrcode :value="address"/>
            <p style="font-family: serif; font-size: 1.6rem">{{ address }}</p>
          </div>
          <v-btn v-else @click="createCrypto" :loading="l.create"
                 class="mt-16 mb-8" block color="primary">ایجاد
          </v-btn>
        </div>
      </v-card>
    </v-col>

    <v-col cols="8" class="pa-0">
      <deposits :type="type" :title="listTitle"/>
    </v-col>
  </a-row>
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
      return this.$store.state.balances.list[this.type]?.actual_balance
    },
    actionTitle() {
      return this.isInternal() ? 'دریافت' : 'واریز'
    },
    listTitle() {
      return this.isInternal() ? 'لیست دریافت ها' : 'لیست واریزها'
    }
  },
  watch: {
    usdtSelector(val) {
      this.initAddress()
    }
  },
  data() {
    return {
      usdtSelector: 'TRON',
      type: this.$route.params.type.toUpperCase(),
      address: 'not_loaded',
      l: {create: false}
    }
  },
  mounted() {
    this.initAddress()
  },
  methods: {
    async initAddress() {
      this.address = 'not_loaded'
      await this.$store.dispatch('addresses/refresh')
      const address = this.$store.state.addresses.list[this.usdtTronFix(this.type)];
      this.address = address ? address : 'no_address';
      await this.$store.dispatch('balances/refresh')
    },
    async createCrypto() {
      this.l.create = true
      this.address = await this.$axios.$post('/crypto/' +
          this.usdtTronFix(this.type).toLowerCase() + '/address/create')
      this.l.create = false
    },
    isInternal() {
      return ['AMN', 'EBG', 'SHA', 'ART', 'ZRK', 'WIT'].includes(this.type.toUpperCase())
    },
    usdtTronFix(type) {
      return (type === 'USDT' && this.usdtSelector === 'TRON') ? 'TRX' : type
    }
  }
}
</script>

