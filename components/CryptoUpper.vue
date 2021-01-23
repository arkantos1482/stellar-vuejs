<template>
  <div>
    <v-text-field dense outlined readonly :suffix="type|toFarsiCoin" placeholder="نوع ارز">
      <template v-slot:append>
        <v-img class="ml-2" max-width="24" max-height="24"
               :src="type|toCoinIcon"/>
      </template>
    </v-text-field>
    <div @click="emitBalance">
      <v-text-field dense outlined readonly :suffix="balance|toFloat|separated" placeholder="موجودی"
                    style="cursor: pointer"/>
    </div>
  </div>
</template>
<script>
export default {
  name: 'crypto-upper',
  props: ['balance', 'type'],
  methods: {
    emitBalance() {
      this.$emit('balanceClick', this.balance)
    }
  }
}
</script>
<style>
.v-text-field__prefix, .v-text-field__suffix {
  cursor: pointer;
}
</style>
