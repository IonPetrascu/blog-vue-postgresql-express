<script setup>
import { useRoute } from "vue-router";
import { useStore } from "../store";
import { onMounted, ref, watch } from "vue";
import Comment from "./Comment.vue";

const route = useRoute();
const id = route.params.id;
const store = useStore();
const post = ref(null);
const comments = ref([]);
const newComment = ref("");
const respondCommentId = ref(null);
const commentsKey = ref(0);

onMounted(async () => {
  post.value = await store.getSinglePost(id);
  comments.value = await store.getComments(id);
});

watch(
  comments,
  () => {
    commentsKey.value += 1;
  },
  { deep: true }
);

const submitComment = async () => {
  if (!newComment.value.trim()) return;

  const postId = id;
  const content = newComment.value;
  const parent_comment_id = respondCommentId.value;

  respondCommentId.value = null;
  newComment.value = "";

  await store.addComment(postId, content, parent_comment_id);
  comments.value = await store.getComments(id);
};

const setRespondCommentId = (id) => {
  respondCommentId.value = id;
};
const removeRespondCommentId = () => (respondCommentId.value = null);

const addVoteToComment = async ({
  is_like,
  target_id,
  entity_type,
  user_vote,
}) => {
  try {
    if (user_vote === null) {
      await store.addVote(target_id, entity_type, is_like);
    } else {
      if (is_like === user_vote) {
        return await store.deleteVote(target_id, entity_type);
      } else {
        return await store.addVote(target_id, entity_type, is_like);
      }
    }
  } catch (error) {
    console.error("Error processing vote:", error);
  }
};
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
    <ul :key="commentsKey" class="post-comments">
      <Comment
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        @setRespondCommentId="setRespondCommentId"
        @add-vote-to-comment="addVoteToComment"
      />
    </ul>
    <form class="form-comment" @submit.prevent="submitComment">
      <div v-if="respondCommentId !== null" class="response-info">
        <button type="button" class="btn-clear" @click="removeRespondCommentId">
          X
        </button>
        Responding to comment ID: {{ respondCommentId }}
      </div>
      <input
        v-model="newComment"
        type="text"
        placeholder="Your comment"
        class="comment-input"
      />
      <button type="submit" class="btn-submit">Send</button>
    </form>
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

.form-comment {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

.response-info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #666;
}

.btn-clear {
  background: transparent;
  border: none;
  color: #ff0000;
  font-size: 14px;
  cursor: pointer;
}

.comment-input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
}

.btn-submit {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px;
  cursor: pointer;
}
.post-comments {
  border: 1px solid #ddd;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 5px;
}
</style>
