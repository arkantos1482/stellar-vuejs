<template>
  <a-row class="align-center mb-4">
    <v-col cols="3">
      <p class=" mb-2 grey--text">{{ list_name }}</p>
      <v-select dense outlined flat
                v-model="item" :items="list"></v-select>
    </v-col>

    <v-col cols="3">
      <p class=" mb-2 grey--text">{{ from_name }}</p>
      <custom-date-picker v-model="date.from"/>
      <div style="height: 26px"/>
    </v-col>

    <v-col cols="3">
      <p class=" mb-2 grey--text">{{ to_name }}</p>
      <custom-date-picker v-model="date.to"/>
      <div style="height: 26px"/>
    </v-col>

    <v-col cols="3" style="text-align: left">
      <v-btn outlined color="primary" min-width="75%" style="height: 40px">جستجو</v-btn>
    </v-col>
  </a-row>

</template>

<script>
export default {
  name: "ATableHeader",
  props: ['list', 'list_name', 'from_name', 'to_name'],
  data() {
    return {
      item: 'همه',
      date: {from: '', to: ''},
    }
  },
}
</script>

<style scoped>

</style>