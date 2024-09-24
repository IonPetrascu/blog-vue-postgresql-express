<script setup>
import { useStore } from "../store";
const store = useStore();
</script>
<template>
  <header class="header">
    <router-link to="/">
      <div class="logo">Blog</div>
    </router-link>

    <nav v-if="!store.isAuth" class="nav">
      <RouterLink class="link" to="/registration">Registration</RouterLink>
      <RouterLink class="link" to="/login">Authorisation</RouterLink>
    </nav>
    <nav v-else class="nav">
      <RouterLink class="link" to="/">Posts</RouterLink>
      <RouterLink class="link" to="/add-post">Create post</RouterLink>
      <RouterLink class="link" :to="`/profile/${store.userInfo?.id}`"
        >Profile</RouterLink
      >
      <RouterLink class="link" to="/chats">Chats</RouterLink>
    </nav>
  </header>
</template>
<style scoped>
.logo {
  color: var(--c-4);
  font-size: 2em;
  font-weight: 700;
}
.header {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  position: relative;
  color: var(--black);
}

.header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: inherit;
  filter: blur(5px);
  z-index: -1;
}

.nav {
  display: flex;
  gap: 15px;
}
.link {
  font-size: 1.2em;
  color: var(--c-4);
  font-weight: 500;
}
.link:hover {
  color: var(--rose);
}
</style>
