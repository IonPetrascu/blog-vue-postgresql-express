<script setup>
import { defineProps, defineEmits, ref } from "vue";
import Comment from "./Comment.vue";
import { useStore } from "../store";

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
});
const store = useStore();
const emit = defineEmits(["setRespondCommentId", "addVoteToComment"]);
const localComment = ref({ ...props.comment });

const handleRespond = () => {
  emit("setRespondCommentId", localComment.value.id);
};

const handleVote = async (is_like) => {
  const { user_vote, id } = localComment.value;

  // Temporary local update of the like/dislike count
  if (user_vote === null) {
    if (is_like) {
      localComment.value.like_count++;
    } else {
      localComment.value.dislike_count++;
    }
    localComment.value.user_vote = is_like ? true : false; // Ставим true для лайка и false для дизлайка
  } else if (user_vote === true && !is_like) {
    // Был лайк, теперь дизлайк
    localComment.value.like_count--;
    localComment.value.dislike_count++;
    localComment.value.user_vote = false; // Ставим дизлайк
  } else if (user_vote === false && is_like) {
    // Был дизлайк, теперь лайк
    localComment.value.dislike_count--;
    localComment.value.like_count++;
    localComment.value.user_vote = true; // Ставим лайк
  } else {
    // Если голос совпадает с текущим голосом, отменяем его
    if (is_like) {
      localComment.value.like_count--;
    } else {
      localComment.value.dislike_count--;
    }
    localComment.value.user_vote = null; // Сбрасываем голос
  }

  // Server request
  if (user_vote === null) {
    // Добавление нового голоса
    await store.addVote(id, "comment", is_like);
  } else {
    if (is_like === user_vote) {
      // Если голос совпадает с текущим, удаляем его
      return await store.deleteVote(id, "comment");
    } else {
      // Если голос меняется, обновляем
      return await store.addVote(id, "comment", is_like);
    }
  }
};
</script>

<template>
  <div class="wrapper-comment">
    <div class="comment">
      <div class="header-comment">
        <div class="comment-author-info">
          <img
            class="comment-img"
            src="../assets/default-user-img.jpg"
            alt=""
          />
          <router-link :to="`/profile/${localComment.user_id}`">{{
            localComment.u_name
          }}</router-link>
          <span class="date">{{ localComment.created_at.slice(0, 10) }}</span>
        </div>

        <div class="body-comment">
          <span class="respond-to-person">{{
            localComment.parent_comment_id
          }}</span>
          <p class="comment-text">{{ localComment.content }}</p>
        </div>
      </div>
      <div class="foter-comment">
        <button
          class="btn-vote"
          :class="{ active: localComment.user_vote }"
          @click="() => handleVote(true)"
        >
          <img class="like-img" src="../assets/like.svg" alt="like" />
          <span> {{ localComment.like_count }}</span>
        </button>
        <button
          class="btn-vote"
          :class="{ active: localComment.user_vote === false }"
          @click="() => handleVote(false)"
        >
          <img class="dislike-img" src="../assets/like.svg" alt="dislike" />
          <span>{{ localComment.dislike_count }}</span>
        </button>
        <button class="respond-btn" @click="handleRespond">Respond</button>
      </div>
    </div>
    <div class="replie" v-if="localComment.replies.length > 0">
      <Comment
        v-for="reply in localComment.replies"
        :key="reply.id"
        :comment="reply"
        @setRespondCommentId="emit('setRespondCommentId', $event)"
        @addVoteToComment="emit('addVoteToComment', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.wrapper-comment {
  border-radius: 8px;
}

.comment {
  border: 1px solid var(--black);
  padding: 5px;
  margin-bottom: 5px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 10px;
}
.comment-author-info {
  display: flex;
  align-items: center;
  gap: 10px;
}
.comment-img {
  width: 25px;
  height: 25px;
  border-radius: 50%;
}
.header-comment {
  display: flex;
  flex-direction: column;
  gap: 5px;
  gap: 4px;
  word-wrap: break-word;
}
.body-comment {
  display: flex;
  gap: 6px;
  margin-top: 10px;
}
.foter-comment {
  display: flex;
  gap: 10px;
}
.respond-btn :hover {
  color: var(--orange);
}
.btn-vote {
  background: transparent;
  display: flex;
  align-items: center;
  gap: 3px;
}
.btn-vote span {
  font-size: 14px;
}
.btn-vote.active {
  color: var(--orange);
}
.respond-to-person {
  color: var(--orange);
}
.like-img,
.dislike-img {
  width: 15px;
}
.dislike-img {
  transform: rotate(180deg);
}
.date {
  margin-left: auto;
}
</style>
