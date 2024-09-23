<script setup>
import { computed } from "vue";
import { useStore } from "../store";
import { transformToLocalTime } from "../utils/functions";
const props = defineProps({
  post: Object,
});

const store = useStore();
const datePost = computed(() => transformToLocalTime(props.post.created_at));

const handleVote = (vote) => {
  store.addVoteToPost(vote, props.post.id, "post");
};
</script>
<template>
  <div class="post">
    <button v-if="post.user_id === store.userInfo.id" class="delete-post-btn">
      <img src="../assets/close-icon.svg" alt="delete post" />
    </button>
    <div class="post-img-wrapper">
      <img
        v-if="post.img"
        class="post-img"
        :src="`http://localhost:3000/${post.img}`"
        alt=""
      />
      <img
        class="post-img"
        v-else
        src="../assets/default-post-image.png"
        alt=""
      />
    </div>

    <div class="post-content">
      <span class="post-theme">Technology</span>
      <router-link class="post-title" :to="`/post/${post.id}`">
        {{ post.title }}
      </router-link>

      <div class="post-bottom">
        <div class="post-info">
          <img
            class="post-author-img"
            src="../assets/default-user-img.jpg"
            :alt="post.user_name"
          />
          <router-link :to="`/profile/${post.user_id}`" class="post-name">{{
            post.user_name
          }}</router-link>

          <time class="post-date"> {{ datePost }}</time>
        </div>
        <div class="likes-and-comment">
          <div class="likes-btns">
            <button @click="handleVote(true)" class="like-btn">
              <span>{{ post.likes_count }}</span>
              <img
                v-if="post.user_vote === null || post.user_vote === 0"
                src="../assets/like.svg"
                alt=""
              />
              <img v-else src="../assets/like-active.svg" alt="" />
            </button>
            <button @click="handleVote(false)" class="dislike-btn">
              <span>{{ post.dislikes_count }}</span>
              <img
                v-if="post.user_vote === null || post.user_vote === 1"
                class="dislike-img"
                src="../assets/like.svg"
                alt=""
              />
              <img v-else src="../assets/like-active.svg" alt="" />
            </button>
          </div>
          <div>
            <RouterLink :to="`/post/${post.id}`">
              <button class="comment-btn">
                <span>{{ post.comments_count }}</span>
                <img
                  class="comment-img"
                  src="../assets/comment-icon.svg"
                  alt=""
                />
              </button>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.post {
  padding: 5px;
  background: var(--white);
  border: 2px solid var(--c-3);
  border-radius: 12px;
  position: relative;
  max-height: 495px;
}

.post-title {
  font-weight: 600;
  font-size: 24px;
  line-height: 117%;
  color: var(--black);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.post-title:hover {
  color: var(--rose);
}
.post-name,
.post-date {
  font-size: 16px;
  line-height: 150%;
  color: #97989f;
}
.post-date {
  font-weight: 400;
  margin-left: auto;
}
.post-name {
  font-weight: 500;
}
.post-img {
  width: 100%;
  height: 100%;
  object-fit: cover;

  transition: scale 0.4s ease;
}
.post-img:hover {
  scale: 1.1;
}
.post-img-wrapper {
  overflow: hidden;
  border-radius: 12px;
  height: 240px;
}
.post-theme {
  border-radius: 6px;
  padding: 4px 10px;
  width: 97px;
  height: 28px;
  font-weight: 500;
  font-size: 14px;
  line-height: 143%;
  color: #4b6bfb;
}
.post-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 15px;
}

.post-bottom {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.post-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
.post-author-img {
  width: 25px;
  border-radius: 50%;
  object-fit: cover;
}
.comment-btn {
  display: flex;
  align-items: center;
  gap: 5px;
}
.comment-img {
  width: 25px;
  height: 25px;
}
.likes-and-comment {
  display: flex;
  gap: 20px;
}
.likes-btns {
  display: flex;
  align-items: center;
  gap: 20px;
}
.likes-btns button {
  display: flex;
  gap: 5px;
  align-items: center;
}
.likes-btns img {
  width: 25px;
  height: 25px;
  opacity: 0.5;
}
.delete-post-btn {
  width: 30px;
  height: 30px;
  position: absolute;
  right: 5px;
  top: 5px;
  border: 2px solid var(--c-4);
  border-radius: 50%;
  overflow: hidden;
  transition: scale 0.4s ease;
  z-index: 1;
}
.delete-post-btn img {
  width: 100%;
}
.delete-post-btn:hover {
  scale: 1.1;
}
.dislike-img {
  transform: rotate(180deg);
}
</style>
