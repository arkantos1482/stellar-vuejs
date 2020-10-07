<template>
  <v-row justify="center" class="text-center">
    <v-col cols="6">
      <p>{{ res }}</p>
      <v-btn @click="call">call</v-btn>
      <p class="mt-8">{{ res2 }}</p>
      <v-btn @click="call2">call2</v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "ApiTest",
  data() {
    return {
      res: 'empty',
      res2: 'empty',
    }
  }, methods: {
    async call() {
      this.res = await this.$axios.$get('/crypto/btc');
    },
    async call2() {
      this.res2 = await this.$axios.$get('/crypto/eth');
    }
  }
}
</script>

<style scoped>

</style>