<script setup>
import { defineProps, defineEmits, onMounted, ref } from "vue";
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
      <div class="body-comment">
        <div>{{ localComment.u_name }} -- {{ localComment.user_id }}</div>
        <p>{{ localComment.content }}</p>
        <span>{{ localComment.created_at }}</span>
      </div>
      <div>
        <button class="respond-btn" @click="handleRespond">Respond</button>
        <button
          class="btn-vote"
          :class="{ active: localComment.user_vote }"
          @click="() => handleVote(true)"
        >
          Like {{ localComment.like_count }}
        </button>
        <button
          class="btn-vote"
          :class="{ active: localComment.user_vote === false }"
          @click="() => handleVote(false)"
        >
          Dislike {{ localComment.dislike_count }}
        </button>
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

.replie {
  margin-left: 15px;
}
.comment {
  background: rgb(241, 241, 241);
  padding: 5px;
  margin-bottom: 5px;
}
.body-comment {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.respond-btn {
  border: 1px solid gray;
  padding: 4px;
  border-radius: 4px;
}
.btn-vote {
  background: transparent;
}
.btn-vote.active {
  color: blue;
}
</style>
