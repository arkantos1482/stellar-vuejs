<template>
  <v-col v-if="stat" cols="3">
    <v-card class="pa-4">
      <a-row class="justify-space-between align-center">
        <v-img max-width="36" max-height="36"
               :src="coin|toCoinIcon"/>
        <div class="rounded-pill px-3 py-1" :style="{background:dayChangeBackColor}">
          <span :class="dayChangeTextClass">{{ stat.dayChange|abs|percent }}
          </span></div>
        <span>{{ stat.latest|toFloat|separated }}</span>
      </a-row>
      <v-divider class="my-2"/>
      <a-row>
        <span class="grey--text">حداقل</span>
        <v-spacer/>
        <span>{{ stat.dayLow|toFloat|separated }}</span>
        <span class="grey--text mr-2">ریال</span>
      </a-row>
      <a-row>
        <span class="grey--text">حداکثر</span>
        <v-spacer/>
        <span>{{ stat.dayHigh|toFloat|separated }}</span>
        <span class="grey--text mr-2">ریال</span>
      </a-row>
    </v-card>
  </v-col>
</template>
<script>
export default {
  name: 'CryptoMinMaxCard',
  props: {
    coin: String,
    stat: {
      type: Object,
      default: {latest: 0, dayLow: 0, dayHigh: 0, dayChange: 0}
    }
  },
  filters: {
    abs: function (value) {
      return Math.abs(value)
    },
    percent: val => val + ' %'
  },
  computed: {
    dayChangeBackColor() {
      return this.stat.dayChange >= 0 ? '#7ce68e36' : '#fc697f36'
    },
    dayChangeTextClass() {
      return this.stat.dayChange >= 0 ? 'success--text' : 'error--text'
    }
  },
}
</script>
