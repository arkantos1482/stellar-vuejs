<template>
  <v-row justify="center">
    <v-col cols="6">
      {{ amount }}
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      amount: this.$route.query.amount
    }
  }
}
</script>

<style scoped>

</style>