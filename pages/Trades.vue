<template>
  <v-row justify="center">
    <v-col cols="12">
<!--      <json-viewer :value="trades" dir="ltr"/>-->
      <v-simple-table>
        <thead>
        <tr>
          <th>مقدار فروش</th>
          <th>رمزارز فروش</th>
          <th>مقدار خرید</th>
          <th>رمزارز خرید</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in trades" :key="item.id">
          <td>{{item.sold_amount}}</td>
          <td>{{item.sold_asset_code}}</td>
          <td>{{item.bought_amount}}</td>
          <td>{{item.bought_asset_code}}</td>
        </tr>
        </tbody>
      </v-simple-table>
    </v-col>
  </v-row>
</template>

<script>
import collect from "collect.js";

export default {
  name: "Trades",
  data() {
    return {
      trades: []
    }
  },
  async mounted() {
    // this.trades = (await this.$axios.$get('/trades'))._embedded.records
    let list = (await this.$axios.$get('/effects'))._embedded.records;
    this.trades = collect(list)
        .filter(item => item.type === 'trade')
        .all();
  }
}
</script>

<style scoped>

</style>