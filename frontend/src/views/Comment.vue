<script setup>
import { defineProps, defineEmits } from "vue";
import Comment from "./Comment.vue";

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["setRespondCommentId"]);

const handleRespond = () => {
  emit("setRespondCommentId", props.comment.id);
};
</script>

<template>
  <div class="wrapper-comment">
    <div class="comment">
      <div class="body-comment">
        <div>{{ comment.u_name }} -- {{ comment.user_id }}</div>
        <p>{{ comment.content }}</p>
        <span>{{ comment.created_at }}</span>
      </div>

      <button class="respond-btn" @click="handleRespond">Respond</button>
    </div>
    <div class="replie" v-if="comment.replies.length > 0">
      <Comment
        v-for="reply in comment.replies"
        :key="reply.id"
        :comment="reply"
        @setRespondCommentId="emit('setRespondCommentId', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.wrapper-comment {
  border-radius: 8px;
  padding: 20px;
}

.replie {
  margin-left: 15px;
}
.comment {
  background: rgb(241, 241, 241);
  padding: 5px;
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
</style>
