<script setup>
import { onBeforeMount } from "vue";
import { useStore } from "./store";
import TheHeader from "./components/TheHeader.vue";
const store = useStore();

onBeforeMount(async () => {
  await Promise.all([store.checkToken(), store.getMyInfo()]);
});
</script>

<template>
  <main class="main">
    <TheHeader />
    <RouterView />
  </main>
</template>

<style scoped>
.main {
  background: var(--white);
  background-size: cover;
  height: 100vh;
  max-width: 1320px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}
</style>
