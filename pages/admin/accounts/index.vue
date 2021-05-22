<template>
  <div class="container">
    <v-data-table :headers="headers"
                  :items-per-page="200"
                  :items="list"
                  hide-default-footer
                  @click:row="goto">
    </v-data-table>
  </div>
</template>

<script>
import pstopper from "@/mixins/pstopper";

export default {
  name: "Accounts",
  mixins: [pstopper],
  data() {
    return {
      headers: [
        // {text: 'user_id', value: 'user_id'},
        {text: 'email', value: 'email'},
        {text: 'تومان', value: 'IRR'},
        {text: 'تتر', value: 'USDT'},
        {text: 'اتریوم', value: 'ETH'},
        {text: 'بیت کوین', value: 'BTC'},
        {text: 'ترون', value: 'TRX'},
        {text: 'بیت کش', value: 'BCH'},
        {text: 'لایت کوین', value: 'LTC'},
        {text: 'امین', value: 'AMN'},
        {text: 'برگ', value: 'EBG'},
        {text: 'آرت کوین', value: 'ART'},
        {text: 'زریک', value: 'ZRK'},
        {text: 'شکوفه آلو', value: 'SHA'},
        {text: 'وی توکن', value: 'WIT'},
      ],
      list: [],
    }
  },
  async mounted() {
    this.list = await this.$axios.$get('/balances/report')
  },
  methods: {
    async goto(item, etc) {
      await this.$router.push(`/admin/transactions/${item.user_id}`)
    }
  },
}
</script>

<style scoped>
.container >>> td{
  padding-left: 0 !important;
  padding-right: 0 !important;
}
</style>