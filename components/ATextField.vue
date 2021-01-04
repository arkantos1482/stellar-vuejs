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
      <input class="text-field input-border text-h6" :class="{'red-border':hasError}"
             :disabled="disabled" :type="type"
             :placeholder="hint"
             :value="value" @input="$emit('input', $event.target.value)"
             v-mask="mask">
      <slot></slot>
    </div>
    <p v-show="shouldValidate" class="red--text text-body-2">{{ errorBucket[0] }}</p>
  </div>
</template>
<script>
import VTextField from 'vuetify/lib/components/VTextField/VTextField'

export default {
  name: 'a-text-field',
  extends: VTextField,
  props: ['mask']
  // props: ['value', 'label', 'type', 'filled', 'readonly', 'hint', 'rules'],
}
</script>

<style>
.text-field {
  width: 100%;
  padding: 6px 12px;
}

.gray-border {
  border-radius: 4px;
  border: 1px solid #ccc;
}

.input-border:focus {
  outline: none !important;
  border: 1px solid dodgerblue;
  box-shadow: 0 0 4px lightblue;
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
