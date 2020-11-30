<template>
  <v-row>
    <v-col>
      <v-data-table
          :headers="headers"
          :items="list"
          hide-default-footer>
        <template v-slot:item.item_actions="{item}">
          <v-btn @click="remove(item.id)" color="red">حذف</v-btn>
        </template>
      </v-data-table>
      <v-btn :to="this.$route.path+`/create`" color="primary" class="mt-4">ایجاد</v-btn>
      <v-btn @click="$router.back()" class="mt-4">بازگشت</v-btn>
    </v-col>
  </v-row>
</template>

<script>
import collect from 'collect.js'

export default {
  data() {
    return {
      levelId: this.$route.params.id,
      headers: [
        {text: 'منبع', value: 'resource'},
        {text: 'عمل', value: 'action'},
        {text: 'زمان اعمال', value: 'period'},
        {text: 'سقف', value: 'max'},
        {text: 'اقدامات', value: 'item_actions'},
      ],
      list: [],
    }
  },
  async mounted() {
    this.list = await this.$axios.$get('/access/' + this.levelId + '/limits')
  },
  methods: {
    async remove(id) {
      try {
        await this.$axios.delete('/access/' + this.levelId + '/limits/' + id)
        this.list = collect(this.list).reject(item => item.id === id).all()
      } catch (e) {
      }
    }
  }
}
</script>

<style scoped>

</style>