<template>
  <a-row class="align-stretch">
    <v-col cols="4" class="pa-4 d-flex flex-column">
      <div class="text-h4 mb-6 text-right">{{ actionTitle }}</div>
      <v-card class="px-16 py-12 flex-grow-1" height="100%">

        <div v-if="type === 'USDT'" class="text-center mb-8">
          <v-btn-toggle mandatory dense color="primary" v-model="usdtSelector">
            <v-btn value="TRON">ترون</v-btn>
            <v-btn value="ETHER">اتریوم</v-btn>
          </v-btn-toggle>
        </div>

        <div v-show="address !== 'not_loaded'">
          <crypto-upper :balance="balance" :type="type"/>

          <div v-if="address !== 'no_address'" class="mt-12 text-center">
            <vue-qrcode :value="address|bchFix"/>
            <v-row class="align-center my-4">
              <v-btn icon @click="copy(fixBchMethod(address))">
                <v-icon small color="primary">mdi-clipboard-text-multiple-outline</v-icon>
              </v-btn>
              <p class="mb-0" style="font-family: serif; font-size: 1.6rem">{{ address|bchFix }}</p>
            </v-row>
          </div>
          <v-btn v-else @click="createCrypto" :loading="l.create"
                 class="mt-16 mb-4" block color="primary">ایجاد
          </v-btn>
          <v-btn block color="primary" outlined @click="$router.back()">بازگشت</v-btn>

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
  filters: {
    bchFix: (address) => address.replace('bitcoincash:', '')
  },
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
      return ['AMN', 'EBG', 'SHA', 'ART', 'ZRK', 'TLS', 'WIT'].includes(this.type.toUpperCase())
    },
    usdtTronFix(type) {
      return (type === 'USDT' && this.usdtSelector === 'TRON') ? 'TRX' : type
    },
    fixBchMethod: (address) => address.replace('bitcoincash:', ''),
    copy(value) {
      let tempInput = document.createElement("input");
      tempInput.value = value;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
    }
  }
}
</script>

