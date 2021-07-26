<template>
  <div>
    <a-row>
      <CryptoMinMaxCard coin="BTC" :stat="stats['btc-rls']"/>
      <CryptoMinMaxCard coin="ETH" :stat="stats['eth-rls']"/>
      <CryptoMinMaxCard coin="LTC" :stat="stats['ltc-rls']"/>
      <CryptoMinMaxCard coin="USDT" :stat="stats['usdt-rls']"/>
      <!--      <CryptoMinMaxCard coin="BCH" :stat="stats['bch-rls']"/>-->
      <CryptoMinMaxCard coin="AMN" :stat="preMadeStat.AMN"/>
      <CryptoMinMaxCard coin="ART" :stat="preMadeStat.ART"/>
      <CryptoMinMaxCard coin="SHA" :stat="preMadeStat.SHA"/>
      <CryptoMinMaxCard coin="ZRK" :stat="preMadeStat.ZRK"/>
    </a-row>

    <a-row class="align-stretch">
      <!--      ACCOUNT-->
      <v-col cols="6">
        <v-card width="100%" height="100%" class="pa-6">
          <card-title-with-chevron icon="mdi-account" title="وضعیت حساب کاربری"/>
          <v-divider class="my-6"/>
          <RowItem title="برداشت روزانه ریال"
                   :value="azMaker(rialLimits.daily_usage,rialLimits.daily_max_usage)"/>
          <RowItem title="برداشت روزانه رمزارز"
                   :value="azMaker(cryptoLimits.daily_usage,cryptoLimits.daily_max_usage)"/>
          <RowItem title="برداشت ماهانه ریال"
                   :value="azMaker(rialLimits.monthly_usage,rialLimits.monthly_max_usage)"/>
          <RowItem title="برداشت ماهانه رمزارز"
                   :value="azMaker(cryptoLimits.monthly_usage,cryptoLimits.monthly_max_usage)"/>
          <RowItem title="کارمزد" :value="cryptoLimits.fee_ratio"/>
          <RowItem title="ارزش معاملات سی روز" :value="cryptoLimits.trade_volume_past_month"/>
          <v-divider class="my-6"/>
          <p class="primary--text">سطح کاربری:</p>
          <a-row class="justify-center align-center">
            <v-icon>mdi-star</v-icon>
            <p class="mb-0 mx-4">{{ accessLevel }}</p>
            <v-btn color="primary" outlined small class="px-4" to="/users/me">ارتقا</v-btn>
          </a-row>
        </v-card>
      </v-col>

      <!--      WALLET-->
      <v-col cols="6">
        <v-card width="100%" height="100%" class="pa-6">
          <card-title-with-chevron icon="mdi-wallet" title="کیف پول های شما"/>
          <v-divider class="my-6"/>

          <v-row>
            <v-col cols="6">
              <dash-wallet-row v-for="(item,index) in coinList" :balance="balances[item]" :key="index"/>
            </v-col>

            <v-col cols="6">
              <wallet-doughnut :chartData="chartData" :options="options"/>
            </v-col>
          </v-row>
          <v-divider class="my-6"/>
          <p class="primary--text">ارزش تخمینی دارایی ها:</p>
          <RowItem title="ارزش تخمینی به تومان" :value="adjustDp(totalBalance,'IRR')|tomanSuffix"/>
          <!--          <RowItem title="پیشنهادهای خرید" :value="totalBalance|tomanSuffix"/>-->
          <!--          <RowItem title="پیشنهادهای فروش" :value="totalBalance|tomanSuffix"/>-->
        </v-card>
      </v-col>
    </a-row>


    <a-row class="align-stretch">
      <v-col cols="6">
        <v-card width="100%" height="100%" class="pa-6">
          <card-title-with-chevron icon="mdi-clipboard-text-play" title="سفارشات در جریان"/>
          <v-divider class="mt-6"/>
          <my-active-offers-table/>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card width="100%" height="100%" class="pa-6">
          <card-title-with-chevron icon="mdi-clipboard-text" title="معاملات اخیر"/>
          <v-divider class="mt-6"/>
          <my-trades-table/>
        </v-card>
      </v-col>
    </a-row>
  </div>
