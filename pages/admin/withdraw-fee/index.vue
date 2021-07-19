<template>
  <v-row justify="center">
    <v-col cols="4">
      <v-simple-table>
        <thead>
        <tr>
          <th>رمزارز</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item,index) in items" :key="index" @click="goto(item)">
          <td>{{ item }}</td>
        </tr>
        </tbody>
      </v-simple-table>
    </v-col>
  </v-row>
</template>

<script>

export default {
  data() {
    return {
      items: ['BTC', 'ETH', 'USDT', 'USDT_TRON', 'TRX', 'BNB', 'DRC', 'LTC', 'BCH', 'AMN', 'EBG', 'ART', 'ZRK', 'TLS', 'SHA', 'WIT']
    }
  },
  methods: {
    goto(coin) {
      this.$router.push('/admin/withdraw-fee/' + coin)
    },
  }
}
</script>

