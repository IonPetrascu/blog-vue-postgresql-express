<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "../store";

const userInfo = ref(null);
const error = ref(null);

const store = useStore();

onMounted(async () => (userInfo.value = await store.getUserInfo()));
</script>

<template>
  <div>
    <h2>Profile!</h2>
    <div v-if="error">
      <p>Error: {{ error }}</p>
    </div>
    <div v-if="userInfo">
      <p>Name: {{ userInfo.u_name }}</p>
      <p>Email: {{ userInfo.u_email }}</p>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>

<style scoped></style>
