<script setup>
import { onBeforeMount, onMounted } from "vue";
import { useStore } from "./store";

const store = useStore();

onBeforeMount(async () => {
  await store.checkToken();
  await store.getUserInfo();
});
</script>

<template>
  <main class="main">
    <div class="wrapper">
      <header class="header">
        <!-- Псевдоэлемент для размытого фона -->
        <router-link to="/">
          <h1>SomeApp {{ store.isAuth }}</h1>
        </router-link>

        <nav v-if="!store.isAuth" class="nav">
          <RouterLink to="/registration">Registration</RouterLink>
          <RouterLink to="/login">Authorisation</RouterLink>
        </nav>
        <nav v-else class="nav">
          <RouterLink to="/posts">Posts</RouterLink>
          <RouterLink to="/add-post">Create post</RouterLink>
          <RouterLink to="/profile">Profile</RouterLink>
        </nav>
      </header>
      <RouterView />
    </div>
  </main>
</template>

<style scoped>
.main {
  background: url("./assets/bg-blog.jpg");
  background-size: cover;
}
.wrapper {
  max-width: 1320px;
  margin: 0 auto;
  min-height: 100vh;
}
.header {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5px;
  position: relative;
  overflow: hidden;
  color: var(--white);
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
</style>
