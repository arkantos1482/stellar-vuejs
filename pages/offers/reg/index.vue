<template>
  <div>
    <!--    TOP (OFFER-REG + SELL/BUY + CHART-BAR-->
    <a-row class="align-stretch">
      <!--      OFFER-REG-->
      <v-col cols=3>
        <v-card class="pa-6" width=100% height="100%">
          <card-title-with-chevron simple title="ثبت سفارش" icon="mdi-basket" class="mb-6"/>
          <v-btn-toggle v-model="exchangeAction" rounded dense
                        :color="exchangeAction === 'buy' ? 'success':'error'">
            <v-btn value="buy" class="px-12">خرید</v-btn>
            <v-btn value="sell" class="px-12">فروش</v-btn>
          </v-btn-toggle>
          <v-divider class="my-4"/>
          <!--          <v-tabs class="mb-6">-->
          <!--            <v-tab>سفارش سریع</v-tab>-->
          <!--            <v-tab>limit</v-tab>-->
          <!--            <v-tab>Stop-Limit</v-tab>-->
          <!--            <v-tab>OCO</v-tab>-->
          <!--          </v-tabs>-->
          <div v-if="exchangeAction === 'buy'">
            <div class="d-flex justify-space-between pb-6">
              <!--              <p class="ma-0"><span>خرید </span>{{ baseAsset | toFarsiCoin }}</p>-->
              <p @click="buyPercent=100" class="pointer mb-0 grey--text">
                <v-icon color="grey">mdi-wallet</v-icon>
                {{ balances[counterAsset]|toFloat|separated }}
                <span>{{ counterAsset|irtFix }}</span>
              </p>
            </div>

            <v-form v-model="buyForm" @submit.prevent="doBuy" class="mt-3">
              <order-text-field :type="baseAsset" class="mt-n4" :rules="[rules.buyWalletExist]"
                                v-model="buy.amount" prepend="مقدار" :append="baseAsset|irtFix"/>
              <order-text-field :type="counterAsset" v-model="buy.price" prepend="قیمت" :append="counterAsset|irtFix"/>
              <v-slider class="mt-n4" color="accent" track-color="accent lighten-4"
                        v-model="buyPercent"
                        min="0" thumb-label/>
              <p class="pointer px-2 mb-3 mt-n3" @click="buy.price=sellBestPrice">پایین ترین پیشنهاد فروش:
                <span>{{ sellBestPrice|toFloat|separated }}</span></p>
              <order-text-field :type="counterAsset" :rules="[rules.buySufficient]"
                                class="mt-0" readonly :value="buyTotal" prepend="مجموع"
                                :append="counterAsset|irtFix"/>
              <v-btn depressed small class="white--text py-4 mt-n3" block color="success"
                     type="submit" :loading="l.buy">خرید
              </v-btn>
            </v-form>
          </div>

          <div v-else-if="exchangeAction === 'sell'">
            <div class="d-flex justify-space-between pb-6">
              <!--              <p class="ma-0"><span>فروش </span>{{ baseAsset | toFarsiCoin }}</p>-->
              <p @click="sellPercent=100" class="pointer mb-0 primary--text">
                <v-icon color="grey">mdi-wallet</v-icon>
                {{ balances[baseAsset]|toFloat|separated }}
                <span>{{ baseAsset|irtFix }}</span>
              </p>
            </div>

            <v-form v-model="sellForm" @submit.prevent="doSell" class="mt-3">
              <order-text-field :type="counterAsset" :rules="[rules.sellWalletExist]"
                                v-model="sell.price" prepend="قیمت"/>
              <order-text-field :type="baseAsset" class="mt-n4" :rules="[rules.sellSufficient]"
                                v-model="sell.amount" prepend="مقدار" :append="baseAsset|irtFix"/>
              <v-slider class="mt-n4" color="accent" track-color="accent lighten-4"
                        v-model="sellPercent"
                        min="0" thumb-label/>
              <p class="pointer px-2 mb-3 mt-n3" @click="sell.price=buyBestPrice">بالاترین پیشنهاد خرید:
                <span>{{ buyBestPrice|toFloat|separated }}</span></p>
              <order-text-field :type="counterAsset" class="mt-0" readonly :value="sellTotal" prepend="مجموع"
                                :append="counterAsset|irtFix"/>
              <v-btn depressed small class="white--text py-4 mt-n3" block color="error"
                     type="submit" :loading="l.sell">فروش
              </v-btn>
            </v-form>
          </div>
          <!--          </div>-->
        </v-card>
      </v-col>

      <!--      SELL/BUY + CHART-BAR-->
      <v-col cols="9">
        <!--        TITLE-->
        <v-card width="100%">
          <a-row class="justify-start">
            <v-col cols="4">
              <v-tabs v-model="tabIndex">
                <v-tab>تومان</v-tab>
                <v-tab>تتر</v-tab>
                <!--            <v-tab>رمزارز به رمزارز</v-tab>-->
              </v-tabs>
            </v-col>
            <v-divider vertical/>
            <v-select v-model="pairAsset" :items="pairAssetList" item-text="text" item-value="value"
                      dense filled solo flat/>
          </a-row>
        </v-card>


        <!--        BODY (SELL/BUY + CHART-BAR)-->
        <a-row class="align-stretch">

          <!--   SELL/BUY-->
          <v-col cols="4">
            <v-card class="pa-6" height="100%" width="100%">
              <card-title-with-chevron simple icon="mdi-chart-bar" title="لیست قیمت ها"/>
              <!--    SELL-->
              <v-simple-table dense fixed-header>
                <thead>
                <tr>
                  <th class="small-font text-body-1" style="font-family: serif">{{ priceLabel }}</th>
                  <th class="small-font text-body-1">{{ unitNumberLabel }}</th>
                  <th class="small-font text-body-1">{{ amountLabel }}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in sellOffers" :key="OrderReg" class="pointer text-body-1"
                    @click="select('buy',item)">
                  <td class="error--text" style="font-size: 1.4rem">{{ offersPrice(item)|separated }}</td>
                  <td style="font-size: 1.4rem">{{ item.amount|toFloat|separated }}</td>
                  <td style="font-size: 1.4rem">{{ sellRecordTotal(item)|separated }}</td>
                </tr>
                </tbody>
              </v-simple-table>

              <!--    BUY-->
              <v-simple-table dense fixed-header>
                <thead>
                <tr>
                  <th class="small-font text-body-1">{{ priceLabel }}</th>
                  <th class="small-font text-body-1">{{ unitNumberLabel }}</th>
                  <th class="small-font text-body-1">{{ amountLabel }}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in buyOffers" :key="OrderReg"
                    class="pointer text-body-1"
                    @click="select('sell',item)">
                  <td class="success--text" style="font-size: 1.4rem">{{ offersPrice(item)|separated }}</td>
                  <td style="font-size: 1.4rem">{{ buyRecordAmount(item)|separated }}</td>
                  <td style="font-size: 1.4rem">{{ item.amount|toFloat|separated }}</td>
                </tr>
                </tbody>
              </v-simple-table>
            </v-card>
          </v-col>

          <!--    CHART-BAR-->
          <v-col cols="8">
            <!--            <v-card class="mx-4 pa-2" ref="card">-->
            <t-v-chart-container :symbol="pairAsset|removeSlash"/>
            <!--            </v-card>-->
          </v-col>
        </a-row>
      </v-col>
    </a-row>

    <!--    BOTTOM-->
    <a-row class="align-stretch">
      <v-col cols=3>
        <v-card class="pa-6" height="100%">
          <card-title-with-chevron simple icon="mdi-clipboard-text-play" title="دارایی ها"/>
          <v-btn small outlined color="primary">واریز</v-btn>
          <v-btn small outlined color="primary">برداشت</v-btn>
        </v-card>
      </v-col>

      <v-col cols="3">
        <pair-asset-trades :base="baseAsset" :counter="counterAsset"/>
      </v-col>

      <v-col cols="6">
        <v-card width="100%" height="100%" class="pa-6">
          <card-title-with-chevron simple icon="mdi-clipboard-text-play" title="سفارشات در جریان"/>
          <my-active-offers-table/>
        </v-card>
      </v-col>
    </a-row>
  </div>
</template>

<script>
import collect from "collect.js";
import ActiveOffers from "@/pages/offers/active/_userId";
import {TradingVue, DataCube} from 'trading-vue-js'
import {mapActions} from "vuex";
import OrderTextField from "@/components/OrderTextField";
import {safeDecimal} from "@/models/NumberUtil";
import {getDp} from "@/models/cryptoPrecision";
import PairAssetTrades from "@/pages/trades";
import TVChartContainer from "@/components/TVChartContainer";

export default {
  components: {TVChartContainer, PairAssetTrades, OrderTextField, ActiveOffers, TradingVue},
  errorCaptured(err, vm, info) {
    this.l.buy = false
    this.l.sell = false
  },
  filters: {
    removeSlash(val) {
      return val.replace('/', '').replace('IRR', 'IRT')
    }
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
      return 'قیمت (' + this.$options.filters.irtFix(this.counterAsset) + ')'
    },
    unitNumberLabel() {
      return 'مقدار (' + this.$options.filters.irtFix(this.baseAsset) + ')'
    },
    amountLabel() {
      return 'مجموع (' + this.$options.filters.irtFix(this.counterAsset) + ')'
    },
    tradingVueLabel() {
      return this.$options.filters.irtFix(this.baseAsset)
          + '/' + this.$options.filters.irtFix(this.counterAsset)
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
    },
    tradeData() {
      return new DataCube(this.tradeData2)
    }
  },
  data() {
    return {
      exchangeAction: 'buy',
      list: [
        // ['BTC/IRR', 'ETH/IRR', 'BCH/IRR', 'LTC/IRR', 'USDT/IRR'],
        ['ART/IRR', 'ZRK/IRR'],
        // ['BTC/USDT', 'ETH/USDT', 'BCH/USDT', 'LTC/USDT'],
        ['ART/USDT', 'ZRK/USDT',],
        ['ETH/BTC', 'BCH/BTC', 'LTC/BTC', 'BCH/ETH', 'LTC/ETH']],
      offers: [],
      tabIndex: 0,
      // pairAsset: 'BTC/IRR',
      pairAsset: 'ART/IRR',
      // baseAsset: 'BTC',
      baseAsset: 'ART',
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
      chartConfig: {
        SBMIN: 60,       // Minimal sidebar px
        SBMAX: Infinity, // Max sidebar, px
        TOOLBAR: 57,     // Toolbar width px
        TB_ICON: 25,     // Toolbar icon size px
        TB_ITEM_M: 6,    // Toolbar item margin px
        TB_ICON_BRI: 1,  // Toolbar icon brightness
        TB_ICON_HOLD: 420, // ms, wait to expand
        TB_BORDER: 1,    // Toolbar border px
        TB_B_STYLE: 'dotted', // Toolbar border style
        TOOL_COLL: 7,    // Tool collision threshold
        EXPAND: 0.15,    // %/100 of range
        CANDLEW: 0.6,    // %/100 of step
        GRIDX: 100,      // px
        GRIDY: 47,       // px
        BOTBAR: 28,      // px
        PANHEIGHT: 22,   // px
        DEFAULT_LEN: 50, // candles
        MINIMUM_LEN: 2,  // candles,
        MIN_ZOOM: 5,    // candles
        MAX_ZOOM: 1000,  // candles,
        VOLSCALE: 0.15,  // %/100 of height
        UX_OPACITY: 0.9, // Ux background opacity
        ZOOM_MODE: 'tl', // 'tv' or 'tl'
        L_BTN_SIZE: 21,  // Legend Button size, px
        L_BTN_MARGIN: '-6px 0 -6px 0', // css margin
        SCROLL_WHEEL: 'prevent', // 'pass', 'click'
      },
      tradeData2: {
        chart: {
          data: [],
          settings: {},
          grid: {}
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
      this.tradeData2.chart.data = collect(result)
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