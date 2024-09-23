<script setup>
import { useStore } from "../store";
import { onMounted, ref, onUnmounted, watch, computed } from "vue";

const chats = ref([]);
const messages = ref([]);
const activeChatId = ref(null);
const socket = ref(null);
const connected = ref(false);
const inputValue = ref("");
const store = useStore();
const showPopup = ref(true);

const activeChat = computed(() => {
  if (!activeChatId.value || !chats.value.length) return null;
  return chats.value.find((chat) => chat.chat_id === activeChatId.value);
});

const isNewChat = computed(() => !messages?.value.length);

const closeWelcomePopup = () => (showPopup.value = false);

const sendWelcomeMessage = () => {
  inputValue.value = "Hello!";
  sendMessage();
  closeWelcomePopup();
};

function connect() {
  socket.current = new WebSocket("ws://localhost:3000");

  socket.current.onopen = () => {
    connected.value = true;
    const user_id = store.userInfo?.id;

    const message = {
      event: "connection",
      user_id,
      id: activeChatId.value,
    };
    socket.current.send(JSON.stringify(message));

    requestChatHistory(activeChatId.value, user_id);
  };

  socket.current.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.event === "message") {
      activeChat.value.last_message_content = message.content;
      activeChat.value.last_message_sent_at = message.sent_at;
      messages.value.push(message);
    } else if (message.event === "history") {
      messages.value = message.messages;
    }
  };

  /*   socket.current.onclose = () => {
    console.log("Socket closed");
  }; */

  socket.current.onerror = () => {
    console.log("Socket error");
  };
}

