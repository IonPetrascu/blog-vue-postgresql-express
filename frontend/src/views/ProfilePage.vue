<script setup>
import { useRoute } from "vue-router";
import { useStore } from "../store";

const store = useStore();
const route = useRoute();

const userId = route.params.id;

const createChat = () => {
  store.createChat(userId, "New chat");
};
</script>
<template>
  <div>
    <div>profile of user {{ userId }}</div>
    <div>
      <button @click="createChat">Message</button>
    </div>
  </div>
</template>
<style scoped></style>
