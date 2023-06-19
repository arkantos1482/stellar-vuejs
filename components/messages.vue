<template>
  <titled-page :title="title">
    <div>
      <v-data-table
        :items="items"
        :headers="headers"
        hide-default-footer
        items-per-page="200"
      >
        <template v-slot:item.is_read="{ item }">
          <v-badge left dot :value="item.is_read === false" />
        </template>
        <template v-slot:item.msg="{ item }">
          <div class="text-right">
            <p class="mt-4 mb-3">{{ item.title }}</p>
            <p class="mb-4 grey--text text-body-2">{{ item.desc }}</p>
          </div>
        </template>
        <!--        <template v-slot:expanded-item="{ headers, item }">-->
        <!--          <td :colspan="headers.length">-->
        <!--            <p class="mb-4 grey&#45;&#45;text text-body-2">{{ item.desc }}</p>-->
        <!--          </td>-->
        <!--        </template>-->
        <template v-slot:item.created_at="{ item }">
          <p class="grey--text text-body-2">
            {{ item.created_at | toFarsiDate }}
          </p>
        </template>
      </v-data-table>
    </div>
  </titled-page>
</template>

<script>
import TitledPage from "~/components/TitledPage.vue"

export default {
  name: "messages",
  components: { TitledPage },
  props: ["category", "title"],
  computed: {
    headers() {
      return [
        {
          value: "is_read",
          text: "وضعیت",
          align: "center",
          width: "64px",
          sortable: false,
        },
        { value: "msg", text: "متن", align: "center", width: "70%" },
        { value: "created_at", text: "تاریخ", align: "center" },
      ]
    },
  },
  data() {
    return {
      items: [],
    }
  },
  async mounted() {
    let link = "/messages/me"
    if (this.category) link += "/" + this.category
    this.items = await this.$axios.$get(link)

    await this.$axios.$post(link + "/readAll")
  },
}
</script>

<style scoped></style>
