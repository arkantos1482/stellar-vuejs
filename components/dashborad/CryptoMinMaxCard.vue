<template>
  <v-card class="pa-4">
    <a-row class="justify-space-between">
      <v-icon x-large color="primary">mdi-bitcoin</v-icon>
      <v-chip color="success">1/02%</v-chip>
      <span>1,265,23123132,123123</span>
    </a-row>
    <v-divider class="my-2"/>
    <a-row>
      <span class="grey--text">حداقل</span>
      <v-spacer/>
      <span>1600000</span>
      <span class="grey--text mr-2">ریال</span>
    </a-row>
    <a-row>
      <span class="grey--text">حداکثر</span>
      <v-spacer/>
      <span>1600000</span>
      <span class="grey--text mr-2">ریال</span>
    </a-row>
  </v-card>
</template>
<script>
export default {
  name: 'CryptoMinMaxCard'
}
</script>
