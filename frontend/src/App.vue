<script setup>
import { onBeforeMount, onMounted } from "vue";
import { useStore } from "./store";

const store = useStore();

onBeforeMount(() => store.checkToken());
</script>

<template>
  <main class="wrapper">
    <header class="header">
      <router-link to="/"
        ><h1>SomeApp {{ store.isAuth }}</h1></router-link
      >

      <nav v-if="!store.isAuth" class="nav">
        <RouterLink to="/registration">Registration</RouterLink>
        <RouterLink to="/login">Authorisation</RouterLink>
      </nav>
      <nav v-else class="nav">
        <RouterLink to="/posts">Posts</RouterLink>
        <RouterLink to="/profile">Profile</RouterLink>
      </nav>
    </header>

    <div>
      <RouterView />
    </div>
  </main>
</template>

<style scoped>
.wrapper {
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 10px;
  height: 100vh;
}
.header {
  background: #9796966c;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5px;
}
.nav {
  display: flex;
  gap: 15px;
}
</style>
