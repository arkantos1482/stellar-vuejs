<template>
  <div class="pa-4">
    <div class="text-h4 mb-6 text-right">{{ title }}</div>
    <v-card width="100%" class="pa-6">
      <a-table-header :list="['همه','IRT', 'BCH', 'BTC']"
                      list_name="نوع" from_name="تاریخ برداشت از" to_name="تاریخ برداشت تا"/>
      <v-simple-table class="text-center">
        <thead>
        <tr>
          <th class="text-center">تاریخ</th>
          <th class="text-center">نوع ارز</th>
          <th class="text-center">مبلغ</th>
          <th class="text-center">انتقال به</th>
          <th class="text-center">شماره حساب</th>
          <th class="text-center">کارمزد</th>
          <th class="text-center">وضعیت</th>
        </tr>
        </thead>
        <tbody v-if="withdraws.length">
        <tr v-for="item in withdraws" :key="item.id">
          <td>{{ item.updated_at|toFarsiDate }}</td>
          <td>{{ item.coin|toFarsiCoin }}</td>
          <td>{{ item.amount|toFloat|separated }}</td>
          <td>{{ item.destination }}</td>
          <td>
            <div v-show="item.track_code">
              <p v-if="item.coin === 'IRR'">{{ item.track_code }}کد رهگیری= </p>
              <a v-else :href="item.track_code" target="_blank">لینک پیگیری</a>
            </div>
          </td>
          <td>{{ item.crypto_fee }}</td>
          <td :class="item.status|toFarsiColor">{{ item.status|toFarsiTitle }}</td>
        </tr>
        </tbody>
        <no-data v-else cols="5" title="برداشتی انجام نشده است."/>
      </v-simple-table>
    </v-card>
  </div>
</template>

<script>
import collect from 'collect.js'

export default {
  name: "Withdraws",
  props: {
    title: {type: String, default: 'گزارش برداشت'},
    userId: {type: String, default: 'me'},
    type: String
  },
  filters: {
    toFarsiTitle(val) {
      return (val === 'success') ? 'موفقیت آمیز' : 'ناموفق'
    },
    toFarsiColor(val) {
      return (val === 'success') ? 'success--text' : 'error--text'
    }
  },
  data() {
    return {
      withdraws: [],
    }
  },
  async mounted() {
    let list1 = (await this.$axios.$get('/payments/withdraws/' + this.userId))
    let list2 = collect(list1)
    if (this.type) list2 = list2.filter(item => this.type.toUpperCase() === item.coin)
    this.withdraws = list2.all()
  }
}
</script>

<style scoped>

</style>