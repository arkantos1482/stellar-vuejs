<template>
  <v-row>
    <v-col>
      <h1>hello {{ userId }}</h1>
<!--      <v-carousel>-->

<!--      </v-carousel>-->
      <img :src="docs.ssn" width="200" height="200"/>
      <v-img :src="docs.ssn" width="200" height="200"/>
      <json-viewer dir="ltr" :value="docs"/>

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

