<template>
  <div>
    <v-text-field dense outlined readonly :suffix="type|toFarsiCoin" placeholder="نوع ارز">
      <template v-slot:append>
        <v-img class="ml-2" max-width="24" max-height="24"
               :src="type|toCoinIcon"/>
      </template>
    </v-text-field>
    <v-text-field dense outlined readonly :suffix="balance|toFloat" placeholder="موجودی"/>
  </div>
</template>
<script>
export default {
  name: 'crypto-upper',
  props: ['balance', 'type']
}
</script>
