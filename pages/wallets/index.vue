<template>
  <v-card width="100%" class="text-center">
    <v-simple-table>
      <thead class="grey lighten-3">
      <tr>
        <th>رمزارز</th>
        <th class="text-center">موجودی</th>
        <th class="text-center">عملیات</th>
      </tr>
      </thead>
      <tbody>
      <crypto-address-tr namad="امین" type="amn" :balance="balances.AMN"/>
      <crypto-address-tr namad="برگ" type="ebg" :balance="balances.EBG"/>
      <crypto-address-tr namad="آرت کوین" type="art" :balance="balances.ART"/>
      <crypto-address-tr namad="زریک" type="zrk" :balance="balances.ZRK"/>
      <crypto-address-tr namad="شکوفه آلو" type="sha" :balance="balances.SHA"/>
      <crypto-address-tr namad="تومان" type="irr" :balance="balances.IRR"/>
      <crypto-address-tr namad="بیت کوین" type="btc" :balance="balances.BTC"/>
      <crypto-address-tr namad="اتریوم" type="eth" :balance="balances.ETH"/>
      <crypto-address-tr namad="لایت کوین" type="ltc" :balance="balances.LTC"/>
      <crypto-address-tr namad="تتر" type="usdt" :balance="balances.USDT"/>
      <crypto-address-tr namad="بیت کوین کش" type="bch" :balance="balances.BCH"/>
      </tbody>
    </v-simple-table>
  </v-card>
</template>

<script>
import CryptoAddressTr from "@/components/CryptoAddressTr";

export default {
  name: "CryptoAddresses",
  components: {CryptoAddressTr},
  computed: {
    balances() {
      return this.$store.state.balances.list
    }
  },
  mounted() {
    this.$store.dispatch('balances/refresh')
    this.$store.dispatch('addresses/refresh')
  }
}
</script>

