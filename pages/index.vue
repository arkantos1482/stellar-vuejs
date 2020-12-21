<template>
  <div class="mx-n12">
    <div class="d-flex align-items-stretch">

      <!--    SELL-->
      <v-card width="28%" class="pa-2">
        <v-simple-table dense fixed-header>
          <thead>
          <tr>
            <th class="small-font">{{ priceLabel }}</th>
            <th class="small-font">{{ unitNumberLabel }}</th>
            <th class="small-font">{{ amountLabel }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in offers.asks" :key="index">
            <td class="red--text">{{ offersPrice(item) }}</td>
            <td>{{ (parseFloat(item.amount) / offersPrice(item)).toFixed(10)|toFloat }}</td>
            <td>{{ parseFloat(item.amount) }}</td>
          </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <!--    MAIN-->
      <v-card class="mx-4 px-4" width="46%">
        <div class="d-flex justify-center">
          <v-col cols="3" class="ml-n4">
            <v-select background-color="blue lighten-5" @change="myOffers" v-model="baseAsset" :items="assets"
                      dense filled rounded/>
          </v-col>
          <v-col cols="3">
            <v-select background-color="blue lighten-5" @change="myOffers" v-model="counterAsset" :items="assets"
                      dense filled rounded/>
          </v-col>
        </div>

        <div class="d-flex justify-center px-4 ">
          <trading-vue dir="ltr"
                       color-back="white"
                       color-grid="grey"
                       color-text="grey"
                       color-title="black"
                       :height="240"
                       :width="windowWidth/3"
                       :title-txt="this.baseAsset+this.counterAsset"
                       :data="this.$data"></trading-vue>
        </div>

        <v-row justify="center">
          <v-col cols="6" class="px-2">
            <v-row justify="space-between px-8">
              <p class="text-subtitle-2"><span>خرید </span>{{ baseAsset | toFarsiCoin }}</p>
              <p><span class="text-caption">{{ counterAsset }}</span>
                {{ balances[counterAsset]|toFloat }}</p>
            </v-row>
            <v-text-field class="mt-n4" dense filled rounded
                          v-model="buy.amount" placeholder="مقدار" :suffix="baseAsset"/>
            <v-text-field class="mt-n4" dense filled rounded
                          v-model="buy.price" placeholder="قیمت" :suffix="counterAsset"/>
            <v-text-field class="mt-n4" dense filled rounded readonly
                          :value="buy.amount*buy.price" placeholder="مجموع" :suffix="counterAsset"/>
            <v-btn depressed class="white--text" block @click="doBuy" :loading="l.buy" color="green">خرید</v-btn>
          </v-col>

          <v-col cols="6" class="px-2">
            <v-row justify="space-between px-8">
              <p class="text-subtitle-2"><span>فروش </span>{{ baseAsset | toFarsiCoin }}</p>
              <p><span class="text-caption">{{ baseAsset }}</span>
                {{ balances[baseAsset]|toFloat }}</p>
            </v-row>
            <v-text-field class="mt-n4" dense filled rounded
                          v-model="sell.amount" placeholder="مقدار" :suffix="baseAsset"/>
            <v-text-field class="mt-n4" dense filled rounded
                          v-model="sell.price" placeholder="قیمت" :suffix="counterAsset"/>
            <v-text-field class="mt-n4" dense filled rounded readonly
                          :value="sell.amount*sell.price" placeholder="مجموع" :suffix="counterAsset"/>
            <v-btn depressed class="white--text" block @click="doSell" :loading="l.sell" color="red">فروش</v-btn>
          </v-col>
        </v-row>
      </v-card>

      <!--    BUY-->
      <v-card width="28%" class="pa-2">
        <v-simple-table dense fixed-header>
          <thead>
          <tr>
            <th class="small-font">{{ priceLabel }}</th>
            <th class="small-font">{{ unitNumberLabel }}</th>
            <th class="small-font">{{ amountLabel }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in buyOffers" :key="index">
            <td class="green--text">{{ offersPrice(item) }}</td>
            <td>{{ (parseFloat(item.amount) / offersPrice(item)).toFixed(10)|toFloat }}</td>
            <td>{{ parseFloat(item.amount) }}</td>
          </tr>
          </tbody>
        </v-simple-table>
      </v-card>

    </div>

    <active-offers/>
  </div>
</template>

<script>
import collect from "collect.js";
import ActiveOffers from "@/pages/ActiveOffers";
import ATextField from "@/components/ATextField";
import TradingVue from 'trading-vue-js'

export default {
  components: {ActiveOffers, ATextField, TradingVue},
  errorCaptured(err, vm, info) {
    this.l.buy = false
    this.l.sell = false
  },
  computed: {
    baseBalance() {
      return `موجودی (${this.baseAsset}) : ${parseFloat(this.balances[this.baseAsset])}`
    },
    counterBalance() {
      return `موجودی (${this.counterAsset}) : ${parseFloat(this.balances[this.counterAsset])}`
    },
    priceLabel() {
      return 'قیمت ( ' + this.counterAsset + ' )'
    },
    unitNumberLabel() {
      return 'مقدار ( ' + this.baseAsset + ' )'
    },
    amountLabel() {
      return 'مجموع ( ' + this.counterAsset + ' )'
    },
    buyOffers() {
      return collect(this.offers.bids)
          .map(item => ({
            price: item.price,
            price_r: item.price_r,
            amount: (parseFloat(item.amount) / item.price_r.n)
          }))
    },
    // baseAssetList() {
    //   collect(this.assets)
    //       .reject(function (item) {
    //         return item === this?.counterAsset
    //       })
    // },
    // counterAssetList() {
    //   collect(this.assets)
    //       .reject(function (item) {
    //         return item === this?.baseAsset
    //       })
    // }
  },
  data() {
    return {
      assets: ['BTC', 'LTC', 'ETH', 'USDT', 'IRR', 'BCH', 'AMIN', 'BARG'],
      offers: [],
      baseAsset: 'BTC',
      counterAsset: 'ETH',
      windowWidth: window.innerWidth,
      balances: [],
      l: {sell: false, buy: false},
      sell: {
        amount: '',
        price: ''
      },
      buy: {
        amount: '',
        price: ''
      },
      ohlcv: [
        [1551128400000, 33, 37.1, 14, 14, 196],
        [1551132000000, 13.7, 30, 6.6, 30, 206],
        [1551135600000, 29.9, 33, 21.3, 21.8, 74],
        // [1551139200000, 21.7, 25.9, 18, 24, 140],
        // [1551142800000, 24.1, 24.1, 24, 24.1, 29],
      ]
    }
  },
  methods: {
    async doSell() {
      this.l.sell = true
      await this.$axios.$post('/offers/sell', {
        sell: this.baseAsset,
        buy: this.counterAsset,
        amount: this.sell.amount,
        price: this.sell.price
      })
      this.l.sell = false
      await this.myOffers()
      // await this.buyOffers()
    },
    async doBuy() {
      this.l.buy = true
      await this.$axios.$post('/offers/buy', {
        buy: this.baseAsset,
        sell: this.counterAsset,
        amount: this.buy.amount,
        price: this.buy.price
      })
      this.l.buy = false
      await this.myOffers()
      // await this.buyOffers()
    },
    async myOffers() {
      this.offers = (await this.$axios.$get('/offers-book', {
        params: {
          sell: this.baseAsset,
          buy: this.counterAsset
        }
      }))
    },
    offersPrice(item) {
      return parseFloat(parseFloat(item.price_r.n / item.price_r.d).toFixed(10))
    }
    // async buyOffers() {
    //   this.buy.offers = (await this.$axios.$get('/offers-book', {
    //     params: {
    //       sell: this.buy.counterAsset,
    //       buy: this.buy.baseAsset
    //     }
    //   }))
    // }
  },
  async mounted() {
    window.onresize = () => {
      this.windowWidth = window.innerWidth
    }

    await this.myOffers()

    // this.$axios.$get('/profiles/me/stellar')
    //     .then(function (res) {
    //       this.balances = collect(res.balances)
    //           .map(item => ({[item.asset_code]: item.balance}))
    //           .reduce((_acc, item) => ({..._acc, ...item})) ?? []
    //     })

    let balances = (await this.$axios.$get('/profiles/me/stellar')).balances
    this.balances = collect(balances)
        .map(item => ({[item.asset_code]: item.balance}))
        .reduce((_acc, item) => ({..._acc, ...item})) ?? []
  }
}
</script>
<style scoped>
.v-text-field--rounded {
  border-radius: 4px
}
.small-font{
  white-space:nowrap;
  /*font-size: 10px;*/
}
</style>