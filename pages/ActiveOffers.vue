<template>
  <v-row class="text-center">
    <v-col cols="12">
      <v-simple-table>
        <template>
          <thead class="grey lighten-3">
          <tr>
            <th class="text-center">فروش</th>
            <th class="text-center">خرید</th>
            <th class="text-center">مقدار</th>
            <th class="text-center">قیمت</th>
            <th class="text-center">لغو</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in offers" :key="item.id">
            <td>{{ item.selling.asset_code }}</td>
            <td>{{ item.buying.asset_code }}</td>
            <td>{{ parseFloat(item.amount) }}</td>
            <td>{{ parseFloat(item.price) }}</td>
            <td>
              <v-btn outlined small color="red" @click="cancel(item.id,item.seller)">لغو</v-btn>
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
  name: 'ActiveOffers',
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