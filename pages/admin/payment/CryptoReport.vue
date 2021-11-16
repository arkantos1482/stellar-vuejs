<template>
  <div class="container">
    <a-paged-table
        url="/payments/crypto/report"
        :headers="headers"
        :filter-query="filterQuery"
        default-sort-by="created_at"
        :default-sort-desc="true">
      <template v-slot:item.type="{value}">{{ value|toFa }}</template>
      <template v-slot:item.crypto_status="{value}">{{ value|toFa }}</template>
      <template v-slot:item.stellar_status="{value}">{{ value|toFa }}</template>

      <template v-slot:item.crypto_updated_at="{value}">{{ value|toFarsiDate }}</template>
      <template v-slot:item.stellar_updated_at="{value}">{{ value|toFarsiDate }}</template>
      <template v-slot:item.created_at="{value}">{{ value|toFarsiDate }}</template>

      <template v-slot:item.correction="{item}">
        <v-btn v-if="needCorrection(item)" outlined color="error" small @click="correctDialog(item)">تصحیح</v-btn>
      </template>
    </a-paged-table>

    <v-dialog width="400" v-model="d.correct">
      <v-card class="pa-6 text-center">
        <p class="text-h3">واریز استلار</p>
        <p class="text-h4">{{ email }}</p>
        <p class="text-h4 primary--text">{{ asset }}</p>
        <v-text-field v-model="amount" label="مقدار"/>
        <v-btn @click="correct" :loading="l.correct"
               color="error" class="mt-6">اعمال
        </v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import APagedTable from "../../../components/APagedTable";
import {coinList} from "../../../models/coinList";

export default {
  name: "CryptoReport",
  components: {APagedTable},
  filters: {
    actionToFa(value) {
      let result = ''
      if (value === 'deposit') result = 'واریز'
      else if (value === 'withdraw') result = 'برداشت'
      return result
    },
  },
  data() {
    return {
      user_id: '',
      email: '',
      asset: '',
      amount: '',
      l: {correct: false},
      d: {correct: false},
      headers: [
        {value: 'email', text: 'ایمیل', align: 'center'},
        {value: 'currency', text: 'رمزارز', align: 'center'},
        {value: 'type', text: 'نوع', align: 'center'},
        {value: 'amount', text: 'مقدار', align: 'center'},
        {value: 'crypto_fee', text: 'کارمزد', align: 'center'},
        // {value: 'to_toman', text: 'نرخ(تومان)', align: 'center'},
        // {value: 'stellar_id', text: 'شناسه استلاری'},
        // {value: 'crypto_id', text: 'شناسه کریپتو'},
        {value: 'crypto_status', text: 'وضعیت کریپتو', align: 'center'},
        {value: 'stellar_status', text: 'وضعیت استلار', align: 'center'},
        // {value: 'source_address', text: 'مبدا'},
        // {value: 'dest_address', text: 'مقصد'},
        {value: 'created_at', text: 'تاریخ ایجاد', align: 'center'},
        {value: 'crypto_updated_at', text: 'تاریخ کریپتو', align: 'center'},
        {value: 'stellar_updated_at', text: 'تاریخ استلار', align: 'center'},
        // {value: 'updated_at', text: 'تاریخ بروزشده'},
        {value: 'correction', text: 'تصحیح'}
      ],
      filterQuery: [
        {type: 'text', key: 'users.email', name: 'ایمیل', value: ''},
        {type: 'enum', key: 'currency', name: 'رمزارز', value: '', options: ['', ...coinList]},
        {type: 'enum', key: 'type', name: 'نوع', value: '', options: ['', 'withdraw', 'deposit']},
        {type: 'text', key: 'amount', name: 'مقدار', value: ''},
        {type: 'text', key: 'crypto_fee', name: 'کارمزد', value: ''},
        // {type: 'text', key: 'to_toman', name: 'نرخ(تومان)', value: ''},
        {type: 'text', key: 'crypto_status', name: 'وضعیت کریپتو', value: ''},
        {type: 'text', key: 'stellar_status', name: 'وضعیت استلار', value: ''},
        {type: 'time', key: 'created_at', name: 'تاریخ ایجاد', value: ''},
        {type: 'time', key: 'crypto_updated_at', name: 'تاریخ کریپتو', value: ''},
        {type: 'time', key: 'stellar_updated_at', name: 'تاریخ استلار', value: ''},
      ]
    }
  },
  methods: {
    needCorrection: item => {
      if (item?.type === 'withdraw') {
        if (item.stellar_status === 'done' && item.crypto_status !== 'done') {
          return true
        }
      }
      return false
    },
    correctDialog(item) {
      this.d.correct = true

      this.email = item.email
      this.user_id = item.user_id
      this.asset = item.currency.toUpperCase()
      this.amount = item.amount
    },
    async correct() {

      this.l.correct = true
      await this.$axios.$post('/stellar/deposit',
          {user_id: this.user_id, asset: this.asset, amount: this.amount})
      this.l.correct = false
      this.d.correct = false
      this.$bus.$emit('snack', 'با موفقیت انجام شد.', 'success')
    }
  }
}
</script>

<style scoped>
.container >>> td {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
</style>