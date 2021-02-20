<template>
  <div>
    <v-data-table :headers="headers" :items="list" :items-per-page="200" dense hide-default-footer>
      <template v-slot:item.type="{value}">{{value|toFa}}</template>
      <template v-slot:item.status="{value}">{{value|toFa}}</template>
      <template v-slot:item.verify_status="{value}">{{value|toFa}}</template>
      <template v-slot:item.pay_system_status="{value}">{{value|toFa}}</template>
      <template v-slot:item.stellar_status="{value}">{{value|toFa}}</template>

      <template v-slot:item.verify_updated_at="{value}">{{value|toFarsiDate}}</template>
      <template v-slot:item.stellar_updated_at="{value}">{{value|toFarsiDate}}</template>
      <template v-slot:item.created_at="{value}">{{value|toFarsiDate}}</template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: "TomanReport",
  data() {
    return {
      headers: [
        // {value: 'uuid', text: 'شناسه یکتا'},
        {value: "email", text: 'ایمیل'},
        {value: 'pay_system_id', text: 'شناسه جیبیت'},
        {value: 'type', text: 'نوع'},
        {value: 'amount', text: 'مقدار'},
        // {value: 'pay_system_amount', text: 'مقدار جیبیت'},
        {value: 'status', text: 'وضعیت'},
        {value: 'pay_system_status', text: 'وضعیت جیبیت'},
        {value: 'verify_status', text: 'وضعیت وریفای'},
        {value: 'verify_updated_at', text: 'تاریخ وریفای'},
        // {value: 'stellar_id', text: 'شناسه استلار'},
        {value: 'stellar_status', text: 'وضعیت استلار'},
        {value: 'stellar_updated_at', text: 'تاریخ استلار'},
        // {value: 'desc', text: 'توضیحات'},
        // {value: 'error_desc', text: 'توضیح خطا'},
        // {value: 'additional_data', text: 'داده اضافی'},
        {value: 'created_at', text: 'تاریخ ایجاد'},
        // {value: 'updated_at', text: 'تاریخ بروزشده'},
      ],
      list: []
    }
  },
  async mounted() {
    this.list = await this.$axios.$get('/payments/toman/report')
  }
}
</script>

<style scoped>

</style>