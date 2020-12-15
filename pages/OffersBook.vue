<template>
  <div>
    <v-row justify="center">
      <v-col cols="3">
        <v-select filled @change="myOffers" v-model="baseAsset" :items="assets" class="mx-4"/>
      </v-col>
      <v-col cols="3">
        <v-select filled @change="myOffers" v-model="counterAsset" :items="assets" class="mx-4"/>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6">
        <v-card outlined class="mb-4 p-16">
          <v-row>
            <a-text-field v-model="buy.amount" :label="amountLabel" class="mx-4"/>
            <a-text-field v-model="buy.price" :label="priceLabel" class="mx-4"/>
          </v-row>
          <div class="text-center mb-4">
            <v-btn @click="doBuy" :loading="l.buy" color="green">ثبت خرید</v-btn>
          </div>
        </v-card>

        <p class="text-center mt-8 mb-1">پیشنهادهای فروش</p>
        <v-simple-table>
          <thead class="red">
          <tr>
            <th>{{ priceLabel }}</th>
            <th>{{ amountLabel }}</th>
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

      <v-col cols="6">
        <v-card outlined class="mb-4">
          <v-row>
            <a-text-field v-model="sell.amount" :label="amountLabel" class="mx-4"/>
            <a-text-field v-model="sell.price" :label="priceLabel" class="mx-4"/>
          </v-row>
          <div class="text-center mb-4">
            <v-btn @click="doSell" :loading="l.sell" color="red">ثبت فروش</v-btn>
          </div>
        </v-card>

        <p class="text-center mt-8 mb-1">پیشنهادهای خرید</p>
        <v-simple-table>
          <thead class="green">
          <tr>
            <th>{{ priceLabel }}</th>
            <th>{{ amountLabel }}</th>
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
  errorCaptured(err, vm, info) {
    this.l.buy = false
    this.l.sell = false
  },
  name: "Offers",
  computed: {
    amountLabel() {
      return 'مقدار ' + this.baseAsset
    },
    priceLabel() {
      return 'قیمت واحد ' + this.counterAsset
    },
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
      assets: ['BTC', 'LTC', 'ETH', 'USDT', 'IRR', 'BCH', 'AMIN', 'BARG',],
      offers: [],
      baseAsset: 'BTC',
      counterAsset: 'ETH',
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
    // await this.buyOffers()

  }
}
</script>

<style scoped>

</style>