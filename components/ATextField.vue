<template>
  <div class="text-right">
    <label class="text-h6">{{ label }}</label>
    <b-form-input
        class="text-h5"
        :readonly="readonly"
        :value="value"
        @input="$emit('input',$event)"
        :type="type"
        :state="isValid"/>

    <!-- This will only be shown if the preceding input has an invalid state -->
    <b-form-invalid-feedback> {{ errorMsg }}</b-form-invalid-feedback>

    <!-- This is a form text block (formerly known as help block) -->
    <b-form-text>{{ hint }}</b-form-text>

<!--    <v-text-field outlined dense-->
<!--                  @change="$emit('input',$event)"-->
<!--                  :type="type"-->
<!--                  :hint="hint"-->
<!--                  :value="value"-->
<!--                  :label="label"-->
<!--                  :filled="filled"-->
<!--                  :readonly="readonly"-->
<!--                  :rules="rules"-->
<!--    />-->
  </div>
</template>
<script>
import collect from 'collect.js'

export default {
  name: 'a-text-field',
  props: ['value', 'label', 'type', 'filled', 'readonly', 'hint', 'rules'],
  computed: {
    isValid() {
      let value = this.value
      return collect(this.rules)
          .every(item => typeof item(value) !== 'string') ? null : false
    },
    errorMsg() {
      let value = this.value
      const first = collect(this.rules)
          .first(item => item(value) !== 'string')
      return first ? first(value) : 'hichi'
    }
  }
}
</script>

<style>
/*.v-text-field input {*/
/*  font-size: 12.2em;*/
/*}*/

/*.v-input .v-label {*/
/*  font-size: 5.2em;*/
/*}*/
</style>
