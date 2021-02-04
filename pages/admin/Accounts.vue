<template>
  <div>
    <v-data-table dense
                  :headers="headers"
                  :items-per-page="200"
                  :items="list"
                  hide-default-footer>
      <template v-slot:item.Action="{item}">
        <v-btn x-small color="primary" @click="prepare('IRR',item)">عملیات</v-btn>
      </template>
    </v-data-table>
    <v-dialog width="400" v-model="d.ops">
      <v-card class="pa-6 text-center">
        <v-text-field v-model="selected.amount" label="مبلغ به تومان"/>
        {{ stellarAddress }}
        <v-btn @click="withdraw" :loading="l.withdraw"
               color="error" class="mt-6">برداشت تومان
        </v-btn>
      </v-card>
    </v-dialog>
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
        {text: 'user_id', value: 'user_id'},
        {text: 'email', value: 'email'},
        {text: 'تومان', value: 'IRR'},
        {text: 'تتر', value: 'USDT'},
        {text: 'ملاحظات', value: 'Action', sortable: false}
        // {text: 'اتریوم', value: 'ETH'},
        // {text: 'بیت کوین', value: 'BTC'},
        // {text: 'بیت کش', value: 'BCH'},
        // {text: 'لایت کوین', value: 'LTC'},
        // {text: 'امین', value: 'AMN'},
        // {text: 'برگ', value: 'EBG'},
      ],
      list: [],
      d: {ops: false},
      l: {withdraw: false},

      stellarAddress: '',
      selected: {
        user_id: '',
        asset: '',
        amount: ''
      }
    }
  },
  async mounted() {
    this.list = await this.$axios.$get('/users/balances')
  },
  methods: {
    prepare(coin, item) {
      this.d.ops = true
      this.selected.user_id = item.user_id
      this.selected.asset = coin.toUpperCase()

      // for view (not necessary)
      this.stellarAddress = item.address
    },
    async withdraw() {
      this.l.withdraw = true
      await this.$axios.$post('/stellar/withdraw', this.selected)
      this.l.withdraw = false
    },
  },
}
</script>

<style scoped>

</style>