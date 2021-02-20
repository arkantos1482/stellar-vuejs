<template>
  <div>
        <v-data-table :headers="headers"
                      :items="list"
                      hide-default-footer :items-per-page="200" dense>
          <template v-slot:item.type="{value}">{{value|toFa}}</template>
          <template v-slot:item.crypto_status="{value}">{{value|toFa}}</template>
          <template v-slot:item.stellar_status="{value}">{{value|toFa}}</template>

          <template v-slot:item.crypto_updated_at="{value}">{{value|toFarsiDate}}</template>
          <template v-slot:item.stellar_updated_at="{value}">{{value|toFarsiDate}}</template>
          <template v-slot:item.created_at="{value}">{{value|toFarsiDate}}</template>
        </v-data-table>
  </div>
</template>

<script>
export default {
  name: "CryptoReport",
  data() {
    return {
      headers: [
        {value: 'email', text: 'ایمیل'},
        {value: 'currency', text: 'رمزارز'},
        {value: 'type', text: 'نوع'},
        {value: 'amount', text: 'مقدار'},
        // {value: 'stellar_id', text: 'شناسه استلاری'},
        {value: 'stellar_status', text: 'وضعیت استلار'},
        {value: 'stellar_updated_at', text: 'تاریخ استلار'},
        // {value: 'crypto_id', text: 'شناسه کریپتو'},
        {value: 'crypto_status', text: 'وضعیت کریپتو'},
        {value: 'crypto_fee', text: 'کارمزد'},
        {value: 'crypto_updated_at', text: 'تاریخ کریپتو'},
        // {value: 'source_address', text: 'مبدا'},
        // {value: 'dest_address', text: 'مقصد'},
        {value: 'created_at', text: 'تاریخ'},
        // {value: 'updated_at', text: 'تاریخ بروزشده'},
        {value: 'to_toman', text: 'نرخ(تومان)'}],
      list: []
    }
  },
  async mounted() {
    this.list = await this.$axios.$get('/payments/crypto/report')
  }
}
</script>

<style scoped>

</style>