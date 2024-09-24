<script setup>
import Post from "./Post.vue";

defineProps({
  posts: Array,
});

</script>
<template>
  <div class="posts">
    <Post :post="post" v-for="post in posts" :key="post.id" />
  </div>
</template>
<style scoped>
.posts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding-inline: 10px;
  margin-top: 20px;
}
.title {
  color: var(--black);
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
