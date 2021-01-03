<template>
  <div>
    <div class="d-flex align-items-stretch">

      <!--    SELL-->
      <v-card width="28%" class="pa-2">
        <v-simple-table dense fixed-header>
          <thead>
          <tr>
            <th class="small-font text-body-1" style="font-family: serif">{{ priceLabel }}</th>
            <th class="small-font text-body-1">{{ unitNumberLabel }}</th>
            <th class="small-font text-body-1">{{ amountLabel }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in sellOffers" :key="index" class="text-body-1">
            <td class="error--text" style="font-size: 1.4rem">{{ offersPrice(item) }}</td>
            <td style="font-size: 1.4rem">{{ parseFloat(item.amount) }}</td>
            <td style="font-size: 1.4rem">{{ parseFloat(parseFloat(item.amount) * offersPrice(item)) }}</td>
          </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <!--    MAIN-->
      <v-card class="mx-4 pa-2" width="46%" ref="card">
        <div class="d-flex justify-center mb-n8 mt-n2">
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
                       :height="200"
                       :width="windowWidth*42/100"
                       :title-txt="this.baseAsset+this.counterAsset"
                       :data="this.$data"></trading-vue>
        </div>

        <div class="d-flex justify-center text-display-1">
          <v-col cols="6" class="px-2 py-0">
            <div class="d-flex justify-space-between">
              <p class="ma-0"><span>خرید </span>{{ baseAsset | toFarsiCoin }}</p>
              <p class="ma-0 grey--text"><span>{{ counterAsset }}</span>
                {{ balances[counterAsset]|toFloat }}
                <v-icon>mdi-wallet-outline</v-icon>
              </p>
            </div>

            <order-text-field v-model="buy.price" prepend="قیمت" :append="counterAsset"/>
            <order-text-field v-model="buy.amount" prepend="مقدار" :append="baseAsset"/>
            <order-text-field class="mt-6" readonly :value="buy.amount*buy.price" prepend="مجموع"
                              :append="counterAsset"/>
            <v-btn depressed small class="white--text mt-8 py-4" block color="success"
                   @click="doBuy" :loading="l.buy">خرید
            </v-btn>
          </v-col>

          <v-col cols="6" class="px-2 py-0">
            <div class="d-flex justify-space-between">
              <p class="ma-0"><span>فروش </span>{{ baseAsset | toFarsiCoin }}</p>
              <p class="ma-0 grey--text"><span>{{ baseAsset }}</span>
                {{ balances[baseAsset]|toFloat }}
                <v-icon>mdi-wallet-outline</v-icon>
              </p>
            </div>
            <order-text-field v-model="sell.price" prepend="قیمت" :append="counterAsset"/>
            <order-text-field v-model="sell.amount" prepend="مقدار" :append="baseAsset"/>
            <order-text-field class="mt-6" readonly :value="sell.amount*sell.price" prepend="مجموع"
                              :append="counterAsset"/>
            <v-btn depressed small class="white--text mt-8 py-4" block color="error"
                   @click="doSell" :loading="l.sell">فروش
            </v-btn>
          </v-col>
        </div>
      </v-card>

      <!--    BUY-->
      <v-card width="28%" class="pa-2">
        <v-simple-table dense fixed-header>
          <thead>
          <tr>
            <th class="small-font text-body-1">{{ priceLabel }}</th>
            <th class="small-font text-body-1">{{ unitNumberLabel }}</th>
            <th class="small-font text-body-1">{{ amountLabel }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in buyOffers" :key="index">
            <td class="success--text" style="font-size: 1.4rem">{{ offersPrice(item) }}</td>
            <td style="font-size: 1.4rem">{{ (parseFloat(item.amount) / offersPrice(item)).toFixed(10)|toFloat }}</td>
            <td style="font-size: 1.4rem">{{ parseFloat(item.amount) }}</td>
          </tr>
          </tbody>
        </v-simple-table>
      </v-card>

    </div>

    <active-offers class="mt-4"/>
  </div>
</template>

<script>
import collect from "collect.js";
import ActiveOffers from "@/pages/ActiveOffers";
import TradingVue from 'trading-vue-js'
import {mapActions} from "vuex";
import OrderTextField from "@/pages/OrderTextField";

export default {
  components: {OrderTextField, ActiveOffers, TradingVue},
  errorCaptured(err, vm, info) {
    this.l.buy = false
    this.l.sell = false
  },
  computed: {
    balances() {
      return this.$store.state.balances.list
    },
    baseBalance() {
      return `موجودی (${this.baseAsset}) : ${parseFloat(this.balances[this.baseAsset])}`
    },
    counterBalance() {
      return `موجودی (${this.counterAsset}) : ${parseFloat(this.balances[this.counterAsset])}`
    },
    priceLabel() {
      return 'قیمت (' + this.counterAsset + ')'
    },
    unitNumberLabel() {
      return 'مقدار (' + this.baseAsset + ')'
    },
    amountLabel() {
      return 'مجموع (' + this.counterAsset + ')'
    },
    buyOffers() {
      return collect(this.offers.bids)
          .map(item => ({
            price: item.price,
            price_r: item.price_r,
            amount: parseFloat(item.amount)
          }))
          .sortByDesc('price_r.n')
    },
    sellOffers() {
      return collect(this.offers.asks)
          .sortBy('price_r.n')
    }
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
    ...mapActions("offers", {refreshActiveOffers: 'refresh'}),
    ...mapActions("balances", {refreshBalances: 'refresh'}),
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
      await this.refreshActiveOffers()
      await this.refreshBalances()
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
      await this.refreshActiveOffers()
      await this.refreshBalances()
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
  mounted() {
    window.onresize = () => {
      this.windowWidth = window.innerWidth
    }

    this.myOffers()
    this.refreshBalances()
  }
}
</script>
<style scoped>
.v-text-field--rounded {
  border-radius: 4px
}

.small-font {
  white-space: nowrap;
}
</style>