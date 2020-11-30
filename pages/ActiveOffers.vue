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
            <th>لغو</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in offers" :key="item.id">
            <td>{{ item.selling.asset_code }}</td>
            <td>{{ item.buying.asset_code }}</td>
            <td>{{ item.amount }}</td>
            <td>{{ item.price }}</td>
            <td>
              <v-btn @click="cancel(item.id,item.seller)">لغو</v-btn>
            </td>
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
  },
  methods: {
    async cancel(id, seller) {
      await this.$axios.$post('/offers/delete', {id, seller})
      console.log(id)
    }
  }
}
</script>

<style scoped>

</style>