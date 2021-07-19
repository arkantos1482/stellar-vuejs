<template>
  <div class="pa-4">
    <p class="text-h4 mb-6 text-right">کیف پول شما</p>
    <v-card width="100%" height="100%" class="px-8 py-4">
      <v-simple-table>
        <thead>
        <tr>
          <th class="pr-16">ارز</th>
          <th class="text-center">موجودی</th>
          <th class="text-center">موجودی در دسترس</th>
          <th class="text-center">سفارش در جریان</th>
          <th class="text-center">ارزش BTC</th>
          <th class="text-center">عملیات</th>
        </tr>
        </thead>
        <tbody>
        <crypto-address-tr namad="امین" type="amn" :balance="balances.AMN"/>
        <!--      <crypto-address-tr namad="برگ" type="ebg" :balance="balances.EBG"/>-->
        <crypto-address-tr namad="آرت کوین" type="art" :balance="balances.ART"/>
<!--        <crypto-address-tr namad="زریک" type="zrk" :balance="balances.ZRK"/>-->
        <crypto-address-tr namad="شکوفه آلو" type="sha" :balance="balances.SHA"/>
        <crypto-address-tr namad="تلاش" type="tls" :balance="balances.TLS"/>
        <crypto-address-tr namad="وی توکن" type="wit" :balance="balances.WIT"/>
        <crypto-address-tr namad="تومان" type="irr" :balance="balances.IRR"/>

        <crypto-address-tr namad="بیت کوین" type="btc" :balance="balances.BTC"/>
        <crypto-address-tr namad="بایننس" type="btc" :balance="balances.BNB"/>
        <crypto-address-tr namad="دریک توکن" type="btc" :balance="balances.DRC"/>
        <crypto-address-tr namad="اتریوم" type="eth" :balance="balances.ETH"/>
        <crypto-address-tr namad="لایت کوین" type="ltc" :balance="balances.LTC"/>
        <crypto-address-tr namad="تتر" type="usdt" :balance="balances.USDT"/>
        <crypto-address-tr namad="ترون" type="trx" :balance="balances.TRX"/>
        <crypto-address-tr namad="بیت کوین کش" type="bch" :balance="balances.BCH"/>
        </tbody>
      </v-simple-table>
    </v-card>
  </div>
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

