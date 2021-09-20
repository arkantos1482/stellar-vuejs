<template>
  <div>
    <v-data-table
        @update:options="setTableOptions"
        :server-items-length="pagedList.total"
        :items="pagedList.data"
        :items-per-page="50"
        v-bind="$attrs"
        v-on="$listeners"
        hide-default-footer>

      <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
        <slot :name="slot" v-bind="scope"/>
      </template>
    </v-data-table>

    <v-pagination class="mt-4"
                  v-model="pagedList.current_page"
                  :length="pagedList.last_page"
                  total-visible="10"
                  @input="refresh"/>
  </div>

</template>

<script>
import {toIndexedList} from "@/models/utils";

export default {
  name: "APagedTable",
  props: ['url', 'filterQuery'],
  data() {
    return {
      pagedList: {
        data: [],
        current_page: 1,
        last_page: 0,
        total: 0
      },
      tableOptions: {
        sortBy: [''],
        sortDesc: [false]
      },
    }
  },
  mounted() {

  },
  methods: {
    async refresh() {
      let list = await this.$axios.$get(this.url + '?' + this.makeQueryParams())
      list['data'] = toIndexedList(list.data)
      this.pagedList = list
    },
    async setTableOptions(item) {
      this.tableOptions = item
      await this.refresh()
    },
    makeQueryParams() {
      return 'page=' + this.pagedList.current_page
          + this.makeSortQuery()
          + this.makeFilterQuery()
    },
    makeSortQuery() {
      let sign = this.tableOptions.sortDesc?.[0] ? '-' : ''
      let sortBy = this.tableOptions.sortBy?.[0]
      return sortBy ? ('&sort=' + sign + sortBy) : ''
    },
    makeFilterQuery() {
      return Object.keys(this.filterQuery)
          .filter(key => this.filterQuery[key])
          .reduce((carry, key) => carry + `&filter[${key}]=${this.filterQuery[key]}`, '')
    },
  }
}
</script>

<style scoped>

</style>