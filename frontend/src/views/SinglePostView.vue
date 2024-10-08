<script setup>
import { useRoute, useRouter } from "vue-router";
import { useStore } from "../store";
import { onMounted, ref, watch } from "vue";
import Comment from "./Comment.vue";
import { VMarkdownView } from "vue3-markdown";
import "vue3-markdown/dist/style.css";

const route = useRoute();
const router = useRouter();
const id = route.params.id;
const store = useStore();
const post = ref(null);
const comments = ref([]);
const newComment = ref("");
const respondCommentId = ref(null);
const respondCommentName = ref(null);
const commentsKey = ref(0);
const commentInput = ref(null);
const mode = ref("light");

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

const setRespondCommentId = (data) => {
  respondCommentId.value = data.id;
  respondCommentName.value = data.name;

  if (commentInput.value) {
    commentInput.value.focus();
  }
};

const removeRespondCommentId = () => {
  respondCommentId.value = null;
  respondCommentName.value = null;
};

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

const clearInput = () => (newComment.value = "");

const goBack = () => {
  router.go(-1);
};
</script>

<template>
  <div v-if="post !== null" class="post">
    <div>
      <button @click="goBack" class="btn-back">
        <img src="../assets/back.png" alt="back" />
        <span>Back</span>
      </button>
      <h1 class="post-title">{{ post.title }}</h1>
      <div class="img-wrapper">
        <div
          v-if="post.img"
          class="post-img bg-pan-bl"
          :style="{ backgroundImage: `url(http://localhost:3000/${post.img})` }"
          @load="checkImageSize"
        ></div>
        <div class="post-info">
          <router-link :to="`/profile/${post.u_id}`" class="author-wrapper">
            <img
              class="post-author-img"
              :src="`http://localhost:3000/${post.u_img}`"
              :alt="post.u_name"
            /><span class="post-info-author">Author: {{ post.u_name }}</span>
          </router-link>

          <span v-if="post.created_at !== undefined" class="post-info-date">{{
            post.created_at.slice(0, 10)
          }}</span>
        </div>
      </div>
      <VMarkdownView
        class="description"
        :mode="mode"
        :content="post.content"
      ></VMarkdownView>
    </div>
    <form class="form-comment" @submit.prevent="submitComment">
      <router-link to="/my-profile">
        <img
          v-if="store.userInfo.img"
          class="user-img"
          :src="`http://localhost:3000/${store.userInfo.img}`"
          :alt="store.userInfo.u_name"
        />
        <img
          v-else
          class="user-img"
          src="../assets/default-user-img.jpg"
          :alt="post.u_name"
        />
      </router-link>

      <div class="form-body">
        <div class="input-wrapper">
          <div v-if="respondCommentId !== null" class="response-info">
            <button
              type="button"
              class="btn-clear"
              @click="removeRespondCommentId"
            >
              <img src="../assets/close.svg" alt="close" />
            </button>
            {{ respondCommentName }}
          </div>
          <input
            ref="commentInput"
            @blur="removeRespondCommentId"
            v-model="newComment"
            type="text"
            placeholder="Your comment"
            class="comment-input"
          />
        </div>
        <div class="btns-wrapper">
          <button
            v-if="newComment.length > 0"
            @click="clearInput"
            type="button"
            class="btn"
          >
            Cancel
          </button>
          <button type="submit" class="btn">Send</button>
        </div>
      </div>
    </form>
    <ul :key="commentsKey" class="post-comments">
      <Comment
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        @setRespondCommentId="setRespondCommentId"
        @add-vote-to-comment="addVoteToComment"
      />
    </ul>
  </div>
</template>

<style scoped>
.post {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 20px;
}
.img-wrapper {
  position: relative;
  min-height: 40px;
  overflow: hidden;
}
.post-comments {
  max-width: 800px;
}

.post-title {
  font-size: 3em;
  font-weight: bold;
  margin-bottom: 10px;
  color: var(--c-4);
}

.post-description {
  font-size: 1em;
  color: var(--gray);
  margin-bottom: 20px;
  line-height: 1.5;
}

.post-meta {
  margin-top: 20px;
  font-size: 14px;
  color: #777;
}
.post-img {
  width: 100%;
  height: 400px;
  background-size: cover;
}
.post-info {
  display: flex;
  width: 100%;
  justify-content: space-between;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 1;
  padding: 10px 5px;
}

.post-info-date {
  background: var(--white);
  padding: 5px;
  border-radius: 4px;
}
.form-comment {
  display: flex;
  gap: 10px;
  max-width: 800px;
  padding-block: 10px;
}
.user-img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.input-wrapper {
  display: flex;
  align-items: center;
}
.form-body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.btns-wrapper {
  display: flex;
  justify-content: end;
  gap: 20px;
}
.comment-input {
  flex-grow: 1;
  padding: 10px;
  border-radius: 5px;
  border: none;
  border-bottom: 1px solid var(--c-4);
}
.comment-input:focus {
  outline: 1px solid var(--c-4);
}

.btn {
  padding: 5px 10px;
  font-size: 1em;
  border-radius: 10px;
  transform: all 0.4s ease;
}

.btn[type="submit"] {
  background: var(--c-4);
}

.btn[type="button"] {
  background: var(--gray);
}

.btn:hover {
  outline: 1px solid var(--orange);
}
.description {
  margin-block: 20px;
}
.post-author-img {
  width: 30px;
  aspect-ratio: 1/1;
}
.author-wrapper {
  display: flex;
  align-items: center;
  padding-right: 5px;
  background: var(--white);
  gap: 10px;
}
.response-info {
  display: flex;
  align-items: center;
  padding: 5px;
  border-radius: 5px;
  background: var(--c-1);
  margin-right: 10px;
}
.btn-clear img {
  width: 20px;
  margin-right: 10px;
}

.btn-back {
  position: sticky;
  display: flex;
  align-items: center;
  background: var(--c-4);
  border-radius: 10px;
  margin-left: -135px;
  padding: 5px;
  width: 100px;
  z-index: 1;
  top: 40px;
}
.btn-back img {
  width: 25px;
}
.btn-back span {
  margin-left: 10px;
}

.bg-pan-bl {
  animation: bg-pan-bl 10s cubic-bezier(0.5, 0, 0.5, 1) both;
}
@keyframes bg-pan-bl {
  0% {
    background-position: 100% 0%;
  }
  50% {
    background-position: 50% 50%;
  }
  75% {
    background-position: 0% 100%;
  }
  100% {
    background-position: 50% 50%;
  }
}
.btn-back {
}
</style>
