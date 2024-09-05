<script setup>
import { ref, onMounted } from "vue";

const userInfo = ref(null);
const error = ref(null);

const fetchUserInfo = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found");
    }

    const response = await fetch("http://localhost:3000/userinfo", {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user info");
    }

    const data = await response.json();
    userInfo.value = data.user;
  } catch (err) {
    error.value = err.message;
  }
};

onMounted(fetchUserInfo);
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