</template>

<script>
import RowItem from "@/components/RowItem";
import DashboardCardTitle from "@/components/CardTitleWithChevron";
import MyTrades from "@/pages/trades/_userId";
import {safeDecimal} from "@/models/NumberUtil";
import {getDp} from "@/models/cryptoPrecision";

export default {
  name: "index",
  components: {MyTrades, DashboardCardTitle, RowItem},
  filters: {
    tomanSuffix: (val) => val + " تومان"
  },
  computed: {
    coinList: () => ['AMN', 'ART', 'SHA', 'ZRK', 'TLS', 'WIT', 'IRR', 'BTC',
      'ETH', 'LTC', 'USDT', 'TRX', 'BCH', 'BNB', 'DRC'],
    options() {
      return {}
    },
    balances() {
      return this.$store.state.balances.list
    },
    preMadeStat() {
      return {
        AMN: {
          dayLow: '1080000',
          dayHigh: '1440000',
          dayLatest: '',
          dayChange: '',
        },
        ART: {
          dayLow: '826000',
          dayHigh: '1101100',
          dayLatest: '',
          dayChange: '',
        },
        SHA: {
          dayLow: '3360000',
          dayHigh: '4480000',
          dayLatest: '',
          dayChange: '',
        },
        ZRK: {
          dayLow: '1350000',
          dayHigh: '2500000',
          dayLatest: '',
          dayChange: '',
        },
      }
    }
  },
  data() {
    return {
      toTomanList: [],
      chartData: '',
      accessLevel: '',
      stats: '',
      rialLimits: {},
      cryptoLimits: {},
      totalBalance: ''
    }
  },
  mounted() {
    this.$axios.$get('/profiles/me')
        .then(res => this.accessLevel = res.access_level)

    this.$axios.$get('/to-toman-list')
        .then(res => {
          let toTomanList = res;
          let balances = this.$store.state.balances.list
          let array = JSON.parse(JSON.stringify(balances))
          let nonZeroKeys = Object.keys(array)?.filter(key => balances[key].balance != 0 && key != 'undefined')
          let values = nonZeroKeys?.map(key => this.adjustDp(balances[key].balance, 'IRR') * toTomanList[key])
          // console.log(this.toTomanList)
          // console.log(values)

          this.chartData = {
            // labels: [
            //   'Red',
            //   'Blue',
            //   'Yellow'
            // ],
            labels: nonZeroKeys,
            datasets: [{
              label: 'My First Dataset',
              // data: [300, 50, 100],
              data: values,
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(255, 23, 86)',
                'rgb(23, 205, 150)',
                'rgb(88,64,5)',
                'rgb(161,1,205)',
                'rgb(111,102,81)',
                'rgb(194,213,83)',
                'rgb(175,136,40)'
              ],
              hoverOffset: 4
            }]
          }
          console.log(this.chartData)
        })

    this.$axios.$post('/access/limits/remained', {resource: 'crypto'})
        .then(res => this.cryptoLimits = res)
    this.$axios.$post('/access/limits/remained', {resource: 'irr'})
        .then(res => this.rialLimits = res)

    this.$axios.$get('/balances/toToman/me')
        .then(res => this.totalBalance = res)

    this.$axios.$get('https://api.nobitex.ir/market/stats?srcCurrency=btc,eth,ltc,usdt,bch,bnb,eos,xlm,etc,trx,pmn,doge&dstCurrency=rls,usdt')
        .then(res => this.stats = res.stats)
  },
  methods: {
    azMaker(first, second) {
      if (first === undefined || second === undefined) return ''
      return first + ' از ' + second
    },
    adjustDp(val, type) {
      return safeDecimal(val).todp(getDp(type))
    }
  }
}
</script>
