<template>
  <withdraws :user-id="userId"/>
</template>

<script>
import Withdraws from "@/pages/wallets/withdraws/index";

export default {
  name: "withdrawsById",
  components: {Withdraws},
  data() {
    return {
      userId: this.$route.params.userId
    }
  },
}
</script>

<style scoped>

</style>