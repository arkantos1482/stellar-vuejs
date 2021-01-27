<template>
  <div>
    <div class="rounded grey lighten-4 d-flex align-center text-h6" style="padding: 6px 12px">
      <span class="grey--text">{{ prepend }}</span>
      <input dir="ltr" :disabled="readonly" class="px-2" style="outline: none;width: 100%"
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
import {getDp} from "@/models/cryptoPrecision";

export default {
  name: 'order-text-field',
  extends: VTextField,
  props: ['prepend', 'append', 'readonly', 'type'],
  data() {
    return {
      myText: ''
    }
  },
  watch: {
    value(newValue, oldValue) {
      this.myText = newValue
      const regex = this.decimalRegex(getDp(this.type));
      if (!regex.test(newValue)) {
        this.$emit('input', oldValue)
      }
    }
  },
  methods: {
    decimalRegex(dp) {
      let pattern = '^$|^(\\d+\\.?(\\d{1,' + dp + '})?)$'
      let regex = new RegExp(pattern)
      return regex
    },
    emit(event) {
      this.$emit('input', event.target.value)
    }
  },
}
</script>
