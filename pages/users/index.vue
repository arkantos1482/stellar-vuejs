<template>
  <v-row>
    <v-col>
      <v-data-table
          @click:row="goto"
          :headers="headers"
          :items="profileList"
          :items-per-page="50"
          hide-default-footer/>
      <v-pagination class="mt-4"
          v-model="pagination.current"
          :length="pagination.total"
          @input="onPageChange"
      ></v-pagination>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        {text: 'ردیف', value: 'index'},
        {text: 'ایمیل', value: 'email'},
        {text: 'نام', value: 'name'},
        {text: 'نام خانوادگی', value: 'last_name'},
        {text: 'سطح دسترسی', value: 'access_level'},
        {text: 'موبایل', value: 'cell_phone'}],
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
      this.profileList = listWithMeta.data.map((item, index) => ({...item, index: index + 1}))
    },
    goto($item) {
      this.$router.push('/Users/' + $item.user_id)
    },
  }
}
</script>

<style scoped>

</style>