<template>
  <div>
    <v-menu offset-y>
      <template v-slot:activator>
        <a-text-field v-model="birthDate"/>
      </template>
      <v-date-picker locale="fa-IR" color="primary" first-day-of-week="saturday" v-model="birthDate"/>
    </v-menu>

  </div>
</template>

<script>
export default {
  name: "ADatePicker",
  data() {
    return {
      birthDate: ''
    }
  },
}
</script>

<style scoped>

</style>