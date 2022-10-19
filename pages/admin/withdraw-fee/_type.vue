<template>
  <div>
    <div v-if="type === 'USDT'" class="text-center mb-8">
      <v-btn-toggle mandatory dense color="primary" v-model="usdtNetwork">
        <v-btn value="trx">TRC20</v-btn>
        <v-btn value="eth">ERC20</v-btn>
      </v-btn-toggle>
    </div>

    <v-row justify="center" align="end">
      <v-col cols="6" class="text-center">
        <h3>{{ type }}</h3>
        <a-text-field filled v-model="withdrawFee" label="کارمزد برداشت" />
        <v-btn color="red" @click="setFee" :loading="l.setFee">اعمال</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import pstopper from "@/mixins/pstopper"
import ATextField from "@/components/ATextField"

export default {
  mixins: [pstopper],
  components: { ATextField },
  watch: {
    usdtNetwork(val) {
      this.getFee()
    }
  },
  computed: {
    network() {
      return this.type === "USDT" ? this.usdtNetwork : this.type
    }
  },
  data() {
    return {
      type: this.$route.params.type.toUpperCase(),
      usdtNetwork: "trx",
      withdrawFee: "",
      l: { setFee: false }
    }
  },
  async mounted() {
    this.getFee()
  },
  methods: {
    async getFee() {
      this.withdrawFee = await this.$axios.$get("/crypto/fees", {
        params: {
          currency: this.type,
          network: this.network
        }
      })
    },
    setFee() {
      this.l.setFee = true
      this.$axios.put("/crypto/fees", {
        amount: this.withdrawFee,
        currency: this.type,
        network: this.network
      })
        .finally(() => this.l.setFee = false)
    }
  }
}
</script>

<style scoped>

</style>