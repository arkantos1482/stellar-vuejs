<template>

  <v-col v-if="type==='enum'" cols="2" class="container">
    <p class=" mb-2 grey--text">{{ name }}</p>
    <v-select dense outlined flat
              :value="value" @input="$emit('input', $event)"
              :items="options"></v-select>
  </v-col>

  <v-col v-else-if="type==='text'" cols="2">
    <a-text-field :label="name"
                  :value="value"
                  @input="$emit('input', $event)"
                  no-error class="mx-2"/>
  </v-col>

  <v-col v-else-if="type==='time'" cols="2">
    <p class=" mb-2 grey--text text-body-2">{{ name }}</p>
    <custom-date-picker :value="value" @input="$emit('input', $event)"/>
  </v-col>


</template>

<script>
import ATextField from "./ATextField";

export default {
  name: "ATableFilterField",
  components: {ATextField},
  props: ['value', 'type', 'name', 'options']
}
</script>

<style scoped>
.container >>> .v-text-field__details {
  display: none;
}
</style>