<template>
  <div>
    <p class="text-h4">بنرها و پیام های پیشواز</p>
    <a-paged-table
        ref="table"
        url="/welcome-messages"
        :headers="headers"
        :filter-query="[]"
        :hide-filter="true" :hide-paginate="true">
      <template v-slot:item.delete="{item}">
        <v-btn :loading="l.delete" color="error" @click="remove(item.id)">حذف</v-btn>
      </template>
      <template v-slot:item.created_at="{value}">
        {{ value|toFarsiDate }}
      </template>
    </a-paged-table>

    <v-dialog v-model="d.create" width="520px">
      <v-card class="px-12 py-6 text-center">
        <p class="text-h4 mb-8 primary--text text-right">ایجاد بنر</p>

        <v-select label="نوع" :items="typeItems" v-model="banner.type" filled/>
        <v-text-field label="تیتر" v-model="banner.title" filled/>
        <v-textarea label="پیام" v-model="banner.body" filled/>
        <v-text-field label="ملاحظات" v-model="banner.desc" filled/>
        <v-btn @click="add" color="primary" :loading="l.add">ایجاد</v-btn>
      </v-card>
    </v-dialog>

    <div class="text-center mt-6">
      <v-btn @click="d.create = true" color="primary">اضافه کردن</v-btn>
    </div>
  </div>
</template>

<script>
import APagedTable from "../../../components/APagedTable";
import ATextField from "../../../components/ATextField";

export default {
  name: "banners",
  components: {ATextField, APagedTable},
  computed: {
    headers: () => [
      {text: 'نوع', value: 'type', sortable: false, align: 'center'},
      {text: 'تیتر', value: 'title', sortable: false, align: 'center'},
      {text: 'پیام', value: 'body', sortable: false, align: 'center'},
      {text: 'ملاحظات', value: 'desc', sortable: false, align: 'center'},
      {text: 'تاریخ', value: 'created_at', sortable: false, align: 'center'},
      {text: 'حذف', value: 'delete', sortable: false, align: 'center'},
    ],
    typeItems: () => [
      'banner_dashboard_green', 'banner_dashboard_normal', 'banner_dashboard_red',
      'banner_wallets_green', 'banner_wallets_normal', 'banner_wallets_red',
      // 'dialog_dashboard_normal',
      'banner_all_normal',],
  },
  data() {
    return {
      banner: {
        type: '',
        title: '',
        body: '',
        desc: '',
      },
      l: {add: false, delete: false},
      d: {create: false}
    }
  },
  methods: {
    async add() {
      this.l.add = true
      await this.$axios.$post('/welcome-messages', this.banner)
      await this.$refs.table.refresh()
      this.l.add = false
      this.d.create = false
    },
    async remove(id) {
      this.l.delete = true
      await this.$axios.$post('/welcome-messages/' + id + '/delete')
      await this.$refs.table.refresh()
      this.l.delete = false
    }
  },
}
</script>

<style scoped>

</style>