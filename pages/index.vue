<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <div class="text-center">
      </div>
      <v-card>
        <v-card-title class="headline">
          داشبورد
        </v-card-title>
        <v-card-text>
          شمای مختصری از آخرین اتفاقات مربوط به حساب کاربری
        </v-card-text>
        <v-card-subtitle>
          <pre dir="auto">{{ cryptoProfile | prettyJson }}</pre>
        </v-card-subtitle>
        <v-card-actions>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      cryptoProfile: ''
    }
  }, async mounted() {
    this.cryptoProfile = await this.$axios.$get('/crypto/ltc/address')
  }
}
</script>
