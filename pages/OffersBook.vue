<template>
  <v-row>
    <!--      SELL      -->
    <v-card outlined class="w-1/2">
      <json-viewer dir="auto" :value="sell.offers"/>
      <v-row>
        <v-select @change="onSellChanged" v-model="sell.fromAsset" :items="assets" label="ارز فروش" class="mx-4"/>
        <v-text-field v-model="sell.amount" label="مقدار" class="mx-4"/>
      </v-row>
      <v-row>
        <v-select @change="onSellChanged" v-model="sell.toAsset" :items="assets" label="ارز خرید" class="mx-4"/>
        <v-text-field v-model="sell.price" label="قیمت واحد" class="mx-4"/>
      </v-row>
      <v-btn @click="doSell" :loading="sell.loading">ثبت فروش</v-btn>
    </v-card>
    <!--      BUY      -->
    <v-card outlined class="w-1/2">
      <json-viewer dir="auto" :value="buy.offers"/>
      <v-row>
        <v-select @change="onBuyChanged" v-model="buy.fromAsset" :items="assets" label="ارز خرید" class="mx-4"/>
        <v-text-field v-model="buy.amount" label="مقدار" class="mx-4"/>
      </v-row>
      <v-row>
        <v-select @change="onBuyChanged" v-model="buy.toAsset" :items="assets" label="ارز فروش" class="mx-4"/>
        <v-text-field v-model="buy.price" label="قیمت واحد" class="mx-4"/>
      </v-row>
      <v-btn @click="doBuy" :loading="buy.loading">ثبت خرید</v-btn>
    </v-card>
  </v-row>
</template>

<script>
export default {
  name: "Offers",
  data() {
    return {
      assets: ['BTC', 'LTC', 'ETH'],
      sell: {
        offers: [],
        loading: false,
        fromAsset: 'BTC',
        toAsset: 'ETH',
        amount: '',
        price: ''
      },
      buy: {
        offers: [],
        loading: false,
        fromAsset: 'BTC',
        toAsset: 'ETH',
        amount: '',
        price: ''
      },
    }
  },
  methods: {
    async doSell() {
      this.sell.loading = true
      await this.$axios.$post('/offers/sell',
          {sell: this.sell.fromAsset, buy: this.sell.toAsset, amount: this.sell.amount, price: this.sell.price})
      this.sell.loading = false
    },
    async doBuy() {
      this.buy.loading = true
      await this.$axios.$post('/offers/buy',
          {sell: this.buy.toAsset, buy: this.buy.fromAsset, amount: this.buy.amount, price: this.buy.price})
      this.buy.loading = false
    },
    async onSellChanged() {
      this.sell.offers = (await this.$axios.$get('/offers-book', {
        params: {
          sell: this.sell.fromAsset,
          buy: this.sell.toAsset
        }
      }))
    },
    async onBuyChanged() {
      this.buy.offers = (await this.$axios.$get('/offers-book', {
        params: {
          sell: this.buy.toAsset,
          buy: this.buy.fromAsset
        }
      }))
    }
  },
  async fetch() {
    await this.onSellChanged()
    await this.onBuyChanged()

  }
}
</script>

<style scoped>

</style>