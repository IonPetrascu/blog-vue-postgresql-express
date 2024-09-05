<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const email = ref("");
const name = ref("");
const password = ref("");

const router = useRouter();

const submitForm = async () => {
  const response = await fetch("http://localhost:3000/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.value,
      name: name.value,
      password: password.value,
    }),
  });

  if (!response.ok) {
    return console.error("Registration failed:", await response.text());
  }
  const data = await response.json();
  console.log(data);
  router.push("/auth");
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
        v-model="name"
        type="text"
        placeholder="Enter your name"
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
