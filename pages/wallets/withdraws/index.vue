<template>
  <div>
    <div class="text-h4 mb-4 text-right">{{ title }}</div>
    <v-card width="100%" class="text-center pa-4">
      <v-row>
        <v-select label="نوع" v-model="coin" :items="coinList"></v-select>
        <div class="mt-4">
          <p class=" mb-1">تاریخ برداشت از</p>
          <custom-date-picker v-model="date.from">
            <template slot="label">
              test label template
            </template>
          </custom-date-picker>
        </div>
        <div class="mt-4">
          <p class=" mb-1">تاریخ برداشت تا</p>
          <custom-date-picker v-model="date.to">
            <template slot="label">
            </template>
          </custom-date-picker>
        </div>
        <v-btn outlined>جستجو</v-btn>
      </v-row>
      <v-simple-table>
        <thead>
        <tr>
          <th class="text-center">تاریخ</th>
          <th class="text-center">نوع ارز</th>
          <th class="text-center">مبلغ</th>
          <th class="text-center">انتقال به</th>
          <th class="text-center">وضعیت</th>
          <th class="text-center">شماره حساب</th>
          <th class="text-center">کارمزد</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in withdraws" :key="item.id">
          <td>{{ item.updated_at|toFarsiDate }}</td>
          <td>{{ item.coin|toFarsiCoin }}</td>
          <td>{{ item.amount|toFloat|separated }}</td>
          <td>{{ item.destination }}</td>
          <td :class="item.status|toFarsiColor">{{ item.status|toFarsiTitle }}</td>
          <td>
            <div v-show="item.track_code">
              <p v-if="item.coin === 'IRR'">{{ item.track_code }}کد رهگیری= </p>
              <a v-else :href="item.track_code" target="_blank">لینک پیگیری</a>
            </div>
          </td>
          <td></td>
        </tr>
        </tbody>
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
      coin: '',
      date: {from: '', to: ''},
      coinList: ['IRT', 'BCH', 'BTC']
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