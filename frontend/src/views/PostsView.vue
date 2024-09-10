<script setup>
import { onMounted, ref } from "vue";
import { useStore } from "../store";
import { RouterLink } from "vue-router";

const showFormPost = ref(true);
const title = ref("Title of post");
const description = ref("description");

const store = useStore();

onMounted(() => store.getPosts());

const handleSubmit = () => store.createPost(title.value, description.value);
</script>
<template>
  <div>
    <div class="page-title">
      <h1>Posts</h1>
      <form @submit.prevent="handleSubmit" v-if="showFormPost">
        <input
          v-model="title"
          type="text"
          placeholder="Title of post"
          required
        />
        <input
          v-model="description"
          type="text"
          placeholder="Enter description"
        />
        <button type="submit">Add post</button>
      </form>
    </div>
    <ul class="post-list">
      <li v-for="post in store.posts" :key="post.id" class="post">
        <h3 class="post-title">{{ post.title }}</h3>
        <span>User id {{ post.user_id }}</span>
        <p class="post-description">
          {{ post.content }}
        </p>
        <span>{{ post.comments_count }}</span>
        <RouterLink :to="`/post/${post.id}`">Details</RouterLink>
        <div>
          <button
            class="btn-vote"
            :class="{ active: post.user_vote === 1 }"
            @click="
              () => store.addVoteToPost(true, post.id, 'post')
            "
          >
            Like {{ post.likes_count }}
          </button>
          <button
            class="btn-vote"
            :class="{ active: post.user_vote === 0 }"
            @click="
              () => store.addVoteToPost(false, post.id, 'post')
            "
          >
            Dislike {{ post.dislikes_count }}
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>
<style scoped>
.page-title {
  font-size: 2.5em;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: #333;
}

.post-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.post {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.post-title {
  font-size: 1.8em;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 10px;
}

.post-description {
  font-size: 1.2em;
  color: #7f8c8d;
  margin-bottom: 20px;
}

.comments {
  margin-top: 30px;
  border-top: 1px solid #ddd;
  padding-top: 20px;
}

.comment {
  background-color: #ecf0f1;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 10px;
  list-style-type: none;
}

.user-comment {
  font-size: 1.1em;
  font-weight: bold;
  color: #2980b9;
  margin-bottom: 5px;
}

.description-comment {
  font-size: 1em;
  color: #34495e;
}

.btn-vote.active {
  color: blue;
}
</style>
