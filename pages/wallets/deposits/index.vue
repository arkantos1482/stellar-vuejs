<template>
  <v-row class="text-center">
    <v-col cols="12">
      <div class="text-h6 mb-2 text-right">لیست واریزها</div>
      <v-simple-table>
        <thead class="grey lighten-3">
        <tr>
          <th class="text-center">رمزارز</th>
          <th class="text-center">مقدار</th>
          <th class="text-center">تاریخ</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in deposits" :key="item.id">
          <td>{{ item.asset_code }}</td>
          <td>{{ parseFloat(item.amount) }}</td>
          <td>{{ item.created_at }}</td>
        </tr>
        </tbody>
      </v-simple-table>
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
    }
  },
  async mounted() {
    let list = (await this.$axios.$get('/effects'))._embedded.records;
    this.deposits = collect(list).filter(item => item.type === 'account_credited').all();
  }
}
</script>

<style scoped>

</style>