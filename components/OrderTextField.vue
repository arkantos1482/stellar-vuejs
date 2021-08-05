<template>
  <div>
    <div class="rounded d-flex align-center" style="padding: 6px 12px; background-color: #141633">
      <span class="grey--text">{{ prepend }}</span>
      <input dir="ltr" :disabled="readonly" class="px-2 order-text-field"
             :value="myText"
             @input="emit">
      <span class="grey--text">{{ append }}</span>
    </div>
    <p class="red--text text-body-2 mt-1">
      &nbsp;&nbsp;<span v-show="shouldValidate">{{ errorBucket[0] }}</span></p>
  </div>
</template>
<script>
import VTextField from 'vuetify/lib/components/VTextField/VTextField'
import {getDp, getMarketDp} from "@/models/cryptoPrecision";
import {remSeparated, safeDecimal, toSeparated} from "@/models/NumberUtil";

export default {
  name: 'order-text-field',
  extends: VTextField,
  props: ['prepend', 'append', 'readonly', 'marketDp', 'base', 'ctr'],
  data() {
    return {
      myText: ''
    }
  },
  watch: {
    value(newValue, oldValue) {
      let val = safeDecimal(newValue)
      if (this.marketDp) {
        val.todp(getMarketDp(this.base, this.ctr))
      } else {
        val.todp(getDp(this.base))
      }
      this.myText = toSeparated(val)
      // const regex = decimalRegex(getDp(this.type));
      // if (!regex.test(newValue)) {
      //   this.$emit('input', oldValue)
      // }

    }
  },
  methods: {
    emit(event) {
      const remSepValue = remSeparated(event.target.value);
      this.$emit('input', remSepValue)
    }
  },
}
</script>

<style lang="scss">
.order-text-field {
  outline: none;
  width: 100%;
  color: white;
}
</style>
