<template>
  <div>
    <v-data-table
        @click:row="goto"
        :headers="headers"
        :items="profileList"
        :items-per-page="50"
        hide-default-footer>
      <template v-slot:item.created_at="{value}">{{ value|toFarsiJustDate }}</template>
    </v-data-table>
    <v-pagination class="mt-4"
                  v-model="pagination.current"
                  :length="pagination.total"
                  @input="onPageChange"/>
  </div>
</template>

<script>
import {toIndexedList} from "@/models/utils";

export default {
  name: "payment",
  data() {
    return {
      headers: [
        {text: 'ردیف', value: 'index'},
        {value: 'email', text: 'ایمیل'},
        {value: 'name', text: 'نام'},
        {value: 'last_name', text: 'نام خانوادگی'},
        {value: 'cell_phone', text: 'موبایل'},
        // {value: 'action', text: 'اقدامات', sortable: false}
      ],
      profileList: [],
      pagination: {
        current: 1,
        total: 0
      }
    }
  },
  async mounted() {
    await this.getUsers()
  },
  methods: {
    async onPageChange() {
      await this.getUsers()
    },
    async getUsers() {
      let listWithMeta = await this.$axios.$get('/profiles?page=' + this.pagination.current)
      this.pagination.current = listWithMeta.current_page
      this.pagination.total = listWithMeta.last_page
      this.profileList = toIndexedList(listWithMeta.data)
    },
    async goto(item) {
      await this.$router.push(`/admin/transactions/${item.user_id}`)
    },
  }
}
</script>

<style scoped>

</style>