<template>
  <div>
    <a-paged-table
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
        {text: 'ردیف', value: 'index', sortable: false, align: 'center'},
        {value: 'email', text: 'ایمیل', align: 'center'},
        {value: 'name', text: 'نام', align: 'center'},
        {value: 'last_name', text: 'نام خانوادگی', align: 'center'},
        {value: 'cell_phone', text: 'موبایل', align: 'center'},
        // {value: 'action', text: 'اقدامات', sortable: false}
      ],
      filterQuery: [
        {type: 'text', name: 'ایمیل', key: 'users.email', value: ''},
        {type: 'text', name: 'نام', key: 'name', value: ''},
        {type: 'text', name: 'نام خانوادگی', key: 'last_name', value: ''},
        {type: 'text', name: 'موبایل', key: 'cell_phone', value: ''},
      ],
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