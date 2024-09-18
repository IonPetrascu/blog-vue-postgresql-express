<script setup>
import { onMounted, ref, onUnmounted, watch } from "vue";
import { useStore } from "../store";
import { useRoute } from "vue-router";

const messages = ref([]);
const connected = ref(false);
const socket = ref(null);

const value = ref("");

const route = useRoute();
const id = route.params.id;

const store = useStore();

function connect() {
  socket.current = new WebSocket("ws://localhost:3000");

  socket.current.onopen = () => {
    connected.value = true;
    const user_id = store.userInfo?.id;

    const message = {
      event: "connection",
      user_id,
      id: Number(id),
    };
    socket.current.send(JSON.stringify(message));

    requestChatHistory(id, user_id);
  };

  socket.current.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.event === "message") {
      console.log(message);

      messages.value = [...messages.value, message];
    } else if (message.event === "history") {
      messages.value = message.messages;
    }
  };

  socket.current.onclose = () => {
    console.log("Socket closed");
  };

  socket.current.onerror = () => {
    console.log("Socket error");
  };
}

const sendMessage = async () => {
  const user_id = store.userInfo?.id;

  const message = {
    chat_id: Number(id),
    user_id,
    message: value.value,
    event: "message",
  };

  if (message.chat_id && message.message && user_id) {
    socket.current.send(JSON.stringify(message));
    value.value = "";
  }

};

function requestChatHistory(chat_id, user_id) {
  const request = {
    event: "history",
    chat_id,
    user_id,
  };
  socket.current.send(JSON.stringify(request));
}


onMounted(() => {
  watch(
    () => store.userInfo,
    (newUserInfo) => {
      if (newUserInfo?.id) {
        connect(newUserInfo.id);
      }
    },
    { immediate: true }
  );
});

onUnmounted(() => {
  if (socket.value) {
    socket.value.close();
    console.log("Close connection with websocket");
  }
});
</script>
<template>
  <div class="chat-wrapper">
    <ul class="messages-list">
      <li
        class="message-wrapper animation"
        v-for="msg in messages"
        :key="msg.id"
      >
        <div class="message" v-if="msg.user_id !== store.userInfo.id">
          <div>
            <img class="user-img" src="../assets/default-user-img.jpg" alt="" />
          </div>
          <p class="message-text">{{ msg.content }}</p>
          <span class="time">{{ msg.sent_at.slice(11, 16) }}</span>
        </div>
        <div v-else class="message user-msg">
          <span class="time">{{ msg.sent_at.slice(11, 16) }}</span>
          <p class="message-text">{{ msg.content }}</p>
          <div>
            <img class="user-img" src="../assets/default-user-img.jpg" alt="" />
          </div>
        </div>
      </li>
    </ul>
    <input
      class="input"
      type="text"
      v-model="value"
      @keyup.enter="sendMessage"
      placeholder="Type a message..."
    />
  </div>
</template>

<style scoped>
.chat-wrapper {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background: var(--white);
  min-height: calc(100vh - 80px);
}

.messages-list {
  list-style-type: none;
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex-grow: 1;
  margin-bottom: 40px;
}
.message-wrapper {
  display: flex;
}

.message {
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 700px;
}
.user-msg {
  margin-left: auto;
}
.message-text {
  background: rgb(223, 222, 222);
  padding: 10px 5px;
  border-radius: 10px;
  max-width: 700px;
  word-wrap: break-word;
}
.user-msg > .message-text {
  background: rgb(193, 251, 255);
}
.user-img {
  width: 30px;
  border-radius: 50%;
}
.time {
  align-self: flex-end;
  font-size: 12px;
}

.input {
  position: fixed;
  bottom: 0;
  width: 1300px;
  margin: 0 auto;
  padding: 10px;
}
.animation {
  animation: scale-in-hor-center 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

@keyframes scale-in-hor-center {
  0% {
    transform: scaleX(0);
    opacity: 1;
  }
  100% {
    transform: scaleX(1);
    opacity: 1;
  }
}
</style>
