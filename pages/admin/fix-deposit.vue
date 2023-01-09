<template>
  <div>
    <v-row justify="center">
      <v-col cols="6">
        <v-select filled label="currency" :items="coinList" v-model="currency"/>
        <v-text-field filled label="network" v-model="network" hint="اگر تتر نیست خالی بگذارید"/>
        <v-text-field filled label="transaction_id" v-model="transaction_id"/>
        <v-text-field filled label="address" v-model="address"/>
      </v-col>
    </v-row>

    <v-row justify="center" align="baseline" class="my-4">
      <v-btn color="primary" @click="send" :loading="l.send">درخواست تصحیح</v-btn>
    </v-row>
  </div>
</template>

<script>
import {coinList} from "@/models/coinList";
import ps from "@/mixins/pstopper"


export default {
  name: "FixDeposit",
  mixins:[ps],
  computed: {
    coinList: () => coinList
  },
  data() {
    return {
      currency: '',
      transaction_id: '',
      address: '',
      network: '',
      l: {
        send: false
      }
    }
  },
  methods: {
    async send() {
      this.l.send = true
      this.res = await this.$axios.$post('/crypto/fix-deposit', {
        currency: this.currency,
        transaction_id: this.transaction_id,
        address: this.address,
        network: this.network,
      });
      this.l.send = false
      this.$bus.$emit('snack', 'با موفقیت ثبت شد.', 'success')
    }
  }
}
</script>

<style scoped>

</style>
