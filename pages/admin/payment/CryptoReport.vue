<template>
  <div class="container">
    <a-paged-table
        url="/payments/crypto/report"
        :headers="headers"
        :filter-query="filterQuery">
      <template v-slot:item.type="{value}">{{ value|toFa }}</template>
      <template v-slot:item.crypto_status="{value}">{{ value|toFa }}</template>
      <template v-slot:item.stellar_status="{value}">{{ value|toFa }}</template>

      <template v-slot:item.crypto_updated_at="{value}">{{ value|toFarsiDate }}</template>
      <template v-slot:item.stellar_updated_at="{value}">{{ value|toFarsiDate }}</template>
      <template v-slot:item.created_at="{value}">{{ value|toFarsiDate }}</template>
    </a-paged-table>
  </div>
</template>

<script>
import APagedTable from "../../../components/APagedTable";
import {coinList} from "../../../models/coinList";

export default {
  name: "CryptoReport",
  components: {APagedTable},
  data() {
    return {
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
        // {type: 'time', key: 'created_at', name: 'تاریخ ایجاد', value: ''},
        // {type: 'time', key: 'crypto_updated_at', name: 'تاریخ کریپتو', value: ''},
        // {type: 'time', key: 'stellar_updated_at', name: 'تاریخ استلار', value: ''},
      ]
    }
  },
}
</script>

<style scoped>
.container >>> td {
  padding-left: 0 !important;
  padding-right: 0 !important;
}
</style>