const sendMessage = async () => {
  const user_id = store.userInfo?.id;

  const message = {
    chat_id: activeChatId.value,
    user_id,
    message: inputValue.value,
    event: "message",
  };

  if (message.chat_id && message.message && user_id) {
    socket.current.send(JSON.stringify(message));
    inputValue.value = "";
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

const setActiveChat = (id) => {
  socket.current.close();
  activeChatId.value = id;
  const user_id = store.userInfo?.id;

  if (user_id && id) {
    connect();
  }
};

onMounted(async () => {
  chats.value = await store.getMyChats();
});

watch(
  () => store.userInfo,
  (newUserInfo) => {
    if (newUserInfo?.id) {
      connect();
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  if (socket.value) {
    socket.value.close();
    console.log("Close connection with websocket");
  }
});
</script>
<template>
  <div class="main-chat">
    <div class="chat-sidebar">
      <div class="chats-header"></div>
      <div class="chat-list">
        <div
          v-for="chat in chats"
          @click="() => setActiveChat(chat.chat_id)"
          :key="chat.id"
          class="chat-item"
          :class="{
            active: chat.chat_id === activeChatId,
          }"
        >
          <img
            class="chat-item-img"
            src="../assets/default-user-img.jpg"
            alt=""
          />

          <div class="chat-item-info">
            <h3>{{ chat.user_name }}</h3>
            <span v-if="chat.last_message_content">{{
              chat.last_message_content
            }}</span>
          </div>
          <div class="chat-item-info-msg">
            <time v-if="chat.last_message_sent_at" class="new-msg-time">{{
              chat.last_message_sent_at.slice(11, 16)
            }}</time>
            <span class="new-msg-cout">2</span>
          </div>
        </div>
        <button class="chat-add">New chat</button>
      </div>
    </div>
    <div v-if="activeChatId !== null" class="chat-wrapper">
      <div class="chat-header">
        <img
          class="chat-img-user"
          src="../assets/default-user-img.jpg"
          alt=""
        />

        <div class="chat-info">
          <router-link :to="`/profile/${activeChat.user_id}`">
            <h3 v-if="activeChat.user_name" class="user-name">
              {{ activeChat.user_name }}
            </h3></router-link
          >

          <span v-if="activeChat.last_message_sent_at" class="latest-online"
            >last seen {{ activeChat.last_message_sent_at.slice(11, 16) }}</span
          >
        </div>
        <button class="chat-settings">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 8C11.4696 8 10.9609 7.78929 10.5858 7.41421C10.2107 7.03914 10 6.53043 10 6C10 5.46957 10.2107 4.96086 10.5858 4.58579C10.9609 4.21071 11.4696 4 12 4C12.5304 4 13.0391 4.21071 13.4142 4.58579C13.7893 4.96086 14 5.46957 14 6C14 6.53043 13.7893 7.03914 13.4142 7.41421C13.0391 7.78929 12.5304 8 12 8ZM12 14C11.4696 14 10.9609 13.7893 10.5858 13.4142C10.2107 13.0391 10 12.5304 10 12C10 11.4696 10.2107 10.9609 10.5858 10.5858C10.9609 10.2107 11.4696 10 12 10C12.5304 10 13.0391 10.2107 13.4142 10.5858C13.7893 10.9609 14 11.4696 14 12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14ZM10 18C10 18.5304 10.2107 19.0391 10.5858 19.4142C10.9609 19.7893 11.4696 20 12 20C12.5304 20 13.0391 19.7893 13.4142 19.4142C13.7893 19.0391 14 18.5304 14 18C14 17.4696 13.7893 16.9609 13.4142 16.5858C13.0391 16.2107 12.5304 16 12 16C11.4696 16 10.9609 16.2107 10.5858 16.5858C10.2107 16.9609 10 17.4696 10 18Z"
              fill="#707991"
            />
          </svg>
        </button>
      </div>
      <div class="chat-body">
        <ul class="messages-list">
          <li
            class="message-wrapper animation"
            v-for="msg in messages"
            :key="msg.id"
          >
            <div class="message" v-if="msg.user_id !== store.userInfo.id">
              <div>
                <img
                  class="user-img"
                  src="../assets/default-user-img.jpg"
                  alt=""
                />
              </div>
              <p class="message-text">{{ msg.content }}</p>
              <span class="time">{{ msg.sent_at.slice(11, 16) }}</span>
            </div>
            <div v-else class="message user-msg">
              <span class="time">{{ msg.sent_at.slice(11, 16) }}</span>
              <p class="message-text">{{ msg.content }}</p>
              <div>
                <img
                  class="user-img"
                  src="../assets/default-user-img.jpg"
                  alt=""
                />
              </div>
            </div>
          </li>
        </ul>
        <div class="chat-footer">
          <input
            @keyup.enter="sendMessage"
            v-model="inputValue"
            placeholder="Message"
            type="text"
          />
          <button class="submit-msg" type="submit">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.815 12.197L5.28299 13.453C5.19639 13.4675 5.11513 13.5045 5.04737 13.5603C4.97961 13.6161 4.92775 13.6888 4.89699 13.771L2.29999 20.728C2.05199 21.368 2.72099 21.978 3.33499 21.671L21.335 12.671C21.4597 12.6088 21.5645 12.513 21.6378 12.3945C21.7111 12.276 21.7499 12.1394 21.7499 12C21.7499 11.8607 21.7111 11.7241 21.6378 11.6055C21.5645 11.487 21.4597 11.3913 21.335 11.329L3.33499 2.32901C2.72099 2.02201 2.05199 2.63301 2.29999 3.27201L4.89799 10.229C4.9286 10.3114 4.98041 10.3843 5.04818 10.4403C5.11594 10.4963 5.19728 10.5335 5.28399 10.548L12.816 11.803C12.8623 11.8111 12.9043 11.8353 12.9346 11.8714C12.9649 11.9074 12.9815 11.9529 12.9815 12C12.9815 12.0471 12.9649 12.0926 12.9346 12.1287C12.9043 12.1647 12.8623 12.1889 12.816 12.197H12.815Z"
                fill="#a594f9"
              />
            </svg>
          </button>
          <div class="welcome-popup" :class="{ show: isNewChat && showPopup }">
            <p class="welcome-text">
              This chat is currently empty. Be the first to post a message!
            </p>
            <div class="welcome-btns">
              <button @click="closeWelcomePopup" class="welcome-btn close-btn">
                Close
              </button>
              <button @click="sendWelcomeMessage" class="welcome-btn send-btn">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="welcome-page" v-else>
      <div class="welcome-container">
        <h1 class="welcome-title">Welcome to the chat of blog!</h1>
        <p class="welcome-message">
          Here you can chat with friends and acquaintances. Choose a chat and
          start a conversation!
        </p>
      </div>
    </div>
  </div>
</template>
<style scoped>
.main-chat {
  display: flex;
  border: 1px solid var(--c-1);
  height: calc(100% - 80px);
}
.chat-sidebar {
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--c-1);
  width: 360px;
}
.chats-header {
  height: 56px;
  border-bottom: 1px solid var(--c-1);
}
.chat-list {
  display: flex;
  flex-direction: column;
  overflow: auto;
}
.chat-add {
  height: 40px;
  background: var(--c-1);
  cursor: pointer;
}
.chat-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  cursor: pointer;
}
.chat-item.active {
  background: var(--c-4);
}
.chat-item:hover {
  background: var(--c-4);
}
.chat-item-img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.chat-item-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.user-name {
  font-weight: 600;
  font-size: 16px;
  line-height: 125%;
}

