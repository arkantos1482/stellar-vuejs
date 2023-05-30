<template>
  <div class="pa-4">
    <div class="text-h4 mb-6 text-right">سفارشات در جریان</div>
    <v-card width="100%" class="pa-6">
      <my-active-offers-table />
    </v-card>
  </div>
</template>

<script>
import MyActiveOffersTable from "~/components/MyActiveOffersTable"
export default {
  name: "ActiveOffers",
  components: { MyActiveOffersTable }
}
</script>

<style scoped></style>
