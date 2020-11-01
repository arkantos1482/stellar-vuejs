<template>
  <v-row justify="center">
    <v-col cols="6">
      <v-data-table
          :headers="headers"
          :items="levels"
          hide-default-footer>
        <template v-slot:item.action="{item}">
          <v-btn @click="remove(item.id)" color="red">حذف</v-btn>
          <v-btn :to="`/admin/access/`+item.id+`/rules`">قوانین</v-btn>
          <v-btn :to="`/admin/access/`+item.id+`/limits`">محدودیت ها</v-btn>
        </template>
      </v-data-table>

      <v-dialog v-model="dialog.show" width="400">
        <v-card>
          <v-card-text>
            <v-text-field v-model="dialog.name" label="نام"/>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="insert">انجام</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-btn @click="dialog.show = true" color="primary" class="mt-8">ایجاد</v-btn>
    </v-col>
  </v-row>
</template>

<script>
import collect from 'collect.js'

export default {
  data() {
    return {
      dialog: {
        show: false,
        name: '',
      },
      headers: [{text: 'نام سطح', value: 'name'}, {text: 'اقدامات', value: 'action'}],
      levels: []
    }
  },
  async fetch() {
    this.levels = await this.$axios.$get('/access/levels')
  },
  methods: {
    async insert() {
      this.dialog.show = false
      try {
        let item = await this.$axios.$post('/access/levels', {'name': this.dialog.name})
        this.levels.push(item)
      } catch (e) {
        //todo send error snackbar
      }
    },
    async remove(id) {
      try {
        await this.$axios.$delete('/access/levels/' + id)
        this.levels = collect(this.levels).reject(item => item.id === id).all()
      } catch (e) {
        //todo send error snackbar
      }
    }
  }
}
</script>

<style scoped>

</style>