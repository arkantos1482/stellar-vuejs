<template>
  <div class="text-center">
    <p class="text-h3 text-right"> {{ user.email }}</p>
    <v-btn v-show="stellar.link" class="mb-2" color="primary"
           target="_blank" :href="stellar.link">رهگیری در استلار
    </v-btn>

    <v-data-table :headers="headers" :items="list" :items-per-page="50" hide-default-footer>
      <template v-slot:item.address="{value}"><span style="font-family: serif !important"
                                                    class="text-body1">{{ value }}</span></template>
      <template v-slot:item.private_key="{value}">
        <v-btn x-small @click="revealKey(value)">نمایش رمز</v-btn>
      </template>
      <template v-slot:item.link="{value}">
        <v-btn x-small color="primary" target="_blank" :href="value">ریزتراکنش</v-btn>
      </template>
      <template v-slot:item.stellar_correct="{item}">
        <v-btn x-small color="success" @click="depositStellarDialog(item.type)">واریز</v-btn>
        <v-btn x-small color="error" @click="withdrawStellarDialog(item.type)">برداشت</v-btn>
      </template>
      <template v-slot:item.crypto_correct="{item}">
        <v-btn x-small color="success" @click="depositCryptoDialog(item.type)">واریز</v-btn>
      </template>
    </v-data-table>

    <div class="mt-8 ">
      <v-btn :to="`/wallets/withdraws/all/${payload.user_id}`">برداشت ها</v-btn>
      <v-btn :to="`/wallets/deposits/all/${payload.user_id}`">واریزها</v-btn>
      <v-btn :to="`/offers/active/${payload.user_id}`">سفارشات فعال</v-btn>
      <v-btn :to="`/offers/${payload.user_id}`">سفارشات</v-btn>
      <v-btn :to="`/trades/${payload.user_id}`">معاملات</v-btn>
    </div>

    <v-dialog width="400" v-model="d.deposit_crypto">
      <v-card class="pa-6 text-center">
        <p class="text-h3">واریز کریپتو</p>
        <p class="text-h3">{{ payload.asset }}</p>
        <v-text-field v-model="payload.amount" label="مقدار"/>
        <v-btn @click="depositCrypto" :loading="l.payment"
               color="error" class="mt-6">اعمال
        </v-btn>
      </v-card>
    </v-dialog>

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

    <v-dialog width="600" v-model="d.reveal">
      <v-card>
        <p style="font-family: serif !important" class="text-h4 text-center py-8 px-12">{{ privateKey }}</p>
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
  data() {
    return {
      headers: [
        {value: 'type', text: 'نوع'},
        {value: 'balance', text: 'موجودی'},
        {value: 'address', text: 'آدرس', align: 'center'},
        {value: 'private_key', text: 'کلید', sortable: false, align: 'center'},
        {value: 'link', text: 'ریز تراکنش ها'},
        {value: 'stellar_correct', text: 'تصحیح استلار', sortable: false},
        {value: 'crypto_correct', text: 'تصحیح کریپتو', sortable: false}
      ],
      list: [],
      stellar: {address: '', link: ''},
      d: {
        deposit_stellar: false, withdraw_stellar: false,
        deposit_crypto: false,
        reveal: false
      },
      l: {payment: false},
      user: '',
      action: '',
      privateKey: '',
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
    revealKey(value) {
      this.d.reveal = true
      this.privateKey = value
    },
    depositStellarDialog(asset) {
      this.payload.asset = asset.toUpperCase()
      this.d.deposit_stellar = true
    },
    withdrawStellarDialog(asset) {
      this.payload.asset = asset.toUpperCase()
      this.d.withdraw_stellar = true
    },
    depositCryptoDialog(asset) {
      this.payload.asset = asset.toUpperCase()
      this.d.deposit_crypto = true
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
    async depositCrypto() {
      this.l.payment = true
      await this.$axios.$post('/crypto/transfer-from-bank', this.payload)
      this.l.payment = false
      this.d.deposit_crypto = false
      this.$bus.$emit('snack', 'با موفقیت انجام شد.', 'success')
    }
  },
}
</script>

<style scoped>

</style>