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
        {text: 'ردیف', value: 'index'},
        {value: 'email', text: 'ایمیل'},
        {value: 'name', text: 'نام'},
        {value: 'last_name', text: 'نام خانوادگی'},
        {value: 'cell_phone', text: 'موبایل'},
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