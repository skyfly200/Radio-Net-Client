<template>
  <v-card>
    <v-card-title>Dashboard</v-card-title>
    <v-card-subtitle><login-status/></v-card-subtitle>
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
