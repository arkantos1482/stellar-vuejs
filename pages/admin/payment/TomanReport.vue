<template>
  <div class="container">

    <v-tabs centered v-model="tab">
      <v-tab>همه</v-tab>
      <v-tab>واریز</v-tab>
      <v-tab>برداشت</v-tab>
    </v-tabs>

    <a-paged-table
        ref="table"
        url="/payments/toman/report"
        :filter-query="filterQuery"
        :headers="headers"
        default-sort-by="created_at"
        :default-sort-desc="true">
      <template v-slot:item.type="{value}">{{ value|toFa }}</template>
      <template v-slot:item.status="{value}">{{ value|toFa }}</template>
      <template v-slot:item.verify_status="{value}">{{ value|toFa }}</template>
      <template v-slot:item.pay_system_status="{value}">{{ value|toFa }}</template>
      <template v-slot:item.stellar_status="{value}">{{ value|toFa }}</template>

      <template v-slot:item.verify_updated_at="{value}">{{ value|toFarsiDate }}</template>
      <template v-slot:item.stellar_updated_at="{value}">{{ value|toFarsiDate }}</template>
      <template v-slot:item.created_at="{value}">{{ value|toFarsiDate }}</template>

      <template v-slot:item.correction="{item}">
        <span v-if="alreadyCorrected(item)" class="success--text">اصلاح شده</span>
        <v-btn v-else-if="needCorrection(item)" outlined color="error" small @click="correctDialog(item)">تصحیح</v-btn>
      </template>
    </a-paged-table>

    <v-dialog width="400" v-model="d.correct">
      <v-card class="pa-6 text-center">
        <p class="text-h3">واریز استلار</p>
        <p class="text-h4">{{ email }}</p>
        <p class="text-h4 primary--text">{{ asset }}</p>
        <v-text-field v-model="amount" label="مقدار"/>
        <v-text-field v-model="desc" label="توضیحات"/>
        <v-btn @click="correct" :loading="l.correct"
               color="error" class="mt-6">اعمال
        </v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import APagedTable from "../../../components/APagedTable";

export default {
  name: "TomanReport",
  components: {APagedTable},
  watch: {
    tab(val) {
      if (val === 0) {
        let item = {type: 'text', key: 'type', name: 'نوع', value: ''}
        this.$set(this.filterQuery, 0, item)
        this.$refs.table.refresh()
        this.headers =
            [
              {value: "email", text: 'ایمیل'},
              {value: 'pay_system_id', text: 'شناسه جیبیت'},
              {value: 'type', text: 'نوع'},
              {value: 'amount', text: 'مقدار'},
              {value: 'pay_system_status', text: 'وضعیت جیبیت'},
              {value: 'verify_status', text: 'وضعیت وریفای'},
              {value: 'stellar_status', text: 'وضعیت استلار'},
              {value: 'created_at', text: 'تاریخ ایجاد'},
              {value: 'verify_updated_at', text: 'تاریخ وریفای'},
              {value: 'stellar_updated_at', text: 'تاریخ استلار'},
            ]
      } else if (val === 1) {
        let item = {type: 'text', key: 'type', name: 'نوع', value: 'deposit'}
        this.$set(this.filterQuery, 0, item)
        this.$refs.table.refresh()
        this.headers =
            [
              {value: "email", text: 'ایمیل'},
              {value: 'pay_system_id', text: 'شناسه جیبیت'},
              {value: 'amount', text: 'مقدار'},
              {value: 'pay_system_status', text: 'وضعیت جیبیت'},
              {value: 'verify_status', text: 'وضعیت وریفای'},
              {value: 'stellar_status', text: 'وضعیت استلار'},
              {value: 'created_at', text: 'تاریخ ایجاد'},
              {value: 'verify_updated_at', text: 'تاریخ وریفای'},
              {value: 'stellar_updated_at', text: 'تاریخ استلار'},
              {value: 'correction', text: 'تصحیح'}
            ]
      } else if (val === 2) {
        let item = {type: 'text', key: 'type', name: 'نوع', value: 'withdraw'}
        this.$set(this.filterQuery, 0, item)
        this.$refs.table.refresh()
        this.headers =
            [
              {value: "email", text: 'ایمیل'},
              {value: 'pay_system_id', text: 'شناسه جیبیت'},
              {value: 'amount', text: 'مقدار'},
              {value: 'stellar_status', text: 'وضعیت استلار'},
              {value: 'pay_system_status', text: 'وضعیت جیبیت'},
              {value: 'stellar_updated_at', text: 'تاریخ استلار'},
              {value: 'created_at', text: 'تاریخ ایجاد'},
              {value: 'correction', text: 'تصحیح'}
            ]
      }
    }
  },
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
      tab: 0,
      user_id: '',
      email: '',
      asset: '',
      amount: '',
      tx_id: '',
      tx_type: 'rial',
      desc: '',
      l: {correct: false},
      d: {correct: false},
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
        {type: 'text', key: 'type', name: 'نوع', value: ''},
        {type: 'text', key: 'users.email', name: 'ایمیل', value: ''},
        {type: 'text', key: 'pay_system_id', name: 'شناسه جیبیت', value: ''},
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
  methods: {
    needCorrection: item => {
      if (item?.type === 'deposit') {
        if (item.verify_status === 'Successful' && item.stellar_status !== 'done') {
          return true
        }
      } else if (item?.type === 'withdraw') {
        if (item.stellar_status === 'done' && item.pay_system_status === 'GENERATED') {
          return true
        }
      }
      return false
    },
    alreadyCorrected(item) {
      return Boolean(item?.txable_id)
    },
    correctDialog(item) {
      this.d.correct = true

      this.email = item.email
      this.user_id = item.user_id
      this.asset = 'IRR'
      this.amount = item.amount
      this.tx_id = item.id
    },
    async correct() {

      this.l.correct = true
      await this.$axios.$post('/stellar/tx-recovery',
          {
            user_id: this.user_id, asset: this.asset, amount: this.amount,
            tx_id: this.tx_id, tx_type: this.tx_type, desc: this.desc
          })
      this.l.correct = false
      this.d.correct = false

      await this.$refs.table.refresh()
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