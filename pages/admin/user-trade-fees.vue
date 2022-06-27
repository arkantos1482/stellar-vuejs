<template>
  <div>
    <a-paged-table
        ref="table"
        url="/user-trade-fee"
        :headers="headers"
        :filter-query="filterQuery"
        default-sort-by="fee_ratio"
        :default-sort-desc="false">
      <template v-slot:item.birth_date="{value}">{{ value|toFarsiJustDate }}</template>
      <template v-slot:item.actions="{item}">
        <v-btn outlined small color="success" @click="createDialog(item)">ایجاد</v-btn>
        <v-btn outlined small color="primary" @click="editDialog(item)">ویرایش</v-btn>
        <v-btn outlined small color="error"
               @click="remove(item.id)">حذف
        </v-btn>
      </template>
    </a-paged-table>

    <v-dialog width="400" v-model="d.userTradeFee">
      <v-card class="pa-6 text-center">
        <a-text-field label="شناسه کاربر" v-model="userTradeFee.user_id"/>
        <a-text-field label="نرخ کارمزد" v-model="userTradeFee.fee_ratio"/>
        <a-text-field label="توضیحات" v-model="userTradeFee.description"/>
        <v-btn @click="create_edit" :loading="l.send" class="mt-4" color="primary" outlined>ارسال</v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import APagedTable from "../../components/APagedTable";
import ATextField from "../../components/ATextField";
import ps from '@/mixins/pstopper'
import {emptyArray} from "../../models/utils";

export default {
  name: "UserTradeFees",
  components: {ATextField, APagedTable},
  mixins: [ps],
  data() {
    return {
      userTradeFee: {
        id: null,
        user_id: '',
        fee_ratio: '',
        description: ''
      },
      d: {userTradeFee: false},
      l: {send: false},
      filterQuery: [
        {type: 'text', name: 'ایمیل', key: 'users.email', value: ''},
        {type: 'text', name: 'نام', key: 'profiles.name', value: ''},
        {type: 'text', name: 'نام خانوادگی', key: 'profiles.last_name', value: ''},
        {type: 'text', name: 'استان', key: 'profiles.province', value: ''},
        {type: 'time', name: 'تاریخ تولد', key: 'same_birth_date', value: ''},
      ],
    }
  },
  computed: {
    headers: () => [
      // {value: 'user_id', text: 'شناسه کاربر', align: 'center'},
      {value: 'email', text: 'ایمیل', align: 'center'},
      {value: 'name', text: 'نام', align: 'center'},
      {value: 'last_name', text: 'نام خانوادگی', align: 'center'},
      {value: 'birth_date', text: 'تاریخ تولد', align: 'center'},
      {value: 'province', text: 'استان', align: 'center'},
      {value: 'fee_ratio', text: 'نرخ کارمزد', align: 'center'},
      {value: 'description', text: 'توضیحات', align: 'center'},
      {value: 'actions', text: 'actions', align: 'center', width: '180'},
    ]
  },
  methods: {
    async create_edit() {
      this.l.send = true

      if (this.userTradeFee.id) {
        await this.$axios.post('/user-trade-fee/' + this.userTradeFee.id, this.userTradeFee)
      } else {
        await this.$axios.post('/user-trade-fee', this.userTradeFee)
      }

      await this.$refs.table.refresh()
      this.d.userTradeFee = false
      this.l.send = false
    },
    editDialog(item) {
      this.userTradeFee = item
      this.d.userTradeFee = true
    },
    createDialog(item) {
      this.userTradeFee = emptyArray(this.userTradeFee)
      this.userTradeFee.user_id = item.user_id
      this.d.userTradeFee = true
    },
    async remove(id) {
      await this.$axios.post('/user-trade-fee/' + id + '/delete')
      await this.$refs.table.refresh()
    },
  }
}
</script>

<style scoped>

</style>
