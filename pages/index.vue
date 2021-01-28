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
          <tr v-for="(item,index) in sellOffers" :key="index" class="pointer text-body-1"
              @click="select('buy',item)">
            <td class="error--text" style="font-size: 1.4rem">{{ offersPrice(item)|separated }}</td>
            <td style="font-size: 1.4rem">{{ item.amount|toFloat|separated }}</td>
            <td style="font-size: 1.4rem">{{ sellRecordTotal(item)|separated }}</td>
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
            <div class="d-flex justify-space-between px-2">
              <p class="ma-0"><span>خرید </span>{{ baseAsset | toFarsiCoin }}</p>
              <p @click="buyPercent=100" class="pointer ma-0 primary--text"><span>{{ counterAsset }}</span>
                {{ balances[counterAsset]|toFloat|separated }}
                <v-icon color="primary">mdi-wallet-outline</v-icon>
              </p>
            </div>

            <v-form v-model="buyForm" @submit.prevent="doBuy" class="mt-3">
              <order-text-field :type="counterAsset" v-model="buy.price" prepend="قیمت"/>
              <order-text-field :type="baseAsset" class="mt-n4" :rules="[rules.buyWalletExist]"
                                v-model="buy.amount" prepend="مقدار" :append="baseAsset"/>
              <v-slider class="mt-n4" color="accent" track-color="accent lighten-4"
                        v-model="buyPercent"
                        min="0" thumb-label/>
              <p class="pointer px-2 mb-3 mt-n3" @click="buy.price=sellBestPrice">پایین ترین پیشنهاد فروش:
                <span>{{ sellBestPrice|toFloat|separated }}</span></p>
              <order-text-field :type="counterAsset" :rules="[rules.buySufficient]"
                                class="mt-0" readonly :value="buyTotal" prepend="مجموع"
                                :append="counterAsset"/>
              <v-btn depressed small class="white--text py-4 mt-n3" block color="success"
                     type="submit" :loading="l.buy">خرید
              </v-btn>
            </v-form>
          </v-col>

          <v-col cols="6" class="px-2 py-0">
            <div class="d-flex justify-space-between px-2">
              <p class="ma-0"><span>فروش </span>{{ baseAsset | toFarsiCoin }}</p>
              <p @click="sellPercent=100" class="pointer ma-0 primary--text"><span>{{ baseAsset }}</span>
                {{ balances[baseAsset]|toFloat|separated }}
                <v-icon color="primary">mdi-wallet-outline</v-icon>
              </p>
            </div>

            <v-form v-model="sellForm" @submit.prevent="doSell" class="mt-3">
              <order-text-field :type="counterAsset" :rules="[rules.sellWalletExist]"
                                v-model="sell.price" prepend="قیمت"/>
              <order-text-field :type="baseAsset" class="mt-n4" :rules="[rules.sellSufficient]"
                                v-model="sell.amount" prepend="مقدار" :append="baseAsset"/>
              <v-slider class="mt-n4" color="accent" track-color="accent lighten-4"
                        v-model="sellPercent"
                        min="0" thumb-label/>
              <p class="pointer px-2 mb-3 mt-n3" @click="sell.price=buyBestPrice">بالاترین پیشنهاد خرید:
                <span>{{ buyBestPrice|toFloat|separated }}</span></p>
              <order-text-field :type="counterAsset" class="mt-0" readonly :value="sellTotal" prepend="مجموع"
                                :append="counterAsset"/>
              <v-btn depressed small class="white--text py-4 mt-n3" block color="error"
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
          <tr v-for="(item,index) in buyOffers" :key="index"
              class="pointer text-body-1"
              @click="select('sell',item)">
            <td class="success--text" style="font-size: 1.4rem">{{ offersPrice(item)|separated }}</td>
            <td style="font-size: 1.4rem">{{ buyRecordAmount(item)|separated }}</td>
            <td style="font-size: 1.4rem">{{ item.amount|toFloat|separated }}</td>
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
import OrderTextField from "@/components/OrderTextField";
import {safeDecimal} from "@/models/NumberUtil";
import {getDp} from "@/models/cryptoPrecision";

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
          .map(item => ({
            text: this.$options.filters.toFarsiCoinPair(item),
            value: item
          })).all()
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
    buyBestPrice() {
      if (this.buyOffers.isNotEmpty())
        return this.offersPrice(this.buyOffers.first())
    },
    sellBestPrice() {
      if (this.sellOffers.isNotEmpty())
        return this.offersPrice(this.sellOffers.first())
    },
    sellTotal() {
      return safeDecimal(this.sell.amount).times(safeDecimal(this.sell.price)).todp(getDp(this.counterAsset))
    },
    buyTotal() {
      return safeDecimal(this.buy.amount).times(safeDecimal(this.buy.price)).todp(getDp(this.counterAsset))
    },
    buyPercent: {
      get() {
        let percent
        try {
          percent = safeDecimal(this.buyTotal).times(100).div(this.balances[this.counterAsset])
        } catch (e) {
          percent = 0
        }
        // return more than 100, cause it to call set 100
        return parseInt(percent > 100 ? 100 : percent)
      },
      set(val) {
        try {
          this.buy.amount = safeDecimal(this.balances[this.counterAsset])
              .times(val).div(100).div(this.buy.price)
              .todp(getDp(this.baseAsset))
        } catch (e) {
        }
      }
    },
    sellPercent: {
      get() {
        let percent
        try {
          percent = safeDecimal(this.sell.amount).times(100).div(this.balances[this.baseAsset])
        } catch (e) {
          percent = 0
        }
        // return more than 100, cause it to call set 100
        return parseInt(percent > 100 ? 100 : percent)
      },
      set(val) {
        try {
          this.sell.amount = safeDecimal(this.balances[this.baseAsset]).times(val).div(100)
              .todp(getDp(this.baseAsset))
        } catch (e) {
        }
      }
    }
  },
  data() {
    return {
      list: [
        ['BTC/IRR', 'ETH/IRR', 'BCH/IRR', 'LTC/IRR', 'USDT/IRR'],
        ['BTC/USDT', 'ETH/USDT', 'BCH/USDT', 'LTC/USDT'],
        ['ETH/BTC', 'BCH/BTC', 'LTC/BTC', 'BCH/ETH', 'LTC/ETH']],
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
        buySufficient: value => this.balances[this.counterAsset]?.gte(safeDecimal(this.buyTotal)) || 'اعتبار ناکافی',
        buyWalletExist: value => !!this.balances[this.baseAsset] || 'کیف پول ساخته نشده است',
        sellSufficient: value => this.balances[this.baseAsset]?.gte(safeDecimal(this.sell.amount)) || 'اعتبار ناکافی',
        sellWalletExist: value => !!this.balances[this.counterAsset] || 'کیف پول ساخته نشده است',
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
    sellRecordTotal(item) {
      return safeDecimal(item.amount).times(this.offersPrice(item))
          .todp(getDp(this.counterAsset))
    },
    buyRecordAmount(item) {
      return safeDecimal(item.amount).div(this.offersPrice(item))
    },
    offersPrice(item) {
      return safeDecimal(item.price_r.n).div(item.price_r.d)
    },
    select(action, item) {
      if (action === 'sell') {
        this.sell.price = this.offersPrice(item)
        this.sell.amount = this.buyRecordAmount(item)
      } else if (action === 'buy') {
        this.buy.price = this.offersPrice(item)
        this.buy.amount = parseFloat(item.amount)
      }
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