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
        <div class="d-flex justify-space-between mb-n8 mt-n2">
          <v-tabs v-model="tabIndex">
            <v-tab>ریال</v-tab>
            <v-tab>تتر</v-tab>
            <v-tab>رمزارز به رمزارز</v-tab>
          </v-tabs>

          <v-col cols="4">
            <v-select background-color="blue lighten-5"
                      v-model="pairAsset" :items="pairAssetList" item-text="text" item-value="value"
                      dense filled solo flat/>
          </v-col>
        </div>

        <div class="d-flex justify-center px-4">
          <trading-vue dir="ltr"
                       ref="tradingVue"
                       style="z-index: 0"
                       color-back="white"
                       color-grid="grey"
                       color-text="grey"
                       color-title="black"
                       :height="240"
                       :width="windowWidth*42/100"
                       :title-txt="this.baseAsset+this.counterAsset"
                       :data="tradeData"></trading-vue>
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

            <v-form v-model="buyForm" @submit.prevent="doBuy">
              <order-text-field v-model="buy.price" prepend="قیمت" :append="counterAsset"/>
              <order-text-field v-model="buy.amount" prepend="مقدار" :append="baseAsset"/>
              <order-text-field :rules="[rules.buySufficient]"
                                class="mt-6" readonly :value="buyTotal" prepend="مجموع"
                                :append="counterAsset"/>
              <v-btn depressed small class="white--text mt-8 py-4" block color="success"
                     type="submit" :loading="l.buy">خرید
              </v-btn>
            </v-form>
          </v-col>

          <v-col cols="6" class="px-2 py-0">
            <div class="d-flex justify-space-between">
              <p class="ma-0"><span>فروش </span>{{ baseAsset | toFarsiCoin }}</p>
              <p class="ma-0 grey--text"><span>{{ baseAsset }}</span>
                {{ balances[baseAsset]|toFloat }}
                <v-icon>mdi-wallet-outline</v-icon>
              </p>
            </div>

            <v-form v-model="sellForm" @submit.prevent="doSell">
              <order-text-field v-model="sell.price" prepend="قیمت" :append="counterAsset"/>
              <order-text-field :rules="[rules.sellSufficient]"
                                v-model="sell.amount" prepend="مقدار" :append="baseAsset"/>
              <order-text-field class="mt-6" readonly :value="sellTotal" prepend="مجموع"
                                :append="counterAsset"/>
              <v-btn depressed small class="white--text mt-8 py-4" block color="error"
                     type="submit" :loading="l.sell">فروش
              </v-btn>
            </v-form>
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
  watch: {
    pairAsset(val) {
      let array = val.split('/')
      this.baseAsset = array[0]
      this.counterAsset = array[1]
      this.clear()
      this.refreshOffers()
      this.refreshTrades()
    },
    tabIndex(val) {
      this.pairAsset = this.list[val][0]
    },
  },
  computed: {
    pairAssetList() {
      const list1 = this.list[this.tabIndex];
      return collect(list1)
          .map(item => {
            let array = item.split('/')
            let filter = this.$options.filters.toFarsiCoin
            return {
              text: filter(array[0]) + '/' + filter(array[1]),
              value: item
            };
          }).all()
    },
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
    },
    sellTotal() {
      return this.sell.amount * this.sell.price
    },
    buyTotal() {
      return this.buy.amount * this.buy.price
    }
  },
  data() {
    return {
      list: [
        ['BTC/IRR', 'ETH/IRR', 'BCH/IRR', 'LTC/IRR', 'USDT/IRR'],
        ['BTC/USDT', 'ETH/USDT', 'BCH/USDT', 'LTC/USDT'],
        ['ETH/BTC', 'BCH/BTC', 'LTC/BTC', 'BCH/ETH', 'LTC/ETH', 'LTC/BCH']],
      offers: [],
      tabIndex: 0,
      pairAsset: 'BTC/IRR',
      baseAsset: 'BTC',
      counterAsset: 'IRR',
      interval: {offers: null, trades: null},
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
      sellForm: false,
      buyForm: false,
      rules: {
        required: value => !!value || 'الزامی است',
        buySufficient: value => this.balances[this.counterAsset] >= this.buyTotal || 'اعتبار ناکافی',
        sellSufficient: value => this.balances[this.baseAsset] >= this.sell.amount || 'اعتبار ناکافی',
      },
      tradeData: {
        chart: {
          data: [
            // [1551128400000, 33, 37.1, 14, 14, 196],
            // [1551132000000, 13.7, 30, 6.6, 30, 206],
            // [1551135600000, 29.9, 33, 21.3, 21.8, 74],
            // [1551139200000, 21.7, 25.9, 18, 24, 140],
            // [1551142800000, 24.1, 24.1, 24, 24.1, 29],
          ]
        }
      },
    }
  },
  methods: {
    ...mapActions("offers", {refreshActiveOffers: 'refresh'}),
    ...mapActions("balances", {refreshBalances: 'refresh'}),
    clear() {
      this.buy.amount = ''
      this.buy.price = ''
      this.sell.amount = ''
      this.sell.price = ''
    },
    async doSell() {
      if (!this.sellForm) return
      this.l.sell = true
      await this.$axios.$post('/offers/sell', {
        sell: this.baseAsset,
        buy: this.counterAsset,
        amount: this.sell.amount,
        price: this.sell.price
      })
      this.l.sell = false
      this.clear()
      await this.refreshBalances()
      await this.refreshOffers()
      await new Promise(r => setTimeout(r, 2000))
      await this.refreshActiveOffers()
      await new Promise(r => setTimeout(r, 2000))
      await this.refreshActiveOffers()
      await new Promise(r => setTimeout(r, 2000))
      await this.refreshActiveOffers()

    },
    async doBuy() {
      if (!this.buyForm) return
      this.l.buy = true
      await this.$axios.$post('/offers/buy', {
        buy: this.baseAsset,
        sell: this.counterAsset,
        amount: this.buy.amount,
        price: this.buy.price
      })
      this.l.buy = false
      this.clear()
      await this.refreshBalances()
      await this.refreshOffers()
      await new Promise(r => setTimeout(r, 2000))
      await this.refreshActiveOffers()
      await new Promise(r => setTimeout(r, 2000))
      await this.refreshActiveOffers()
      await new Promise(r => setTimeout(r, 2000))
      await this.refreshActiveOffers()

    },
    async refreshOffers() {
      this.offers = (await this.$axios.$get('/offers-book', {
        params: {
          sell: this.baseAsset,
          buy: this.counterAsset
        }
      }))
    },
    async refreshTrades() {
      let result = await this.$axios.$get('/trade-aggregates', {
        params: {
          base: this.baseAsset,
          counter: this.counterAsset
        }
      })
      this.tradeData.chart.data = collect(result)
          .map(item => [
            parseFloat(item.timestamp),
            parseFloat(item.open),
            parseFloat(item.high),
            parseFloat(item.low),
            parseFloat(item.close),
            parseFloat(item.base_volume)])
          .all()
      this.$refs.tradingVue.resetChart()
    },
    offersPrice(item) {
      return parseFloat(parseFloat(item.price_r.n / item.price_r.d).toFixed(10))
    }
  },
  mounted() {
    window.onresize = () => {
      this.windowWidth = window.innerWidth
    }
    this.refreshBalances()

    this.refreshOffers()
    this.refreshTrades()
    this.interval.offers = setInterval(() => {
      this.refreshOffers()
    }, 20 * 1000);
    // this.interval.offers = setInterval(() => {
    //   this.refreshOffers()
    // }, 5 * 60 * 1000);
  },
  beforeDestroy() {
    clearInterval(this.interval.offers)
    // clearInterval(this.interval.trades)
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