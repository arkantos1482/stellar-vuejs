<template>
  <div class="mx-n12">
    <div class="d-flex align-items-stretch">

      <!--    SELL-->
      <v-card max-width="27%" class="pa-2">
        <v-simple-table dense fixed-header>
          <thead>
          <tr>
            <th>{{ priceLabel }}</th>
            <th>{{ amountLabel }}</th>
            <th>{{ totalLabel }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in offers.asks" :key="index">
            <td class="red--text">{{ parseFloat(item.price) }}</td>
            <td>{{ parseFloat(item.amount) }}</td>
            <td>{{ parseFloat(item.price) * parseFloat(item.amount) }}</td>
          </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <!--    MAIN-->
      <v-card class="mx-4 px-4" max-width="46%">
        <v-row justify="center">
          <v-col cols="3">
            <v-select @change="myOffers" v-model="baseAsset" :items="assets"
                      dense outlined filled/>
          </v-col>
          <v-col cols="3">
            <v-select @change="myOffers" v-model="counterAsset" :items="assets"
                      dense outlined filled/>
          </v-col>
        </v-row>

        <v-row justify="center">
          <v-col cols="6" class="px-2">
            <p>{{ counterBalance }}</p>
            <a-text-field v-model="buy.amount" :label="amountLabel"/>
            <a-text-field v-model="buy.price" :label="priceLabel"/>
            <a-text-field readonly :value="buy.amount*buy.price" :label="totalLabel"/>
            <v-btn block @click="doBuy" :loading="l.buy" color="green">خرید</v-btn>
          </v-col>

          <v-col cols="6" class="px-2">
            <p>{{ baseBalance }}</p>
            <a-text-field v-model="sell.amount" :label="amountLabel"/>
            <a-text-field v-model="sell.price" :label="priceLabel"/>
            <a-text-field readonly :value="sell.amount*sell.price" :label="totalLabel"/>
            <v-btn block @click="doSell" :loading="l.sell" color="red">فروش</v-btn>
          </v-col>
        </v-row>
      </v-card>

      <!--    BUY-->
      <v-card max-width="27%" class="pa-2">
        <v-simple-table dense fixed-header>
          <thead>
          <tr>
            <th>{{ priceLabel }}</th>
            <th>{{ amountLabel }}</th>
            <th>{{ totalLabel }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in buyOffers" :key="index">
            <td class="green--text">{{ parseFloat(item.price) }}</td>
            <td>{{ parseFloat(item.amount) }}</td>
            <td>{{ parseFloat(item.price) * parseFloat(item.amount) }}</td>
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

export default {
  components: {ActiveOffers, ATextField},
  errorCaptured(err, vm, info) {
    this.l.buy = false
    this.l.sell = false
  },
  name: "Offers",
  computed: {
    baseBalance() {
      return `موجودی (${this.baseAsset}) : ${parseFloat(this.balances[this.baseAsset])}`
    },
    counterBalance() {
      return `موجودی (${this.counterAsset}) : ${parseFloat(this.balances[this.counterAsset])}`
    },
    amountLabel() {
      return 'مقدار ( ' + this.baseAsset + ' )'
    },
    priceLabel() {
      return 'قیمت واحد ( ' + this.counterAsset + ' )'
    },
    totalLabel() {
      return 'قیمت مجموع ( ' + this.counterAsset + ' )'
    },
    buyOffers() {
      return collect(this.offers.bids)
          .map(item => ({
            price: item.price,
            amount: (parseFloat(item.amount) / parseFloat(item.price_r.n)).toFixed(3)
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
</style>