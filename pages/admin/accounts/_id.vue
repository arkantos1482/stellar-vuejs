<template>
  <div>
    <v-data-table :headers="headers" :items="list" :items-per-page="50" hide-default-footer>
      <template v-slot:item.address="{value}"><span class="text-body-2">{{ value }}</span></template>
      <template v-slot:item.link="{value}"><a target="_blank" :href="value">لینک</a></template>
      <template v-slot:item.action="{item}">
        <v-btn x-small color="success" @click="prepareDialog('deposit',item.type,item)">واریز</v-btn>
        <v-btn x-small color="error" @click="prepareDialog('withdraw',item.type,item)">برداشت</v-btn>
      </template>
    </v-data-table>

    <v-dialog width="400" v-model="d.ops">
      <v-card class="pa-6 text-center">
        <p class="text-h3">{{ action|toFa }}</p>
        <p class="text-h3">{{ payload.asset }}</p>
        <v-text-field v-model="payload.amount" label="مبلغ"/>
        <v-btn @click="applyPayment" :loading="l.payment"
               color="error" class="mt-6">اعمال
        </v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import pstopper from "@/mixins/pstopper";

export default {
  name: "AccountDetail",
  mixins: [pstopper],
  data() {
    return {
      headers: [
        {value: 'type', text: 'نوع'},
        {value: 'balance', text: 'موجودی'},
        {value: 'address', text: 'آدرس'},
        {value: 'link', text: 'ریز تراکنش ها'},
        {value: 'action', text: 'تصحیح', sortable: false}
      ],
      list: [],

      d: {ops: false},
      l: {payment: false},

      action: '',
      payload: {
        user_id: this.$route.params.id,
        asset: '',
        amount: ''
      }
    }
  },
  async mounted() {
    this.list = await this.$axios.$get(`/profiles/${this.payload.user_id}/addresses`)
  },
  methods: {
    prepareDialog(action, coin) {
      this.d.ops = true
      this.action = action
      this.payload.asset = coin.toUpperCase()
    },
    async applyPayment() {
      this.l.payment = true
      await this.$axios.$post(`/stellar/${this.action}`, this.payload)
      this.l.payment = false
      this.d.ops = false
      this.$bus.$emit('snack', 'با موفقیت انجام شد.', 'success')
    },
  },
}
</script>

<style scoped>

</style>