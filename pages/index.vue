<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card>
        <v-card-title class="headline">
          داشبورد
        </v-card-title>
        <v-card-text style="font-family: IranSans,serif">
          شمای مختصری از آخرین اتفاقات مربوط به حساب کاربری
        </v-card-text>
      </v-card>
      <h3 class="mt-4 text-center">سفارشات در جریان</h3>
      <v-simple-table>
        <template>
          <thead>
          <tr>
            <th>خرید</th>
            <th>فروش</th>
            <th>مقدار</th>
            <th>قیمت</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in offers" :key="item.id">
            <td>{{ item.selling.asset_code }}</td>
            <td>{{ item.buying.asset_code }}</td>
            <td>{{ item.amount }}</td>
            <td>{{ item.price }}</td>
          </tr>
          </tbody>
        </template>
      </v-simple-table>
      <!--      <json-viewer :value="offers" dir="ltr"/>-->
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      offers: []
    }
  },
  async mounted() {
    this.offers = (await this.$axios.$get('/offers'))._embedded.records
  }
}
</script>