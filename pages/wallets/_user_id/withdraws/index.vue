<template>
  <titled-page :title="title">
    <a-paged-table
      :url="'/payments/withdraws/' + user_id"
      :headers="headers"
      :filter-query="filterQuery"
      default-sort-by="updated_at"
      :default-sort-desc="true"
    >
      <template v-slot:item.updated_at="{ value }"
        >{{ value | toFarsiDate }}
      </template>
      <template v-slot:item.coin="{ value }"
        >{{ value | toFarsiCoin }}
      </template>
      <template v-slot:item.amount="{ value }"
        >{{ value | toFloat | separated }}
      </template>
      <template v-slot:item.track_code="{ value }">
        <p v-if="!value"></p>
        <p v-else-if="!value.startsWith('http')">
          {{ `کد رهگیری = ${value}` }}
        </p>
        <a v-else :href="value" target="_blank">لینک پیگیری</a>
      </template>
      <template v-slot:item.status="{ item }">
        <div :class="item | toFarsiColor">{{ item | toFarsiTitle }}</div>
      </template>
    </a-paged-table>
  </titled-page>
</template>

<script>
import APagedTable from "@/components/APagedTable"
import TitledPage from "~/components/TitledPage.vue"

export default {
  name: "Withdraws",
  components: { TitledPage, APagedTable },
  computed: {
    user_id() {
      return this.$route.params.user_id
    },
  },
  props: {
    title: { type: String, default: "گزارش برداشت" },
    type: String,
  },
  filters: {
    toFarsiTitle(item) {
      let status = item.status
      if (item.recovery_time) {
        status = "recovered"
      }
      const statusList = {
        success: "موفقیت آمیز",
        SUBMITTED: "در حال انجام",
        recovered: "برگشت شده به حساب",
      }
      return statusList[status] ?? "ناموفق"
    },
    toFarsiColor(item) {
      let status = item.status
      if (item.recovery_time) {
        status = "recovered"
      }
      const statusList = {
        success: "success--text",
        SUBMITTED: "yellow--text",
        recovered: "success--text",
      }
      return statusList[status] ?? "error--text"
    },
  },
  data() {
    return {
      headers: [
        { value: "updated_at", text: "تاریخ", align: "center" },
        { value: "coin", text: "نوع ارز", align: "center" },
        { value: "amount", text: "مبلغ", align: "center" },
        { value: "destination", text: "انتقال به", align: "center" },
        { value: "track_code", text: "رهگیری", align: "center" },
        { value: "crypto_fee", text: "کارمزد", align: "center" },
        { value: "status", text: "وضعیت", align: "center" },
      ],
      filterQuery: [
        { type: "headless", key: "coin", value: this.type?.toUpperCase() },
        { type: "time", key: "after", name: "بعد از", value: "" },
        { type: "time", key: "before", name: "قبل از", value: "" },
      ],
    }
  },
}
</script>

<style scoped></style>
