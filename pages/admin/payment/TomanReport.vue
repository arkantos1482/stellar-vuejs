<template>
  <div class="container">
    <a-paged-table
        url="/payments/toman/report"
        :filter-query="filterQuery"
        :headers="headers">
      <template v-slot:item.type="{value}">{{ value|toFa }}</template>
      <template v-slot:item.status="{value}">{{ value|toFa }}</template>
      <template v-slot:item.verify_status="{value}">{{ value|toFa }}</template>
      <template v-slot:item.pay_system_status="{value}">{{ value|toFa }}</template>
      <template v-slot:item.stellar_status="{value}">{{ value|toFa }}</template>

      <template v-slot:item.verify_updated_at="{value}">{{ value|toFarsiDate }}</template>
      <template v-slot:item.stellar_updated_at="{value}">{{ value|toFarsiDate }}</template>
      <template v-slot:item.created_at="{value}">{{ value|toFarsiDate }}</template>
    </a-paged-table>
  </div>
</template>

<script>
import APagedTable from "../../../components/APagedTable";

export default {
  name: "TomanReport",
  components: {APagedTable},
  data() {
    return {
      headers: [
        // {value: 'uuid', text: 'شناسه یکتا'},
        {value: "email", text: 'ایمیل'},
        {value: 'pay_system_id', text: 'شناسه جیبیت'},
        {value: 'type', text: 'نوع'},
        {value: 'amount', text: 'مقدار'},
        // {value: 'pay_system_amount', text: 'مقدار جیبیت'},
        // {value: 'status', text: 'وضعیت'},
        {value: 'pay_system_status', text: 'وضعیت جیبیت'},
        {value: 'verify_status', text: 'وضعیت وریفای'},
        // {value: 'stellar_id', text: 'شناسه استلار'},
        {value: 'stellar_status', text: 'وضعیت استلار'},
        // {value: 'desc', text: 'توضیحات'},
        // {value: 'error_desc', text: 'توضیح خطا'},
        // {value: 'additional_data', text: 'داده اضافی'},
        {value: 'created_at', text: 'تاریخ ایجاد'},
        {value: 'verify_updated_at', text: 'تاریخ وریفای'},
        {value: 'stellar_updated_at', text: 'تاریخ استلار'},
        // {value: 'updated_at', text: 'تاریخ بروزشده'},
      ],
      filterQuery: [
        {type: 'text', key: 'users.email', name: 'ایمیل', value: ''},
        {type: 'text', key: 'pay_system_id', name: 'شناسه جیبیت', value: ''},
        {type: 'text', key: 'type', name: 'نوع', value: ''},
        {type: 'text', key: 'amount', name: 'مقدار', value: ''},
        {type: 'text', key: 'pay_system_status', name: 'وضعیت جیبیت', value: ''},
        {type: 'text', key: 'verify_status', name: 'وضعیت وریفای', value: ''},
        {type: 'text', key: 'stellar_status', name: 'وضعیت استلار', value: ''},
        {type: 'time', key: 'created_at', name: 'تاریخ ایجاد', value: ''},
        {type: 'time', key: 'verify_updated_at', name: 'تاریخ وریفای', value: ''},
        {type: 'time', key: 'stellar_updated_at', name: 'تاریخ استلار', value: ''},
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