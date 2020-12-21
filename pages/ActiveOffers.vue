<template>
  <v-row class="text-center">
    <v-col cols="12">
      <v-simple-table>
        <template>
          <thead class="grey lighten-3">
          <tr>
            <th class="text-center">فروش</th>
            <th class="text-center">خرید</th>
            <th class="text-center">مقدار فروش</th>
            <th class="text-center">مقدار خرید</th>
            <th class="text-center">قیمت واحد</th>
            <th class="text-center">لغو</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,idx) in offers" :key="idx">
            <td>{{ item.selling.asset_code }}</td>
            <td>{{ item.buying.asset_code }}</td>
            <td>{{ parseFloat(item.amount) }}</td>
            <td>{{ parseFloat(item.amount) * parseFloat(item.price) }}</td>
            <td>{{ parseFloat(item.price) }}</td>
            <td>
              <v-btn ref="deleteBtn"
                     @click="cancel(item.id,item.seller,idx)"
                     outlined small color="red">لغو
              </v-btn>
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
import pstopper from "@/mixins/pstopper";

export default {
  mixins: [pstopper],
  name: 'ActiveOffers',
  computed: {
    offers() {
      return this.$store.state.offers.activeOffers
    }
  },
  async mounted() {
    await this.$store.dispatch("offers/refresh")
  },
  methods: {
    async cancel(id, seller,index) {
      this.$refs.deleteBtn[index].loading = true
      await this.$store.dispatch("offers/delete", {id, seller})
      await this.$store.dispatch("offers/refresh")
    }
  }
}
</script>

<style scoped>

</style>