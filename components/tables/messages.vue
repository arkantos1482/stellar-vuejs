<template>
  <div>
    <v-data-table :items="items" :headers="headers" hide-default-footer items-per-page="200">
      <template v-slot:item.is_read="{item}">
        <v-checkbox readonly :value="item.is_read"/>
      </template>
      <template v-slot:item.msg="{item}">
        <p>{{ item.title }}</p>
        <p>{{ item.desc }}</p>
      </template>
      <template v-slot:item.created_at="{item}">
        <p>{{ item.created_at|toFarsiDate }}</p>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'messages',
  props: ['category'],
  computed: {
    headers() {
      return [
        {value: 'is_read', text: 'وضعیت', align: 'center'},
        {value: 'msg', text: 'متن', align: 'center'},
        {value: 'created_at', text: 'تاریخ', align: 'center'},
      ];
    }
  },
  data() {
    return {
      items: []
    }
  },
  async mounted() {
    let link = '/messages/me'
    if (this.category) link += '/' + this.category
    this.items = await this.$axios.$get(link)
  }
}
</script>

<style scoped>

</style>