<script setup>
import { onMounted, ref } from "vue";
import { useStore } from "../store";

const showFormPost = ref(true);
const title = ref("Title of post");
const description = ref("description");

const store = useStore();

onMounted(() => store.getPosts());

const handleSubmit = () => store.createPost(title.value, description.value);
</script>
<template>
  <div class="wrapper">
    <form class="form" @submit.prevent="handleSubmit" v-if="showFormPost">
      <input v-model="title" type="text" placeholder="Title of post" required />
      <input
        v-model="description"
        type="text"
        placeholder="Enter description"
      />
      <button type="submit">Add post</button>
    </form>
  </div>
</template>
<style scoped></style>
