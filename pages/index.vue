<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <v-card>
        <v-card-title class="headline">
          داشبورد
        </v-card-title>
        <v-card-text>
          شمای مختصری از آخرین اتفاقات مربوط به حساب کاربری
        </v-card-text>
      </v-card>
      <json-viewer :value="offers" dir="ltr"/>
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