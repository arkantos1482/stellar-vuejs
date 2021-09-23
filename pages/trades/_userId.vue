<template>
  <div class="pa-4">
    <div class="text-h4 mb-6 text-right">معاملات</div>
    <my-trades-table :query="filterQuery"/>
  </div>
</template>

<script>
import MyTradesTable from "../../components/MyTradesTable";

export default {
  name: "myTrades",
  components: {MyTradesTable},
  data() {
    return {
      filterQuery: [
        {type: 'time', key: 'after', name: 'بعد از', value: ''},
        {type: 'time', key: 'before', name: 'قبل از', value: ''},
      ]
    }
  },
}
</script>

<style scoped>

</style>