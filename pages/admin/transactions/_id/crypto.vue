<template>
  <div class="text-center">
    <p class="text-h3 text-right"> {{ user.email }}</p>

    <v-data-table :headers="headers" :items="items" :items-per-page="50" hide-default-footer>
      <template v-slot:item.address="{value}"><p
          style="font-family: serif !important;
          max-width: 256px;word-wrap:break-word;"
          class="text-body1">{{ value }}</p></template>
      <template v-slot:item.private_key="{value}">
        <v-btn small @click="revealKey(value)">نمایش رمز</v-btn>
      </template>
      <template v-slot:item.balance_req="{item}">
        <v-btn small outlined color="primary" :loading="item.loading"
               @click="showBalance(item.coin,item.index)">درخواست
        </v-btn>
      </template>
      <template v-slot:item.link="{value}">
        <v-btn small color="primary" target="_blank" :href="value">ریزتراکنش</v-btn>
      </template>
      <template v-slot:item.crypto_transfer_to_bank="{item}">
        <v-btn small color="success" @click="accumulateDialog(item.coin)">تخلیه</v-btn>
      </template>
      <template v-slot:item.crypto_correct="{item}">
        <v-btn small color="error" @click="fromBankToUserDialog(item.coin)">واریز</v-btn>
      </template>
    </v-data-table>

    <v-dialog width="400" v-model="d.bankToUser">
      <v-card class="pa-6 text-center">
        <p class="text-h3">واریز کریپتو</p>
        <p class="text-h3">{{ bank_to_user_req.asset }}</p>
        <v-text-field v-model="bank_to_user_req.amount" label="مقدار"/>
        <v-text-field v-model="bank_to_user_req.dest_address" label="آدرس مقصد"/>
        <v-btn @click="fromBankToUser" :loading="l.bankToUser"
               color="error" class="mt-6">اعمال
        </v-btn>
      </v-card>
    </v-dialog>

    <v-dialog width="400" v-model="d.accumulate">
      <v-card class="pa-6 text-center">
        <p class="text-h3">انتقال به بانک</p>
        <p class="text-h3">{{ accumulate_req.asset }}</p>
        <v-text-field v-model="accumulate_req.amount" label="مقدار"/>
        <v-btn @click="accumulate" :loading="l.accumulate"
               color="error" class="mt-6">اعمال
        </v-btn>
      </v-card>
    </v-dialog>

    <v-dialog width="600" v-model="d.reveal">
      <v-card>
        <p style="font-family: serif !important" class="text-h4 text-center py-8 px-12">{{ privateKey }}</p>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import pstopper from "@/mixins/pstopper"
import collect from "collect.js"
import {toIndexedList} from "../../../../models/utils";


export default {
  mixins: [pstopper],
  computed: {
    user_id() {
      return this.$route.params.id
    }
  },
  data() {
    return {
      headers: [
        {value: 'coin', text: 'رمزارز', align: 'center', sortable: false},
        {value: 'address', text: 'آدرس', align: 'center'},
        {value: 'balance_req', text: 'بالانس', align: 'center', sortable: false},
        {value: 'balance', text: 'بالانس', align: 'center', sortable: false},
        {value: 'private_key', text: 'کلید', sortable: false, align: 'center'},
        {value: 'link', text: 'ریز تراکنش ها', align: 'center'},
        {value: 'crypto_correct', text: 'واریز کریپتو', sortable: false, align: 'center'},
        {value: 'crypto_transfer_to_bank', text: 'انتقال به بانک', sortable: false, align: 'center'},
      ],
      items: [],
      d: {
        accumulate: false,
        bankToUser: false,
        reveal: false
      },
      l: {bankToUser: false, accumulate: false},
      user: '',
      action: '',
      privateKey: '',
      bank_to_user_req: {
        dest_address: '',
        asset: '',
        amount: ''
      },
      accumulate_req: {
        user_id: this.$route.params.id,
        asset: '',
        amount: ''
      }
    }
  },
  mounted() {
    this.refresh()
  },
  methods: {
    async refresh() {
      let items = await this.$axios.$get('/crypto-accounts/' + this.user_id)
      this.items = toIndexedList(items)
    },
    revealKey(value) {
      this.d.reveal = true
      this.privateKey = value
    },
    fromBankToUserDialog(asset) {
      this.bank_to_user_req.asset = asset.toUpperCase()
      this.d.bankToUser = true
    },
    async fromBankToUser() {
      this.l.bankToUser = true
      await this.$axios.$post('/crypto/transfer-from-bank', this.bank_to_user_req)
      this.l.bankToUser = false
      this.d.bankToUser = false
      this.$bus.$emit('snack', 'با موفقیت انجام شد.', 'success')
    },
    accumulateDialog(asset) {
      this.accumulate_req.asset = asset.toUpperCase()
      this.d.accumulate = true
    },
    async accumulate() {
      this.l.accumulate = true
      await this.$axios.$post('/crypto/accumulate', this.accumulate_req)
      this.l.accumulate = true
      this.d.accumulate = false
      this.$bus.$emit('snack', 'با موفقیت انجام شد.', 'success')
    },
    async showBalance(coin, index) {
      let item = this.items[index - 1]

      item['loading'] = true
      this.$set(this.items, index - 1, item)

      item['balance'] = await this.$axios.$get('/crypto-accounts/balance/' + this.user_id, {params: {coin}})
      item['loading'] = false
      this.$set(this.items, index - 1, item)

    }
  },
}
</script>

<style scoped>

</style>