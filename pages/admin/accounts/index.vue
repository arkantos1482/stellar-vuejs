<template>
  <div>
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
        {text: 'بیت کش', value: 'BCH'},
        {text: 'لایت کوین', value: 'LTC'},
        {text: 'امین', value: 'AMN'},
        {text: 'برگ', value: 'EBG'},
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

</style>