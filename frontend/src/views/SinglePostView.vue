<script setup>
import { useRoute } from "vue-router";
import { useStore } from "../store";
import { onMounted } from "vue";
import { ref } from "vue";

const route = useRoute();
const id = route.params.id;
const store = useStore();
const post = ref(null);

onMounted(async () => {
  post.value = await store.getSinglePost(id);
});
</script>

<template>
  <div v-if="post !== null" class="post">
    <h1 class="post-title">{{ post.title }}</h1>
    <p class="post-description">{{ post.content }}</p>
    <div class="post-meta">
      <p>
        Author: <span class="user-comment">{{ post.u_name }}</span> (<span
          class="user-email"
          >{{ post.u_email }}</span
        >)
      </p>
      <p>
        Created at: <span class="post-date">{{ post.created_at }}</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.post {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.post-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.post-description {
  font-size: 16px;
  color: #555;
  margin-bottom: 20px;
  line-height: 1.5;
}

.post-meta {
  margin-top: 20px;
  font-size: 14px;
  color: #777;
}

.user-comment {
  font-weight: bold;
  color: #007bff;
}

.user-email {
  color: #555;
}

.post-date {
  color: #999;
  font-style: italic;
}
</style>
