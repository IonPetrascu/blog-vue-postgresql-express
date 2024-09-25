<script setup>
import { ref } from "vue";
import { useStore } from "../store";
import { GoogleLogin } from "vue3-google-login";
import { useRouter } from "vue-router";
const email = ref("");
const password = ref("");
const store = useStore();
const router = useRouter();

const handleSubmit = () => store.loginUser(email.value, password.value);

const callback = (response) => {
  if (response && response.credential) {
    const credential = response.credential;

    sendTokenToServer(credential);
  } else {
    console.error("No credential found in response:", response);
  }
};

const sendTokenToServer = async (credential) => {
  try {
    const response = await fetch("http://localhost:3000/api/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: credential }),
    });

    const result = await response.json();
    if (result.usertToken) {
      localStorage.setItem("token", `Bearer ${result.usertToken}`);
      await store.getMyInfo();
      router.push("/");
    }
  } catch (error) {
    console.error("Error sending token to server:", error);
  }
};
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
    <GoogleLogin :callback="callback" />
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