.latest-online {
  font-weight: 400;
  font-size: 14px;
  line-height: 129%;
  opacity: 0.5;
}

.chat-item-info-msg {
  display: flex;
  flex-direction: column;
  margin-left: auto;
  align-items: end;
  gap: 4px;
}

.new-msg-time {
  font-weight: 400;
  font-size: 12px;
  line-height: 133%;
}

.new-msg-cout {
  border-radius: 100px;
  width: 18px;
  height: 18px;
  background: var(--orange);
  display: flex;
  align-items: center;
  justify-content: center;
}
.chat-wrapper {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
}
.chat-header {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  gap: 16px;
}
.chat-img-user {
  width: 40px;
  border-radius: 50%;
}
.chat-settings {
  margin-left: auto;
  cursor: pointer;
  transition: transform 0.3s ease;
}
.chat-settings:hover {
  transform: rotate(90deg);
}
.chat-body {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding-inline: 20px;
  background: rgb(255, 235, 235);
  padding-bottom: 20px;
  height: calc(100% - 56px);
}

.chat-messages-list {
  flex-grow: 1;
  list-style-type: none;
}

.chat-footer {
  padding: 16px;
  display: flex;
  gap: 16px;
  background: var(--white);
  border-radius: 20px;
  position: relative;
}
.chat-footer input {
  flex-grow: 1;
  line-height: 125%;
  border: none;
  outline: none;
}
.submit-msg {
  transition: scale 0.3s ease;
}
.submit-msg {
  scale: 1.2;
}

.messages-list {
  list-style-type: none;
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex-grow: 1;
  margin-bottom: 40px;
  overflow: auto;
  padding: 10px 10px 0;
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

.welcome-page {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  text-align: center;
}
.welcome-container {
  max-width: 500px;
  margin: 0 auto;
}
.welcome-title {
  color: var(--c-4);
}
.welcome-message {
  font-size: 1.3em;
  color: var(--c-3);
  margin-block: 10px;
}

.messages-list::-webkit-scrollbar {
  width: 10px;
}

.messages-list::-webkit-scrollbar-track {
  background: var(--c-1);
}

.messages-list::-webkit-scrollbar-thumb {
  background: var(--c-4);
  border-radius: 10px;
  cursor: pointer;
}

.welcome-popup {
  position: absolute;
  top: -90px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px;
  background: white;
  border-radius: 10px;
  opacity: 0;
}
.welcome-popup.show {
  opacity: 1;
}

.welcome-text {
  margin-bottom: 5px;
}
.welcome-btns {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}
.welcome-btn {
}
.close-btn {
}
.send-btn {
}
</style>
