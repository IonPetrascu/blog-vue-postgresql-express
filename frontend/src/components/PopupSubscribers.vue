<script setup>
import { RouterLink } from "vue-router";
const props = defineProps({
  data: Array,
  type: String,
});

const emit = defineEmits(["closePopup"]);
</script>
<template>
  <div class="overlay">
    <div class="popup">
      <div class="popup-header">
        <h3 class="popup-title">{{ type }}</h3>
        <button class="popup-close-btn" @click="emit('closePopup')">
          <img src="../assets/close-icon.svg" alt="close popup" />
        </button>
      </div>
      <div v-if="data.length > 2" class="popup-search">
        <input class="search" type="text" />
      </div>
      <ul class="sub-list" v-if="data?.length > 0">
        <div
          class="sub-item"
          v-for="subscriber in data"
          :key="subscriber.subscriber_id"
        >
          <div>
            <img
              v-if="subscriber.img"
              class="sub-img"
              :src="`http://localhost:3000/${subscriber.img}`"
            />
            <img
              v-else
              class="sub-img"
              src="../assets/default-user-img.jpg"
              alt=""
            />
          </div>
          <router-link
            class="user-info"
            :to="`/profile/${
              subscriber.subscriber_id || subscriber.subscribed_to_id
            }`"
          >
            <h4 class="user-name">{{ subscriber.u_name }}</h4>
            <span class="user-email">{{ subscriber.u_email }}</span>
          </router-link>
        </div>
      </ul>
      <span class="empty-msg" v-else>List is empty</span>
    </div>
  </div>
</template>
<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #22222260;
  display: flex;
  align-items: center;
  justify-content: center;
}
.popup {
  background: var(--white);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 400px;
  border-radius: 10px;
}
.sub-list {
  list-style-type: none;
}
.popup-header {
  display: flex;
  align-items: center;
}
.popup-title {
  flex-grow: 1;
  text-align: center;
  font-size: 1.4em;
  font-weight: normal;
  text-transform: uppercase;
}
.user-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.user-name {
  font-size: 1em;
  font-weight: 600;
}
.user-email {
  font-size: 0.7em;
}
.search {
  width: 100%;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid var(--c-4);
  outline: none;
}
.search:focus {
  background: var(--c-1);
}
.popup-close-btn {
  margin-left: auto;
  width: 25px;
  height: 25px;
  transition: scale 0.2s ease;
}
.popup-close-btn:hover {
  scale: 1.2;
}
.popup-close-btn img {
  width: 100%;
  height: 100%;
}
.sub-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.sub-item {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 2px;
  border-radius: 5px;
}
.sub-item:hover {
  background: var(--c-1);
}
.empty-msg {
  text-align: center;
}
</style>
