<template>
  <div>
    <v-row>
      <!--      BUY      -->
      <v-col cols="6">
        <v-card outlined class="mb-4">
          <v-row>
            <v-col cols="6">
              <v-select @change="myOffers" v-model="buy.baseAsset" :items="assets" label="ارز خرید" class="mx-4"/>
            </v-col>
            <v-col cols="6">
              <v-select @change="myOffers" v-model="buy.counterAsset" :items="assets" label="ارز فروش" class="mx-4"/>
            </v-col>
          </v-row>
          <v-row>
            <v-text-field v-model="buy.amount" label="مقدار" class="mx-4"/>
            <v-text-field v-model="buy.price" label="قیمت واحد" class="mx-4"/>
          </v-row>
          <div class="text-center mb-4">
            <v-btn @click="doBuy" :loading="buy.loading">ثبت خرید</v-btn>
          </div>
        </v-card>

        <p class="text-center">پیشنهادهای فروش</p>
        <v-simple-table>
          <thead>
          <tr>
            <th>قیمت واحد(ارز فروش)</th>
            <th>مقدار (ارز خرید)</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in offers.asks" :key="index">
            <td>{{ item.price }}</td>
            <td>{{ item.amount }}</td>
          </tr>
          </tbody>
        </v-simple-table>
        <!--      <json-viewer dir="auto" :value="sell.offers"/>-->
      </v-col>

      <!--      SELL      -->
      <v-col cols="6">
        <v-card outlined class="mb-4">
          <v-row>
            <v-col cols="6">
              <v-select @change="myOffers" v-model="sell.baseAsset" :items="assets" label="ارز فروش" class="mx-4"/>
            </v-col>
            <v-col cols="6">
              <v-select @change="myOffers" v-model="sell.counterAsset" :items="assets" label="ارز خرید" class="mx-4"/>
            </v-col>
          </v-row>
          <v-row>
            <v-text-field v-model="sell.amount" label="مقدار" class="mx-4"/>
            <v-text-field v-model="sell.price" label="قیمت واحد" class="mx-4"/>
          </v-row>
          <div class="text-center mb-4">
            <v-btn @click="doSell" :loading="sell.loading">ثبت فروش</v-btn>
          </div>
        </v-card>

        <p class="text-center">پیشنهادهای خرید</p>
        <v-simple-table>
          <thead>
          <tr>
            <th>قیمت واحد(ارز خرید)</th>
            <th>مقدار (ارز فروش)</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in buyOffers" :key="index">
            <td>{{ item.price }}</td>
            <td>{{ item.amount }}</td>
          </tr>
          </tbody>
        </v-simple-table>
      </v-col>
    </v-row>
    <json-viewer dir="auto" :value="offers"/>
  </div>
</template>

<script>
import collect from "collect.js";

export default {
  name: "Offers",
  computed: {
    buyOffers() {
      return collect(this.offers.bids)
          .map(item => ({
            price: item.price,
            amount: (parseFloat(item.amount) / parseFloat(item.price_r.n)).toFixed(3)
          }))
    }
  },
  data() {
    return {
      assets: ['BTC', 'LTC', 'ETH'],
      offers: [],
      sell: {
        // offers: [],
        loading: false,
        baseAsset: 'BTC',
        counterAsset: 'ETH',
        amount: '',
        price: ''
      },
      buy: {
        // offers: [],
        loading: false,
        baseAsset: 'BTC',
        counterAsset: 'ETH',
        amount: '',
        price: ''
      },
    }
  },
  methods: {
    async doSell() {
      this.sell.loading = true
      await this.$axios.$post('/offers/sell',
          {sell: this.sell.baseAsset, buy: this.sell.counterAsset, amount: this.sell.amount, price: this.sell.price})
      this.sell.loading = false
      await this.myOffers()
      // await this.buyOffers()
    },
    async doBuy() {
      this.buy.loading = true
      await this.$axios.$post('/offers/buy',
          {buy: this.buy.baseAsset, sell: this.buy.counterAsset, amount: this.buy.amount, price: this.buy.price})
      this.buy.loading = false
      await this.myOffers()
      // await this.buyOffers()
    },
    async myOffers() {
      this.offers = (await this.$axios.$get('/offers-book', {
        params: {
          sell: this.sell.baseAsset,
          buy: this.sell.counterAsset
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
  async fetch() {
    await this.myOffers()
    // await this.buyOffers()

  }
}
</script>

<style scoped>

</style>