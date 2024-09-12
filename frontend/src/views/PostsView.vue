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
        <div class="post-header">
          <div class="post-user-info">
            <img
              class="post-user-img"
              src="../assets/default-user-img.jpg"
              :alt="post.u_name"
            />
            <span>{{ store.userInfo.u_name }}</span>
          </div>

          <h3 class="post-title">{{ post.title }}</h3>
          <div class="post-settings" v-if="post.user_id === store.userInfo.id">
            <button>Delete</button>
          </div>
        </div>
        <p class="post-description">
          {{ post.content }}
        </p>
        <RouterLink :to="`/post/${post.id}`">Details</RouterLink>
        <div class="likes-dislikes">
          <button
            class="btn-vote"
            :class="{ active: post.user_vote === 1 }"
            @click="() => store.addVoteToPost(true, post.id, 'post')"
          >
            Like {{ post.likes_count }}
          </button>
          <button
            class="btn-vote"
            :class="{ active: post.user_vote === 0 }"
            @click="() => store.addVoteToPost(false, post.id, 'post')"
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
  display: flex;
  flex-direction: column;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  gap: 10px;
}

.post-title {
  font-size: 1.9em;
  font-weight: bold;
  color: #2c3e50;
}
.post-header {
  display: flex;
  align-items: center;
  gap: 20px;
}
.post-settings {
  margin-left: auto;
}
.post-user-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-position: center;
  background-size: cover;
}
.post-user-info {
  display: flex;
  align-items: center;
  gap: 5px;
}
.post-description {
  font-size: 1.2em;
  color: #7f8c8d;
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
.likes-dislikes {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
