<template>
  <div>
    <p class="text-h4">محدودیت ها</p>
    <a-paged-table
        ref="table"
        url="/constraints"
        :headers="headers"
        :filter-query="[]"
        :hide-filter="true" :hide-paginate="true">
      <template v-slot:item.delete="{item}">
        <v-btn :loading="l.delete" color="error" @click="remove(item.id)">حذف</v-btn>
      </template>
      <template v-slot:item.message="{value}">
        <span class="error--text">{{ value }}</span>
      </template>
    </a-paged-table>

    <v-dialog v-model="d.create" width="400px">
      <v-card class="px-12 py-6 text-center">
        <p class="text-h4 mb-8 primary--text text-right">ایجاد محدودیت</p>

        <v-select label="عمل" :items="typeItems" v-model="constraint.type" filled/>
        <v-select label="کوین" :items="coinItems" v-model="constraint.resource" filled/>

        <v-text-field label="پیام خطا" v-model="constraint.message" color="error"/>
        <v-text-field label="ملاحظات" v-model="constraint.desc"/>
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
import {coinList} from "../../../models/coinList";
import ATextField from "../../../components/ATextField";

export default {
  name: "feature-constraints",
  components: {ATextField, APagedTable},
  computed: {
    headers: () => [
      {text: 'نوع', value: 'type', sortable: false, align: 'center'},
      {text: 'کوین', value: 'resource', sortable: false, align: 'center'},
      {text: 'پیام خطا', value: 'message', sortable: false, align: 'center'},
      {text: 'ملاحظات', value: 'desc', sortable: false, align: 'center'},
      {text: 'حذف', value: 'delete', sortable: false, align: 'center'},
    ],
    typeItems: () => ['offer', 'withdraw', 'deposit'],
    coinItems: () => coinList
  },
  data() {
    return {
      constraint: {
        type: '',
        resource: '',
        message: '',
        desc: '',
      },
      l: {add: false, delete: false},
      d: {create: false}
    }
  },
  methods: {
    async add() {
      this.l.add = true
      await this.$axios.$post('/constraints', this.constraint)
      await this.$refs.table.refresh()
      this.l.add = false
      this.d.create = false
    },
    async remove(id) {
      this.l.delete = true
      await this.$axios.$post('/constraints/' + id)
      await this.$refs.table.refresh()
      this.l.delete = false
    }
  },
}
</script>

<style scoped>

</style>