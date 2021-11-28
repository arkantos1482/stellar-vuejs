<template>
  <div>
    <a-paged-table
        url="/stellar/tx-recovery"
        :headers="headers"
        :hide-filter="true"
        :filter-query="[]"
        default-sort-by="created_at"
        :default-sort-desc="true">
      <template v-slot:item.created_at="{value}">{{ value|toFarsiDate }}</template>
    </a-paged-table>
  </div>
</template>

<script>
import APagedTable from "../../components/APagedTable";

export default {
  name: "tx-corrections",
  components: {APagedTable},
  computed: {
    headers: () => [
      {value: 'type', text: 'نوع', align: 'center'},
      {value: 'amount', text: 'مقدار', align: 'center'},
      {value: 'currency', text: 'رمزارز', align: 'center'},
      {value: 'desc', text: 'توضیحات', align: 'center'},
      {value: 'email', text: 'اپراتور', align: 'center'},
      {value: 'created_at', text: 'تاریخ', align: 'center'},
    ]
  }
}
</script>

<style scoped>

</style>