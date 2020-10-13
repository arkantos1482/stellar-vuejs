<template>
  <div>
    <json-viewer dir="auto" :value="offers"/>
    <v-row>
      <!--      SELL      -->
      <v-card outlined>
        <v-col>
          <v-row>
            <v-select v-model="sell.fromAsset" :items="assets" placeholder="ارز فروش" class="mx-4"/>
            <v-text-field v-model="sell.amount" placeholder="مقدار" class="mx-4"/>
          </v-row>
          <v-row>
            <v-select v-model="sell.toAsset" :items="assets" placeholder="ارز خرید" class="mx-4"/>
            <v-text-field v-model="sell.price" placeholder="قیمت واحد" class="mx-4"/>
          </v-row>
          <v-btn @click="doSell" :loading="sell.loading">ثبت فروش</v-btn>
        </v-col>
      </v-card>
      <!--      BUY      -->
      <v-card outlined>
        <v-col>
          <v-row>
            <v-select v-model="buy.fromAsset" :items="assets" placeholder="ارز خرید" class="mx-4"/>
            <v-text-field v-model="buy.amount" placeholder="مقدار" class="mx-4"/>
          </v-row>
          <v-row>
            <v-select v-model="buy.toAsset" :items="assets" placeholder="ارز فروش" class="mx-4"/>
            <v-text-field v-model="buy.price" placeholder="قیمت واحد" class="mx-4"/>
          </v-row>
          <v-btn @click="doBuy" :loading="buy.loading">ثبت خرید</v-btn>
        </v-col>
      </v-card>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "Offers",
  data() {
    return {
      assets: ['BTC', 'LTC', 'ETH'],
      offers: [],
      buy: {
        loading: false,
        fromAsset: '',
        toAsset: '',
        amount: '',
        price: ''
      },
      sell: {
        loading: false,
        fromAsset: '',
        toAsset: '',
        amount: '',
        price: ''
      }
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
    }
  },
  async mounted() {
    this.offers = (await this.$axios.$get('/offers'))._embedded.records
  }
}
</script>

<style scoped>

</style>