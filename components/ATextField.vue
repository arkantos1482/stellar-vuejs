<template>
  <v-text-field outlined dense
                @change="$emit('input',$event)"
                :type="type"
                :value="value"
                :label="label"
                :filled="filled"/>
</template>
<script>
export default {
  name: 'a-text-field',
  props: ['value', 'label', 'type', 'filled'],
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
