<template>
  <v-card>
    <v-card-title>Dashboard</v-card-title>
    <v-card-text><login-status /></v-card-text>
  </v-card>
</template>
<script>
import LoginStatus from "@/components/LoginStatus.vue";

export default {
  components: {
    LoginStatus
  }
};
</script>
