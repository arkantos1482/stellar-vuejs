<template>
  <div>
    <v-data-table
        :headers="headers"
        :items="items"
        hide-default-footer
        items-per-page="200"
    >
      <template v-slot:item.is_hd="{item}">
        <nuxt-link v-if="item.is_hd" :to="'/admin/bank-accounts/'+item.coin"
                   class="primary--text">لیست
        </nuxt-link>
        <a v-else :href="item.link" target="_blank">لینک</a>
      </template>

      <template v-slot:item.transfer="{item}">
        <v-btn small color="error" @click="transferDialog(item.coin)">ارسال</v-btn>
      </template>

      <template v-slot:item.balance_req="{item}">
        <v-btn small outlined color="primary" :loading="item.loading"
               @click="showBalance(item.coin,item.index)">درخواست
        </v-btn>
      </template>
    </v-data-table>

    <v-dialog width="600" v-model="d.transfer">
      <v-card class="pa-6 text-center">
        <p class="text-h3">انتقال کریپتو</p>
        <p class="text-h3">{{ payload.coin }}</p>
        <v-text-field v-model="payload.amount" label="مقدار"/>
        <v-text-field v-model="payload.dest_address" label="آدرس مقصد"/>
        <v-btn @click="transfer" :loading="l.transfer"
               color="error" class="mt-6">اعمال
        </v-btn>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import {toIndexedList} from "../../../models/utils";

export default {
  name: "bank-accounts",
  data() {
    return {
      headers: [
        {value: 'coin', text: 'رمزارز', align: 'center', sortable: false},
        {value: 'balance_req', text: 'بالانس', align: 'center', sortable: false},
        {value: 'balance', text: 'بالانس', align: 'center', sortable: false},
        {value: 'is_hd', text: 'لیست تراکنش ها', align: 'center', sortable: false},
        {value: 'transfer', text: 'انتقال', align: 'center', sortable: false},
      ],
      items: [],
      payload: {
        coin: '',
        amount: '',
        dest_address: '',
      },
      d: {transfer: false},
      l: {transfer: false}
    }
  },
  mounted() {
    this.refresh()
  },
  methods: {
    async refresh() {
      let items = await this.$axios.$get('/bank-accounts')
      this.items = toIndexedList(items)
    },
    transferDialog(coin) {
      this.d.transfer = true
      this.payload.coin = coin
    },
    async transfer() {
      this.l.transfer = true
      await this.$axios.$post('/crypto/transfer-from-bank', this.payload)
      this.l.transfer = false
      this.d.transfer = false
    },
    async showBalance(coin, index) {
      let item = this.items[index - 1]

      item['loading'] = true
      this.$set(this.items, index - 1, item)

      item['balance'] = await this.$axios.$get('/bank-accounts/balance', {params: {coin}})
      item['loading'] = false
      this.$set(this.items, index - 1, item)

    }
  },
}
</script>

<style scoped>

</style>