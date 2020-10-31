<template>
  <v-row justify="center">
    <v-col cols="9">
      <h1>hello {{ userId }}</h1>
      <v-carousel cycle height="400">
        <v-carousel-item :src="docs.ssn"/>
        <v-carousel-item :src="docs.bill"/>
      </v-carousel>
      <h1>تایید</h1>
      <p>check boxes</p>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      userId: this.$route.params.id,
      docs: {
        ssn: '',
        bill: ''
      }
    }
  },
  async fetch() {
    this.docs.ssn = await this.$axios.$get('/profiles/' + this.userId + '/docs/ssn')
    this.docs.bill = await this.$axios.$get('/profiles/' + this.userId + '/docs/bill')
  }
}
</script>

<style scoped>

</style>

