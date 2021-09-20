<template>
  <div>
    <v-row>
      <v-col>
        <a-row class="align-end mb-6 mt-n6">
          <a-table-filter-field type="text" name="ایمیل" v-model="filterQuery['users.email']"/>
          <a-table-filter-field type="text" name="نام" v-model="filterQuery.name"/>
          <a-table-filter-field type="text" name="نام خانوادگی" v-model="filterQuery.last_name"/>
          <a-table-filter-field type="text" name="موبایل" v-model="filterQuery.cell_phone"/>
          <a-table-filter-field type="time" name="قبل از" v-model="filterQuery.before"/>
          <a-table-filter-field type="time" name="بعد از" v-model="filterQuery.after"/>

          <v-btn @click="$refs.table.refresh()"
                 outlined class="py-5 px-8 mx-2" color="primary">اعمال</v-btn>
        </a-row>
        <a-paged-table ref="table"
                       :headers="headers"
                       :filter-query="filterQuery"
                       url="/profiles"
                       @click:row="goto"
        >
          <template v-slot:item.created_at="{value}">{{ value|toFarsiJustDate }}</template>
          <template v-slot:item.user_id="{value}">
            <v-btn @click.stop="onMessage(value)">ارسال</v-btn>
          </template>
        </a-paged-table>
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
import ATextField from "../../components/ATextField";
import APagedTable from "../../components/APagedTable";
import ARow from "../../components/ARow";
import ATableFilterField from "../../components/ATableFilterField";

export default {
  components: {ATableFilterField, ARow, APagedTable, ATextField},
  computed: {
    url: () => '/profiles'
  },
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
      filterQuery: {
        'users.email': '',
        name: '',
        last_name: '',
        cell_phone: '',
        before: '',
        after: ''
      },
      message: {user_id: '', title: '', desc: ''},
      d: {sendMessage: false},
      l: {send: false},
    }
  },
  methods: {
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
    },
  }
}
</script>

<style scoped>

</style>