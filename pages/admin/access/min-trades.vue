<template>
  <v-row justify="center">
    <v-col cols="6">
      <v-data-table :headers="headers" :items="items" @click:row="showDialog"
                    hide-default-footer items-per-page="200"/>
      <div class="text-center mt-4">
        <v-btn color="primary" @click="d.put = true" class="px-8">تغییر/اضافه</v-btn>
      </div>
    </v-col>

    <v-dialog width="400" v-model="d.put">
      <v-card class="pa-6 text-center">
        <v-select outlined label="رمزارز پایه" :items="coinList" v-model="req.base_coin"/>
        <v-select outlined label="رمزارز مقصد" :items="coinList" v-model="req.counter_coin"/>
        <a-text-field label="مینیمم" v-model="req.min"/>
        <v-btn :loading="l.put" @click="store" color="primary" class="mt-4">ثبت</v-btn>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import {coinList} from "@/models/coinList";

export default {
  name: "min-trades",
  computed: {
    coinList: () => coinList
  },
  data() {
    return {
      headers: [
        {value: 'base_coin', text: 'رمزارز پایه', align: 'center'},
        {value: 'counter_coin', text: 'رمزارز مقصد', align: 'center'},
        {value: 'min', text: 'مینیمم', align: 'center'},
      ],
      req: {base_coin: '', counter_coin: '', min: ''},
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
      this.items = await this.$axios.$get('/access/min-trades')
    },
    async store() {
      this.l.put = true
      await this.$axios.$post('/access/min-trade', this.req)
      await this.refresh()
      this.d.put = false
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