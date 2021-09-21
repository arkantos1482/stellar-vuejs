<template>
  <!--  <v-text-field outlined dense-->
  <!--                @change="$emit('input',$event)"-->
  <!--                :type="type"-->
  <!--                :hint="hint"-->
  <!--                :value="value"-->
  <!--                :label="label"-->
  <!--                :filled="filled"-->
  <!--                :readonly="readonly"-->
  <!--                :rules="rules"-->
  <!--  />-->

  <div class="text-right">
    <p class="mb-n2 mt-2 grey--text text-body-2">{{ label }}</p><br>
    <div class="d-flex grey-border">
      <slot></slot>
      <input class="text-field input-border py-2"
             :class="{'red-border':shouldValidate , eng:eng, ef1:eng,ef2:eng,
             'dark-theme-text':isDark,'white-theme-text':!isDark}"
             :disabled="disabled" :type="type"
             :placeholder="hint"
             :value="myText" @input="emit"
             v-mask="mask">
      <div class="v-text-field__details">
        <!--        <div class="v-messages primary&#45;&#45;text">-->
        <!--          <div class="v-messages__wrapper"></div>-->
        <!--        </div>-->
      </div>
    </div>
    <p v-show="shouldValidate" v-if="!noError" class="red--text text-body-2 mt-2">{{ errorBucket[0] }}</p>
  </div>
</template>
<script>
import VTextField from 'vuetify/lib/components/VTextField/VTextField'
import {decimalRegex, remSeparated, safeDecimal, toSeparated} from "@/models/NumberUtil";
import {getDp, getMarketDp} from "@/models/cryptoPrecision";

export default {
  name: 'a-text-field',
  extends: VTextField,
  props: {mask: String, eng: Boolean, separated: Boolean, isCoin: Boolean, coin: String, noError: Boolean},
  data() {
    return {
      myText: this.value
    }
  },
  watch: {
    value(newValue, oldValue) {
      this.myText = this.separated ? toSeparated(newValue) : newValue

      if (this.isCoin) {
        const regex = decimalRegex(getDp(this.coin))
        if (!regex.test(newValue)) {
          this.$emit('input', oldValue)
        }
      }
    }
  },
  methods: {
    emit(event) {
      let value = this.separated ? remSeparated(event.target.value) : event.target.value
      // if (this.isCoin) {
      //   value = safeDecimal(value).todp(getDp(this.coin))
      // }
      this.$emit('input', value)
    }
  },
}
</script>

<style>
.text-field {
  width: 100%;
  padding: 6px 12px;
}

.dark-theme-text {
  color: white;
}

.white-theme-text {
  color: black;
}

.grey-border {
  border-radius: 4px;
  border: 1px solid #a7a9cf66;
}

.input-border:focus {
  outline: none !important;
  border: 1px solid #ffbb00;
  /*box-shadow: 0 0 2px #c4bca9;*/
}

.red-border {
  /*border-radius: 4px;*/
  /*border: 1px solid red;*/
}


/*.v-text-field input {*/
/*  font-size: 12.2em;*/
/*}*/

/*.v-input .v-label {*/
/*  font-size: 5.2em;*/
/*}*/
</style>
