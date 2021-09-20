<template>
  <div>

    <a-row class="align-end mb-6 mt-n6">
      <a-table-filter-field type="text" name="ایمیل" v-model="filterQuery['users.email']"/>
      <a-table-filter-field type="text" name="نام" v-model="filterQuery.name"/>
      <a-table-filter-field type="text" name="نام خانوادگی" v-model="filterQuery.last_name"/>
      <a-table-filter-field type="text" name="موبایل" v-model="filterQuery.cell_phone"/>

      <v-btn @click="$refs.table.refresh()"
             outlined class="py-5 px-8 mx-2" color="primary">اعمال
      </v-btn>
    </a-row>
    <a-paged-table ref="table"
                   :headers="headers"
                   :filter-query="filterQuery"
                   url="/profiles"
                   @click:row="goto">
      <template v-slot:item.created_at="{value}">{{ value|toFarsiJustDate }}</template>
    </a-paged-table>
  </div>
</template>

<script>
import ARow from "../../../components/ARow";
import ATableFilterField from "../../../components/ATableFilterField";
import APagedTable from "../../../components/APagedTable";

export default {
  name: "payment",
  components: {APagedTable, ATableFilterField, ARow},
  data() {
    return {
      headers: [
        {text: 'ردیف', value: 'index'},
        {value: 'email', text: 'ایمیل'},
        {value: 'name', text: 'نام'},
        {value: 'last_name', text: 'نام خانوادگی'},
        {value: 'cell_phone', text: 'موبایل'},
        // {value: 'action', text: 'اقدامات', sortable: false}
      ],
      filterQuery: {
        'users.email': '',
        name: '',
        last_name: '',
        cell_phone: '',
      },
    }
  },

  methods: {
    async goto(item) {
      await this.$router.push(`/admin/transactions/${item.user_id}`)
    },
  }
}
</script>

<style scoped>

</style>