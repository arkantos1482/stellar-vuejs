<template>
  <v-col v-if="stat" cols="3">
    <div class="pa-4">
      <a-row class="justify-space-between align-center">
        <v-img max-width="36" max-height="36" :src="coin | toCoinIcon" />
        <div
          class="rounded-pill px-3 py-1"
          :style="{ background: dayChangeBackColor }"
        >
          <span :class="dayChangeTextClass"
            >{{ stat.dayChange | abs | percent }}
          </span>
        </div>
        <span>{{ stat.latest | toToman | toFloat | separated }}</span>
      </a-row>
      <v-divider class="ma-2" />
      <a-row>
        <span class="grey--text">حداقل</span>
        <v-spacer />
        <span>{{ stat.dayLow | toToman | toFloat | separated }}</span>
        <span class="grey--text mr-2">تومان</span>
      </a-row>
      <a-row>
        <span class="grey--text">حداکثر</span>
        <v-spacer />
        <span>{{ stat.dayHigh | toToman | toFloat | separated }}</span>
        <span class="grey--text mr-2">تومان</span>
      </a-row>
    </div>
  </v-col>
</template>
<script>
export default {
  name: "CryptoMinMaxCard",
  props: {
    coin: String,
    stat: {
      type: Object,
      default() {
        return { latest: 0, dayLow: 0, dayHigh: 0, dayChange: 0 }
      },
    },
  },
  filters: {
    abs: (val) => Math.abs(val),
    percent: (val) => val + " %",
    toToman: (val) => val / 10,
  },
  computed: {
    dayChangeBackColor() {
      return this.stat.dayChange >= 0 ? "#7ce68e36" : "#fc697f36"
    },
    dayChangeTextClass() {
      return this.stat.dayChange >= 0 ? "success--text" : "error--text"
    },
  },
}
</script>
