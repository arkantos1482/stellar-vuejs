<template>
  <v-text-field outlined dense
                @change="$emit('input',$event)"
                :type="type"
                :hint="hint"
                :value="value"
                :label="label"
                :filled="filled"
                :readonly="readonly"
                :rules="rules"
  />
</template>
<script>
export default {
  name: 'a-text-field',
  props: ['value', 'label', 'type', 'filled', 'readonly', 'hint', 'rules'],
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
