<template>
  <v-card width="100%" class="pt-4 pb-6 px-6">
    <div v-show="!hideFilter">
      <a-row class="align-end mb-6">

        <a-table-filter-field v-for="(item,key) in filterQuery" :key="key"
                              :type="item.type" :name="item.name"
                              v-model="item.value" :options="item.options"/>
        <v-col cols="2">
          <v-btn @click="refresh()"
                 outlined block class="mx-2" color="primary"
                 style="height: 40px">اعمال
          </v-btn>
        </v-col>
      </a-row>
    </div>
    <v-data-table
        @update:options="setTableOptions"
        :server-items-length="pagedList.total"
        :items="pagedList.data"
        :items-per-page="50"
        v-bind="$attrs"
        v-on="$listeners"
        :loading="loading"
        loading-text="در حال دریافت داده ها..."
        no-data-text="داده ای وجود ندارد."
        hide-default-footer>

      <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
        <slot :name="slot" v-bind="scope"/>
      </template>
    </v-data-table>

    <div v-if="!hidePaginate">
      <v-pagination
          class="mt-8"
          v-model="pagedList.current_page"
          :length="pagedList.last_page"
          total-visible="10"
          @input="refresh"/>
    </div>
  </v-card>

</template>

<script>
import {toIndexedList} from "@/models/utils";
import ATableFilterField from "./ATableFilterField";
import ARow from "./ARow";

export default {
  name: "APagedTable",
  components: {ARow, ATableFilterField},
  props: ['url', 'filterQuery', 'adapter', 'defaultSortBy', 'defaultSortDesc', 'hidePaginate', 'hideFilter'],
  data() {
    return {
      pagedList: {
        data: [],
        current_page: 1,
        last_page: 0,
        total: 0
      },
      tableOptions: {
        sortBy: [this.defaultSortBy],
        sortDesc: [this.defaultSortDesc]
      },
      loading: false
    }
  },
  mounted() {

  },
  methods: {
    async refresh() {
      this.loading = true
      let list = await this.$axios.$get(this.url + '?' + this.makeQueryParams())
      if (this.adapter) {
        list.data = list.data.map(this.adapter)
      }
      list.data = toIndexedList(list.data)
      this.pagedList = list
      this.loading = false
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
      return this.filterQuery
          .filter(item => item.value)
          .reduce((carry, item) => carry + `&filter[${item.key}]=${item.value}`, '')
    },
  }
}
</script>

<style scoped>

</style>