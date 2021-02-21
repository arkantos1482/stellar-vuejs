<template>
  <deposits :user-id="userId"/>
</template>

<script>
import Deposits from "@/pages/wallets/deposits/index";

export default {
  name: "depositById",
  components: {Deposits},
  data() {
    return {
      userId: this.$route.params.userId
    }
  },
}
</script>

<style scoped>

</style>