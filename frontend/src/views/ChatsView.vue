<script setup>
import { onMounted, ref } from "vue";
import { useStore } from "../store";

const store = useStore();
const chats = ref([]);

onMounted(async () => {
  chats.value = await store.getMyChats();
});
</script>
<template>
  <ul v-if="chats.length > 0" class="list-chats">
    <li v-for="chat in chats" :key="chat.chat_id">
      <RouterLink :to="`/chats/${chat.chat_id}`"
        >Enter {{ chat.name }}</RouterLink
      >
    </li>
  </ul>
  <div v-else>No chats</div>
</template>
<style scoped>
.list-chats {
  background: white;
  padding: 20px;
}
</style>
