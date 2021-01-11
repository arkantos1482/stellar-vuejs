<template>
  <v-row>
    <v-col>
      <v-data-table
          @click:row="goto"
          :headers="headers"
          :items="profileList"
          items-per-page="50"
          hide-default-footer/>
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
      profileList: []
    }
  },
  async mounted() {
    let list = await this.$axios.$get('/profiles')
    this.profileList = list.map((item, index) => ({...item, index: index + 1}))
  },
  methods: {
    goto($item) {
      this.$router.push('/Users/' + $item.user_id)
    }
  }
}
</script>

<style scoped>

</style>