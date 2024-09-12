<script setup>
import Post from "../components/Post.vue";
import { onMounted } from "vue";
import { useStore } from "../store";

const store = useStore();

onMounted(() => store.getPosts());
</script>
<template>
  <div class="wrapper">
    <h2 class="title">Latest posts</h2>
    <div class="posts">
      <Post :post="post" v-for="post in store.posts" :key="post.id" />
    </div>
  </div>
</template>
<style scoped>
.wrapper {
  padding-inline: 10px;
}
.posts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 20px;
}
.title {
  color: var(--white);
}

@media (max-width: 1040px) {
  .posts {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 800px) {
  .posts {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
