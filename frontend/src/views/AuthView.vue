<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");

const router = useRouter();

const submitForm = async () => {
  const response = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
  });

  if (!response.ok) {
    return console.error("Registration failed:", await response.text());
  }
  const { token } = await response.json();
  localStorage.setItem("token", `Bearer ${token}`);
  router.push("/profile");
};
</script>
<template>
  <div>
    <h3>Registration</h3>
    <form class="form" @submit.prevent="submitForm">
      <input
        v-model="email"
        type="email"
        placeholder="Enter your email"
        required
      />
      <input
        v-model="password"
        type="password"
        placeholder="Enter your password"
        required
      />
      <button type="submit">Register</button>
    </form>
  </div>
</template>
<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 320px;
}
.form input {
  padding: 5px;
}
button {
  background: green;
  padding: 10px;
}
</style>
