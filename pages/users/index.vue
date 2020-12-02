<template>
  <v-row>
    <v-col>
      <v-data-table
          @click:row="goto"
          :headers="headers"
          :items="profileList"
          hide-default-footer/>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        {text: 'نام', value: 'name'},
        {text: 'نام خانوادگی', value: 'last_name'},
        {text: 'موبایل', value: 'cell_phone'}],
      profileList: []
    }
  },
  async mounted() {
    this.profileList = await this.$axios.$get('/profiles');
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