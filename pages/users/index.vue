<template>
  <div>
    <v-row>
      <v-col>
        <v-data-table
            @click:row="goto"
            :headers="headers"
            :items="profileList"
            :items-per-page="50"
            hide-default-footer>
          <template v-slot:item.created_at="{value}">{{ value|toFarsiJustDate }}</template>
          <template v-slot:item.user_id="{value}">
            <v-btn @click.stop="onMessage(value)">ارسال</v-btn>
          </template>
        </v-data-table>
        <v-pagination class="mt-4"
                      v-model="pagination.current"
                      :length="pagination.total"
                      @input="onPageChange"/>
      </v-col>
    </v-row>

    <v-dialog width="400" v-model="d.sendMessage">
      <v-card class="pa-6 text-center">
        <a-text-field label="تیتر" v-model="message.title"/>
        <v-textarea outlined label="توضیح" v-model="message.desc" class="mt-4"/>
        <v-btn @click="sendDirectMessage" :loading="l.send">ارسال</v-btn>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import {toIndexedList} from "@/models/utils";

export default {
  data() {
    return {
      headers: [
        {text: 'ردیف', value: 'index', align: 'center'},
        {text: 'ایمیل', value: 'email', align: 'center'},
        {text: 'نام', value: 'name', align: 'center'},
        {text: 'نام خانوادگی', value: 'last_name', align: 'center'},
        {text: 'سطح دسترسی', value: 'access_level', align: 'center'},
        {text: 'موبایل', value: 'cell_phone', align: 'center'},
        {text: 'زمان ثبت نام', value: 'created_at', align: 'center'},
        {text: 'پیام', value: 'user_id', sortable: false, align: 'center'}
      ],
      profileList: [],
      pagination: {
        current: 1,
        total: 0
      },
      message: {user_id: '', title: '', desc: ''},
      d: {sendMessage: false},
      l: {send: false},
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
    goto($item) {
      this.$router.push('/Users/' + $item.user_id)
    },
    onMessage(user_id) {
      this.d.sendMessage = true
      this.message.user_id = user_id
    },
    async sendDirectMessage() {
      this.l.send = true
      await this.$axios.$post('/messages/send_direct', this.message);
      this.l.send = false
      this.d.sendMessage = false
    }
  }
}
</script>

<style scoped>

</style>