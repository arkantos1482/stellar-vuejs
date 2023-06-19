<template>
  <div>
    <div
      class="rounded d-flex align-center"
      style="padding: 6px 12px; background-color: #f6f6f6"
    >
      <span class="grey--text">{{ prepend }}</span>
      <input
        dir="ltr"
        :disabled="readonly"
        class="px-2 order-text-field"
        :value="myText"
        @input="emit"
      />
      <span class="grey--text">{{ append }}</span>
    </div>
    <p class="red--text text-body-2 mt-1">
      &nbsp;&nbsp;<span v-show="shouldValidate">{{ errorBucket[0] }}</span>
    </p>
  </div>
</template>
<script>
import VTextField from "vuetify/lib/components/VTextField/VTextField"
import { getDp, getMarketDp } from "@/models/cryptoPrecision"
import {
  decimalRegex,
  remSeparated,
  safeDecimal,
  toSeparated,
} from "@/models/NumberUtil"

export default {
  name: "order-text-field",
  extends: VTextField,
  props: {
    prepend: String,
    append: String,
    readonly: Boolean,
    marketdp: Boolean,
    base: String,
    ctr: String,
  },
  data() {
    return {
      myText: this.value,
    }
  },
  watch: {
    value(newValue, oldValue) {
      this.myText = toSeparated(newValue)
      let regex

      if (this.marketdp) {
        regex = decimalRegex(getMarketDp(this.base, this.ctr))
      } else {
        regex = decimalRegex(getDp(this.base))
      }
      if (!regex.test(newValue)) {
        this.$emit("input", oldValue)
      }
    },
  },
  methods: {
    emit(event) {
      const remSepValue = remSeparated(event.target.value)
      this.$emit("input", remSepValue)
    },
  },
}
</script>

<style lang="scss">
.order-text-field {
  outline: none;
  width: 100%;
  //color: white;
}
</style>
