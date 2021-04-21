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
    <p class="text-h6 mb-n2 mt-4">{{ label }}</p><br>
    <div class="d-flex gray-border">
      <input class="text-field input-border text-h6"
             :class="{'red-border':shouldValidate ,'py-2':eng, eng:eng, ef1:eng,ef2:eng,
             'dark-theme-text':isDark,'white-theme-text':!isDark}"
             :disabled="disabled" :type="type"
             :placeholder="hint"
             :value="myText" @input="emit"
             v-mask="mask">
      <slot></slot>
    </div>
    <p v-show="shouldValidate" class="red--text text-body-2 mt-2">{{ errorBucket[0] }}</p>
  </div>
</template>
<script>
import VTextField from 'vuetify/lib/components/VTextField/VTextField'
import {remSeparated, toSeparated} from "@/models/NumberUtil";

export default {
  name: 'a-text-field',
  extends: VTextField,
  props: {mask: String, eng: Boolean, separated: Boolean},
  data() {
    return {
      myText: ''
    }
  },
  watch: {
    value(newValue, oldValue) {
      this.myText = this.separated ? toSeparated(newValue) : newValue
    }
  },
  methods: {
    emit(event) {
      const value = this.separated ? remSeparated(event.target.value) : event.target.value
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

.gray-border {
  border-radius: 4px;
  border: 1px solid #ccc;
}

.input-border:focus {
  outline: none !important;
  border: 1px solid #ffbb00;
  //box-shadow: 0 0 2px #c4bca9;
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
