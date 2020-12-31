<template>
  <v-card width="100%" class="text-center">
    <v-simple-table>
      <thead class="grey lighten-3">
      <tr>
        <th class="text-center">مقدار فروش</th>
        <th class="text-center">رمزارز فروش</th>
        <th class="text-center">مقدار خرید</th>
        <th class="text-center">رمزارز خرید</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in trades" :key="item.id">
        <td>{{ parseFloat(item.sold_amount) }}</td>
        <td>{{ item.sold_asset_code }}</td>
        <td>{{ parseFloat(item.bought_amount) }}</td>
        <td>{{ item.bought_asset_code }}</td>
      </tr>
      </tbody>
    </v-simple-table>
  </v-card>
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