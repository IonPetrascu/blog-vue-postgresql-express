<script setup>
import { ref } from "vue";
import { useStore } from "../store";


const error = ref(null);
const store = useStore();
</script>

<template>
  <div>
    <h2>Profile!</h2>
    <div v-if="error">
      <p>Error: {{ error }}</p>
    </div>
    <div v-if="store.userInfo">
      <p>Name: {{ store.userInfo.u_name }}</p>
      <p>Email: {{ store.userInfo.u_email }}</p>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>

<style scoped></style>
