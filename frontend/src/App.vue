<script setup>
import { onBeforeMount, ref } from "vue";
import { useStore } from "./store";
import TheHeader from "./components/TheHeader.vue";
const store = useStore();
const isLoading = ref(true);

onBeforeMount(async () => {
  try {
    isLoading.value = true;
    const isValidToken = await store.checkToken();

    if (isValidToken) {
      await store.getMyInfo();
    } else {
      console.log("invalid token");
      store.isAuth = false;
    }
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
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
