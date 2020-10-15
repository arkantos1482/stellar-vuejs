<template>
  <v-row>
    <v-col cols="12">
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
  async fetch() {
    this.offers = (await this.$axios.$get('/offers'))._embedded.records
  }
}
</script>

<style scoped>

</style>