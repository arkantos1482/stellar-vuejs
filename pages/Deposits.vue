<template>
  <v-row>
    <v-col cols="12">
      <!--      <json-viewer :value="deposits" dir="ltr"/>-->
      <v-simple-table>
        <thead>
        <tr>
          <th>رمزارز</th>
          <th>مقدار</th>
          <th>زمان</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in deposits" :key="item.id">
          <td>{{ item.asset_code }}</td>
          <td>{{ item.amount }}</td>
          <td>{{ item.created_at }}</td>
        </tr>
        </tbody>
      </v-simple-table>
      <h3 class="mt-8"> crypto LTC transactions</h3>
      <json-viewer dir="auto" :value="ltcTxs"/>
    </v-col>
  </v-row>
</template>

<script>
import collect from "collect.js";

export default {
  name: "Deposits",
  data() {
    return {
      deposits: [],
      ltcTxs: '',
    }
  },
  async mounted() {
    let list = (await this.$axios.$get('/effects'))._embedded.records;
    this.deposits = collect(list).filter(item => item.type === 'account_credited').all();
    try {
      this.ltcTxs = await this.$axios.$get('/crypto/ltc/txs/basic')
    } catch (e) {
      this.ltcTxs = 'حساب ltc ایجاد نشده است.'
    }
  }
}
</script>

<style scoped>

</style>