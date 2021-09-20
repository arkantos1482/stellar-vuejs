<template>

  <v-col v-if="type==='enum'" cols="2">
    <p class=" mb-2 grey--text">{{ name }}</p>
    <v-select dense outlined flat
              :value="value" @input="$emit('input', $event)"
              :items="options"></v-select>
  </v-col>

  <v-col v-else-if="type==='text'" cols="2">
    <a-text-field :label="name"
                  :value="value"
                  @input="$emit('input', $event)" class="mx-2"/>
  </v-col>

  <v-col v-else-if="type==='time'" cols="2">
    <p class=" mb-2 grey--text">{{ name }}</p>
    <custom-date-picker :value="value" @input="$emit('input', $event)"/>
    <div style="height: 26px"/>
  </v-col>


</template>

<script>
export default {
  name: "ATableFilterField",
  props: ['value', 'type', 'name', 'options']
}
</script>

<style scoped>

</style>