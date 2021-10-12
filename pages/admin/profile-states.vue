<template>
  <div>
    <a-paged-table
        :headers="headers"
        :filter-query="filterQuery"
        :hide-filter="true"
        url="/profile-states"
        @click:row="goto">
      <template v-slot:item.created_at="{value}">{{ value|toFarsiJustDate }}</template>
    </a-paged-table>

  </div>
</template>

<script>
import ATextField from "../../components/ATextField";
import APagedTable from "../../components/APagedTable";
import ARow from "../../components/ARow";
import ATableFilterField from "../../components/ATableFilterField";

export default {
  components: {ATableFilterField, ARow, APagedTable, ATextField},
  data() {
    return {
      headers: [
        {text: 'ردیف', value: 'index', align: 'center', sortable: false},
        {text: 'نام', value: 'name', align: 'center', sortable: false},
        {text: 'نام خانوادگی', value: 'last_name', align: 'center', sortable: false},
        {text: 'موبایل', value: 'cell_phone', align: 'center', sortable: false},
        {text: 'زمان تغییر', value: 'created_at', align: 'center', sortable: false},
        {text: 'علت', value: 'reason', align: 'center', sortable: false}
      ],
      filterQuery: [
        {type: 'text', name: 'نام', key: 'name', value: ''},
        {type: 'text', name: 'نام خانوادگی', key: 'last_name', value: ''},
        {type: 'text', name: 'موبایل', key: 'cell_phone', value: ''},
      ],
    }
  },
  methods: {
    async goto(item) {
      await this.$axios.$post('/profile-states/seen', {profile_id: item.profile_id})
      await this.$router.push('/Users/' + item.user_id)
    }
  }
}
</script>

<style scoped>

</style>