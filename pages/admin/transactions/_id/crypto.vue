<template>
  <div class="text-center">
    <p class="text-h3 text-right"> {{ user.email }}</p>

    <v-data-table :headers="headers" :items="items" :items-per-page="50" hide-default-footer>
      <template v-slot:item.accumulate="{item}">
        <v-btn small color="success" @click="accumulateDialog(item.coin)">تخلیه</v-btn>
      </template>
    </v-data-table>

    <v-dialog width="400" v-model="d.accumulate">
      <v-card class="pa-6 text-center">
        <p class="text-h3">انتقال به بانک</p>
        <p class="text-h3">{{ accumulate_req.currency }}</p>
        <v-text-field v-model="accumulate_req.amount" label="مقدار"/>
        <v-btn @click="accumulate" :loading="l.accumulate"
               color="error" class="mt-6">اعمال
        </v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import pstopper from "@/mixins/pstopper"
import {toIndexedList} from "@/models/utils";


export default {
  mixins: [pstopper],
  computed: {
    user_id() {
      return this.$route.params.id
    }
  },
  data() {
    return {
      headers: [
        {value: 'coin', text: 'رمزارز', align: 'center', sortable: false},
        {value: 'balance', text: 'بالانس', align: 'center', sortable: false},
        {value: 'accumulate', text: 'انتقال به بانک', sortable: false, align: 'center'},
      ],
      items: [],
      d: {
        accumulate: false,
      },
      l: {accumulate: false},
      user: '',
      action: '',
      accumulate_req: {
        user_id: this.$route.params.id,
        currency: '',
        amount: ''
      }
    }
  },
  mounted() {
    this.refresh()
  },
  methods: {
    async refresh() {
      let items = await this.$axios.$get('/crypto/balances/' + this.user_id)
      this.items = toIndexedList(items)
    },
    accumulateDialog(currency) {
      this.accumulate_req.currency = currency.toUpperCase()
      this.d.accumulate = true
    },
    async accumulate() {
      this.l.accumulate = true
      await this.$axios.$post('/crypto/accumulate', this.accumulate_req)
      this.l.accumulate = true
      this.d.accumulate = false
      this.$bus.$emit('snack', 'با موفقیت انجام شد.', 'success')
    },
  },
}
</script>

<style scoped>

</style>
