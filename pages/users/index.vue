<template>
  <v-row>
    <v-col>
      <v-simple-table>
        <thead>
        <tr>
          <th>نام</th>
          <th>نام خانوادگی</th>
          <th>ایمیل</th>
          <th>موبایل</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item,key) in profileList" :key="key" @click="goto(item.user_id)">
          <td>{{ item.name }}</td>
          <td>{{ item.last_name }}</td>
          <td>{{ item.email }}</td>
          <td>{{ item.cell_phone }}</td>
        </tr>
        </tbody>
      </v-simple-table>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      profileList: []
    }
  },
  async fetch() {
    this.profileList = await this.$axios.$get('/profiles');
  },
  methods: {
    goto($id) {
      this.$router.push('/Users/' + $id)
    }
  }
}
</script>

<style scoped>

</style>