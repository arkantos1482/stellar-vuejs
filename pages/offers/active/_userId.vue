<template>
  <titled-page title="سفارشات در جریان">
    <my-active-offers-table />
  </titled-page>
</template>

<script>
import MyActiveOffersTable from "~/components/MyActiveOffersTable"
import TitledPage from "~/components/TitledPage.vue"

export default {
  name: "ActiveOffers",
  components: { TitledPage, MyActiveOffersTable },
}
</script>

<style scoped></style>
