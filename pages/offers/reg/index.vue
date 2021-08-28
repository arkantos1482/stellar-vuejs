<template>
  <div>
    <!--    TOP (OFFER-REG + SELL/BUY + CHART-BAR-->
    <a-row class="align-stretch">
      <!--      OFFER-REG-->
      <v-col cols=3>
        <v-card class="pa-6" width=100% height="100%">
          <card-title-with-chevron simple title="ثبت سفارش" icon="mdi-basket" class="mb-6"/>
          <v-btn-toggle mandatory v-model="exchangeAction" rounded dense
                        :color="exchangeAction === 'buy' ? 'success':'error'">
            <v-btn rounded value="buy" class="px-12" @click="resetValid">خرید</v-btn>
            <v-btn rounded value="sell" class="px-12" @click="resetValid">فروش</v-btn>
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
              <p v-if="balances[counterAsset]" @click="buyPercent=100" class="pointer mb-0 grey--text">
                <v-icon color="grey">mdi-wallet</v-icon>
                {{ adjustDp(balances[counterAsset].actual_balance, counterAsset)|toFloat|separated }}
                <span>{{ counterAsset|irtFix }}</span>
              </p>
            </div>

            <v-form v-model="buyForm" @submit.prevent="doBuy" class="mt-3" ref="buy_form_ref">
              <order-text-field :base="baseAsset"
                                class="mt-n4" :rules="[rules.required,rules.buyWalletExist]"
                                v-model="buy.amount" prepend="مقدار" :append="baseAsset|irtFix"/>
              <order-text-field marketdp :base="baseAsset" :ctr="counterAsset"
                                v-model="buy.price" prepend="قیمت" :append="counterAsset|irtFix"
                                :rules="[rules.required]"/>
              <v-slider class="mt-n4" color="primary" track-color="primary darken-4"
                        v-model="buyPercent"
                        min="0" thumb-label/>
              <p class="pointer px-2 mb-3 mt-n3" @click="buy.price=sellBestPrice">پایین ترین پیشنهاد فروش:
                <span>{{ sellBestPrice|toFloat|separated }}</span></p>
              <order-text-field marketdp :base="baseAsset" :ctr="counterAsset"
                                :rules="[rules.buySufficient]"
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
              <p v-if="balances[baseAsset]" @click="sellPercent=100" class="pointer mb-0 grey--text">
                <v-icon color="grey">mdi-wallet</v-icon>
                {{ adjustDp(balances[baseAsset].actual_balance, baseAsset)|toFloat|separated }}
                <span>{{ baseAsset|irtFix }}</span>
              </p>
            </div>

            <v-form v-model="sellForm" @submit.prevent="doSell" class="mt-3" ref="sell_form_ref">
              <order-text-field marketdp :base="baseAsset" :ctr="counterAsset"
                                :rules="[rules.sellWalletExist,rules.required]"
                                v-model="sell.price" prepend="قیمت" :append="counterAsset|irtFix" class="mt-n4"/>
              <order-text-field :base="baseAsset"
                                :rules="[rules.sellSufficient,rules.required]"
                                v-model="sell.amount" prepend="مقدار" :append="baseAsset|irtFix"/>
              <v-slider class="mt-n4" color="primary" track-color="primary darken-4"
                        v-model="sellPercent"
                        min="0" thumb-label/>
              <p class="pointer px-2 mb-3 mt-n3" @click="sell.price=buyBestPrice">بالاترین پیشنهاد خرید:
                <span>{{ buyBestPrice|toFloat|separated }}</span></p>
              <order-text-field marketdp :base="baseAsset" :ctr="counterAsset"
                                class="mt-0" readonly :value="sellTotal" prepend="مجموع"
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
      <v-col cols="9" class="pa-0">
        <!--        TITLE-->
        <v-col>
          <v-card width="100%">
            <a-row class="justify-start align-center">

              <v-btn-toggle v-model="tabIndex" mandatory color="primary" dense borderless tile class="pa-4">
                <v-btn text value="0">تومان</v-btn>
                <v-btn text value="1">تتر</v-btn>
                <v-btn text value="2">رمزارز به رمزارز</v-btn>
              </v-btn-toggle>

              <v-divider vertical inset class="py-4"/>
              <div style="width: 144px">
                <v-select class="d-block compact" v-model="pairAsset" :items="pairAssetList" item-text="text"
                          item-value="value"
                          dense filled solo flat/>
              </div>
            </a-row>
          </v-card>
        </v-col>

        <!--        BODY (SELL/BUY + CHART-BAR)-->
        <a-row class="align-stretch">

          <!--   SELL/BUY-->
          <v-col cols="4">
            <v-card class="pa-6" height="100%" width="100%">
              <a-row class="align-center">
                <v-icon color="primary">mdi-chart-bar</v-icon>
                <p class="primary--text mb-0 mx-2">لیست قیمت ها</p>
                <v-spacer/>
              </a-row>
              <!--    SELL-->
              <v-simple-table dense fixed-header class="mt-4">
                <thead>
                <tr>
                  <th class="small-font text-body-2" style="font-family: serif">{{ priceLabel }}</th>
                  <th class="small-font text-body-2">{{ unitNumberLabel }}</th>
                  <th class="small-font text-body-2">{{ amountLabel }}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in sellOffers" :key="index" class="pointer text-body-1"
                    @click="select('buy',item)">
                  <td class="error--text" style="font-size: 1.4rem">
                    {{ adjustMarketDp(offersPrice(item), baseAsset, counterAsset)|separated }}
                  </td>
                  <td style="font-size: 1.4rem">{{ adjustDp(item.amount, baseAsset)|toFloat|separated }}</td>
                  <td style="font-size: 1.4rem">
                    {{ adjustDp(sellRecordTotal(item), baseAsset, counterAsset)|separated }}
                  </td>
                </tr>
                </tbody>
              </v-simple-table>

              <!--    BUY-->
              <v-simple-table dense fixed-header class="mt-4">
                <thead>
                <tr>
                  <th class="small-font text-body-2">{{ priceLabel }}</th>
                  <th class="small-font text-body-2">{{ unitNumberLabel }}</th>
                  <th class="small-font text-body-2">{{ amountLabel }}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in buyOffers" :key="index"
                    class="pointer text-body-1"
                    @click="select('sell',item)">
                  <td class="success--text" style="font-size: 1.4rem">
                    {{ adjustMarketDp(offersPrice(item), baseAsset, counterAsset)|separated }}
                  </td>
                  <td style="font-size: 1.4rem">{{ adjustDp(buyRecordAmount(item), baseAsset)|separated }}</td>
                  <td style="font-size: 1.4rem">
                    {{ adjustDp(item.amount, baseAsset, counterAsset)|toFloat|separated }}
                  </td>
                </tr>
                </tbody>
              </v-simple-table>
            </v-card>
          </v-col>

          <!--    CHART-BAR-->
          <v-col cols="8">
            <!--            <v-card class="mx-4 pa-2" ref="card">-->
            <t-v-chart-container :symbol="pairAsset|irtFix"/>
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
import {getDp, getMarketDp} from "@/models/cryptoPrecision";
import PairAssetTrades from "@/pages/trades";
import TVChartContainer from "@/components/TVChartContainer";

export default {
  components: {TVChartContainer, PairAssetTrades, OrderTextField, ActiveOffers, TradingVue},
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
            text: this.$options.filters.irtFix(item),
            // text: item,
            value: item
          })).all()
    },
    balances() {
      return this.$store.state.balances.list
    },
    baseBalance() {
      return `موجودی (${this.baseAsset}) : ${parseFloat(this.balances[this.baseAsset].actual_balance)}`
    },
    counterBalance() {
      return `موجودی (${this.counterAsset}) : ${parseFloat(this.balances[this.counterAsset].actual_balance)}`
    },
    priceLabel() {
      // return 'قیمت (' + this.$options.filters.irtFix(this.counterAsset) + ')'
      return 'قیمت'
    },
    unitNumberLabel() {
      // return 'مقدار (' + this.$options.filters.irtFix(this.baseAsset) + ')'
      return 'مقدار'
    },
    amountLabel() {
      // return 'مجموع (' + this.$options.filters.irtFix(this.counterAsset) + ')'
      return 'مجموع'
    },
    tradingVueLabel() {
      return this.$options.filters.irtFix(this.baseAsset)
          + '/' + this.$options.filters.irtFix(this.counterAsset)
    },
    buyOffers() {
      return collect(this.offers.bids)
          .map(item => ({
            price: parseFloat(item.price),
            price_r: item.price_r,
            amount: parseFloat(item.amount)
          }))
          .sortByDesc('price')
    },
    sellOffers() {
      return collect(this.offers.asks)
          .map(item => ({
            price: parseFloat(item.price),
            price_r: item.price_r,
            amount: parseFloat(item.amount)
          }))
          .sortByDesc('price')
    },
    buyBestPrice() {
      if (this.buyOffers.isNotEmpty())
        return this.offersPrice(this.buyOffers.first())
    },
    sellBestPrice() {
      if (this.sellOffers.isNotEmpty())
        return this.offersPrice(this.sellOffers.last())
    },
    sellTotal() {
      return safeDecimal(this.sell.amount).times(safeDecimal(this.sell.price))
          .todp(getMarketDp(this.baseAsset, this.counterAsset))
    },
    buyTotal() {
      return safeDecimal(this.buy.amount).times(safeDecimal(this.buy.price))
          .todp(getMarketDp(this.baseAsset, this.counterAsset))
    },
    buyPercent: {
      get() {
        let percent
        try {
          percent = safeDecimal(this.buyTotal).times(100).div(this.balances[this.counterAsset].actual_balance)
        } catch (e) {
          percent = 0
        }
        // return more than 100, cause it to call set 100
        return parseInt(percent > 100 ? 100 : percent)
      },
      set(val) {
        try {
          this.buy.amount = safeDecimal(this.balances[this.counterAsset].actual_balance)
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
          percent = safeDecimal(this.sell.amount).times(100).div(this.balances[this.baseAsset].actual_balance)
        } catch (e) {
          percent = 0
        }
        // return more than 100, cause it to call set 100
        return parseInt(percent > 100 ? 100 : percent)
      },
      set(val) {
        try {
          this.sell.amount = safeDecimal(this.balances[this.baseAsset].actual_balance).times(val).div(100)
              .todp(getDp(this.baseAsset))
        } catch (e) {
        }
      }
    },
  },
  data() {
    return {
      exchangeAction: 'buy',
      list: [
        ['DRC/IRR', 'BTC/IRR', 'ETH/IRR', 'BNB/IRR', 'BCH/IRR', 'LTC/IRR', 'USDT/IRR', 'TRX/IRR'],
        ['DRC/USDT', 'BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'BCH/USDT', 'LTC/USDT', 'TRX/USDT'],
        ['DRC/BNB', 'ETH/BTC', 'TRX/BTC', 'BCH/BTC', 'LTC/BTC', 'BNB/BTC',
          'TRX/ETH', 'BCH/ETH', 'LTC/ETH', 'BNB/ETH',
          'BNB/BCH', 'TRX/BNB',]],
      offers: [],
      tabIndex: 0,
      pairAsset: 'DRC/IRR',
      baseAsset: 'DRC',
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
        buySufficient: value => this.balances[this.counterAsset]?.actual_balance?.gte(safeDecimal(this.buyTotal)) || 'اعتبار ناکافی',
        buyWalletExist: value => !!this.balances[this.baseAsset]?.actual_balance || 'کیف پول ساخته نشده است',
        sellSufficient: value => this.balances[this.baseAsset]?.actual_balance?.gte(safeDecimal(this.sell.amount)) || 'اعتبار ناکافی',
        sellWalletExist: value => !!this.balances[this.counterAsset]?.actual_balance || 'کیف پول ساخته نشده است',
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
      this.$refs.sell_form_ref.validate()
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
      this.$refs.buy_form_ref.validate()
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
    },
    startRecurrentJob() {
      this.interval.offers = setInterval(() => {
        this.refreshOffers()
      }, 20 * 1000);
      // this.interval.offers = setInterval(() => {
      //   this.refreshOffers()
      // }, 5 * 60 * 1000);
    },
    cleanUp() {
      if (this.interval.offers) clearInterval(this.interval.offers)
      // clearInterval(this.interval.trades)
    },
    onVizChange(e) {
      if (document.hidden) {
        this.cleanUp()
      } else {
        this.startRecurrentJob()
      }
    },
    resetValid() {
      this.$refs.sell_form_ref?.resetValidation()
      this.$refs.buy_form_ref?.resetValidation()
    },
    adjustDp(val, type) {
      return safeDecimal(val).todp(getDp(type))
    },
    adjustMarketDp(val, base, ctr) {
      return safeDecimal(val).todp(getMarketDp(base, ctr))
    }
  },
  mounted() {
    window.onresize = () => {
      this.windowWidth = window.innerWidth
    }
    this.$bus.$emit('drawer', false)

    this.refreshBalances()

    this.refreshOffers()
    this.startRecurrentJob()

    document.addEventListener('visibilitychange', this.onVizChange, false)
  },
  beforeDestroy() {
    this.cleanUp()
  }
}
</script>
<style>
.v-text-field--rounded {
  border-radius: 4px
}

.compact .v-text-field__details {
  display: none !important;
}

.small-font {
  white-space: nowrap;
}
</style>