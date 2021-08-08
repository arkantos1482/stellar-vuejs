<template>
  <v-row justify="center">
    <v-col cols="6">
      <v-data-table :headers="headers" :items="items" @click:row="showDialog"/>
      <v-btn color="primary" :click="d.put = true">تغییر/اضافه</v-btn>
    </v-col>

    <v-dialog width="400" v-model="d.put">
      <v-card class="pa-6 text-center">
        <v-select outlined label="رمزارز" :items="coinList" v-model="req.coin"/>
        <a-text-field label="مینیمم" v-model="req.min"/>
        <v-btn :loading="l.put" @click="store">ارسال</v-btn>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import {coinList} from "@/models/coinList";

export default {
  name: "min-withdraws",
  computed: {
    coinList: () => coinList
  },
  data() {
    return {
      headers: [
        {value: 'coin', text: 'رمزارز', align: 'center'},
        {value: 'min', text: 'مینیمم', align: 'center'},
      ],
      req: {coin: '', min: ''},
      items: [],
      d: {put: false},
      l: {put: false}
    }
  },
  async mounted() {
    await this.refresh()
  },
  methods: {
    async refresh() {
      this.items = await this.$axios.$get('/access/min-withdraws')
    },
    async store() {
      this.l.put = true
      await this.$axios.$post('/access/min-withdraw', this.req)
      await this.refresh()
      this.l.put = false
    },
    showDialog(item) {
      this.req.coin = item.coin
      this.d.put = true
    }
  }
}
</script>

<style scoped>

</style>