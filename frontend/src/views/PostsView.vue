<script setup>
import Posts from "../components/Posts.vue";
import { useStore } from "../store";
import { onMounted } from "vue";
const store = useStore();

onMounted(() => store.getPosts());
</script>
<template>
  <Posts :posts="store.posts" />
</template>
<style scoped></style>
