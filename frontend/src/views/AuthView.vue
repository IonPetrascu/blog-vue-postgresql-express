<script setup>
import { ref } from "vue";
import { useStore } from "../store";

const email = ref("");
const password = ref("");
const store = useStore();

const handleSubmit = () => store.loginUser(email.value, password.value);
</script>
<template>
  <div>
    <h3>Login</h3>
    <form class="form" @submit.prevent="handleSubmit">
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
