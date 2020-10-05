<template>
  <v-row>
    <v-text-field v-model="id" label="id"/>
    <v-text-field v-model="value" label="value"/>
    <v-btn @click="add">add</v-btn>
  </v-row>
</template>
<script>
export default {
  name: 'btc-account-list',
  data() {
    return {
      id: '',
      value: '',
      list: []
    }
  },
  methods: {
    add() {
      this.list.push({id: this.id, value: this.value})
      this.id = ''
      this.value = ''
      this.$emit('list', this.list)
    },
  }
}
</script>
