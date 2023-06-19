<template>
  <titled-page title="مدیریت اعلان ها">
    <v-row>
      <v-col cols="6">
        <div class="py-4 px-12">
          <p class="text-h6">پیام ها</p>
          <p class="grey--text">
            در این بخش می توانید بخش هایی که تمایل به دریافت پیام ندارید، حذف
            نمایید.
          </p>
          <div class="mt-8">
            <v-switch inset label="فعالیت ها" v-model="settings.user_event" />
            <!--        <v-switch inset label="پیام های سیستمی" v-model=""/>-->
            <v-switch
              class="mt-0"
              inset
              label="اخبار و رویدادها"
              v-model="settings.news"
            />
          </div>
          <div class="text-center">
            <v-btn
              class="px-12"
              @click="post"
              :loading="l.submit"
              color="primary"
              >اعمال
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
  </titled-page>
</template>

<script>
import TitledPage from "~/components/TitledPage.vue"
import ARow from "~/components/ARow.vue"

export default {
  components: { ARow, TitledPage },
  data() {
    return {
      settings: {
        user_event: true,
        news: true,
      },
      l: { submit: false },
    }
  },
  async mounted() {
    this.settings = await this.$axios.$get("/settings/messages")
  },
  methods: {
    async post() {
      this.l.submit = true
      await this.$axios.$post("/settings/messages", this.settings)
      this.l.submit = false
    },
  },
}
</script>

<style scoped></style>
