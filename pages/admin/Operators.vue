<template>
  <div>
    <a-paged-table
        ref="table"
        url="/operator-sms"
        :headers="headers"
        :hide-filter="true"
        :hidePaginate="true"
        :filter-query="[]"
        default-sort-by="created_at"
        :default-sort-desc="true">
      <template v-slot:item.actions="{item}">
        <v-btn outlined small color="primary" @click="editDialog(item)">ویرایش
        </v-btn>
        <v-btn outlined small color="error"
               @click="remove(item.id)">حذف
        </v-btn>
      </template>
    </a-paged-table>

    <div class="text-center mt-4">
      <v-btn color="primary" @click="createDialog" outlined>اضافه کردن اپراتور</v-btn>
    </div>

    <v-dialog width="400" v-model="d.operator">
      <v-card class="pa-6 text-center">
        <a-text-field label="cell_phone" v-model="operator.cell_phone"/>
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
  name: "Bots",
  components: {ATextField, APagedTable},
  mixins: [ps],
  data() {
    return {
      operator: {
        id: null,
        cell_phone: '',
      },
      d: {operator: false},
      l: {send: false},
    }
  },
  computed: {
    headers: () => [
      {value: 'cell_phone', text: 'موبایل', align: 'center'},
      {value: 'actions', text: 'actions', align: 'center', width: '180'},
    ]
  },
  methods: {
    async create_edit() {
      this.l.send = true

      if (this.operator.id) {
        await this.$axios.post('/operator-sms/' + this.operator.id, this.operator)
      } else {
        await this.$axios.post('/operator-sms', this.operator)
      }

      await this.$refs.table.refresh()
      this.d.operator = false
      this.l.send = false
    },
    editDialog(item) {
      this.operator = item
      this.d.operator = true
    },
    createDialog() {
      this.operator = emptyArray(this.operator)
      this.d.operator = true
    },
    async remove(id) {
      await this.$axios.post('/operator-sms/' + id + '/delete')
      await this.$refs.table.refresh()
    },
  }
}
</script>

<style scoped>

</style>