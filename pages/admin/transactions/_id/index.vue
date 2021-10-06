<template>
  <div class="text-center">
    <p class="text-h3 text-right"> {{ user.email }}</p>

    <div class="mt-8 ">
      <v-btn :to="`/admin/transactions/${user_id}/crypto`">رمزارزها</v-btn>
      <v-btn :to="`/wallets/${user_id}`">کیف پول</v-btn>
    </div>

    <div class="my-4 ">
      <v-btn :to="`/offers/active/${payload.user_id}`">سفارشات فعال</v-btn>
      <v-btn :to="`/offers/${payload.user_id}`">سفارشات</v-btn>
      <v-btn :to="`/trades/${payload.user_id}`">معاملات</v-btn>
      <v-btn :to="`/wallets/${payload.user_id}/withdraws`">برداشت ها</v-btn>
      <v-btn :to="`/wallets/${payload.user_id}/deposits`">واریزها</v-btn>
    </div>

    <v-data-table :headers="headers" :items="list" :items-per-page="50" hide-default-footer>
      <template v-slot:item.stellar_correct="{item}">
        <v-btn x-small color="success" @click="depositStellarDialog(item.type)">واریز</v-btn>
        <v-btn x-small color="error" @click="withdrawStellarDialog(item.type)">برداشت</v-btn>
      </template>
    </v-data-table>

    <v-dialog width="400" v-model="d.withdraw_stellar">
      <v-card class="pa-6 text-center">
        <p class="text-h3">برداشت استلار</p>
        <p class="text-h3">{{ payload.asset }}</p>
        <v-text-field v-model="payload.amount" label="مقدار"/>
        <v-btn @click="withdrawStellar" :loading="l.payment"
               color="error" class="mt-6">اعمال
        </v-btn>
      </v-card>
    </v-dialog>

    <v-dialog width="400" v-model="d.deposit_stellar">
      <v-card class="pa-6 text-center">
        <p class="text-h3">واریز استلار</p>
        <p class="text-h3">{{ payload.asset }}</p>
        <v-text-field v-model="payload.amount" label="مقدار"/>
        <v-btn @click="depositStellar" :loading="l.payment"
               color="error" class="mt-6">اعمال
        </v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import pstopper from "@/mixins/pstopper"
import collect from "collect.js"

export default {
  name: "AccountDetail",
  mixins: [pstopper],
  computed: {
    user_id() {
      return this.$route.params.id
    }
  },
  data() {
    return {
      headers: [
        {value: 'type', text: 'نوع', align: 'center'},
        {value: 'balance', text: 'موجودی استلاری', align: 'center'},
        {value: 'stellar_correct', text: 'تصحیح استلار', sortable: false, align: 'center'},
      ],
      list: [],
      d: {
        deposit_stellar: false, withdraw_stellar: false,
        reveal: false
      },
      l: {payment: false},
      user: '',
      action: '',
      payload: {
        user_id: this.$route.params.id,
        asset: '',
        amount: ''
      }
    }
  },
  async mounted() {
    await this.getBalances()
    this.user = await this.$axios.$get('/profiles/' + this.payload.user_id);
  },
  methods: {
    async getBalances() {
      let list = await this.$axios.$get(`/profiles/${this.payload.user_id}/addresses`)
      this.stellar = collect(list).filter(item => item.type === 'MAIN').first()
      this.list = collect(list).reject((item => item.type === 'MAIN')).all()
    },
    depositStellarDialog(asset) {
      this.payload.asset = asset.toUpperCase()
      this.d.deposit_stellar = true
    },
    withdrawStellarDialog(asset) {
      this.payload.asset = asset.toUpperCase()
      this.d.withdraw_stellar = true
    },
    async depositStellar() {
      this.l.payment = true
      await this.$axios.$post('/stellar/deposit', this.payload)
      this.l.payment = false
      this.d.deposit_stellar = false
      this.$bus.$emit('snack', 'با موفقیت انجام شد.', 'success')
      await this.getBalances()
    },
    async withdrawStellar() {
      this.l.payment = true
      await this.$axios.$post('/stellar/withdraw', this.payload)
      this.l.payment = false
      this.d.withdraw_stellar = false
      this.$bus.$emit('snack', 'با موفقیت انجام شد.', 'success')
      await this.getBalances()
    },
  },
}
</script>

<style scoped>

</style>