<script setup>
import { useRoute, useRouter } from "vue-router";
import { useStore } from "../store";

const store = useStore();
const route = useRoute();

const userId = route.params.id;

const router = useRouter();

const goToChats = () => {
  router.push("/chats");
};

const createChat = async () => {
  const res = await store.createChat(userId, "New chat");
  if (res) {
    goToChats();
  }
};
</script>
<template>
  <div class="profile-container">
    <div class="profile-banner"></div>
    <div class="profile-content">
      <div class="profile-header">
        <button class="profile-avatar">
          <img src="../assets/default-user-img.jpg" alt="Profile Image" />
        </button>
        <button class="profile-edit-button">Edit</button>
      </div>
      <div class="profile-details">
        <div class="profile-info">
          <h3 class="profile-name">Petrascu Ion</h3>
          <span class="profile-location">Chisinau, Moldova</span>
        </div>
        <div class="profile-actions">
          <button class="profile-action-btn following-btn">Following</button>
          <button class="profile-action-btn message-btn" @click="createChat">
            Message
          </button>
        </div>
      </div>
      <div class="profile-stats">
        <div class="profile-stat-item">
          <span class="profile-stat-number">6</span>
          <span class="profile-stat-label">Posts</span>
        </div>
        <div class="profile-stat-item">
          <span class="profile-stat-number">53</span>
          <span class="profile-stat-label">Followers</span>
        </div>
        <div class="profile-stat-item">
          <span class="profile-stat-number">19</span>
          <span class="profile-stat-label">Following</span>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.profile-container {
  padding: 0 10px;
}
.profile-banner {
  height: 200px;
  background: var(--c-2);
  border-radius: 10px;
}
.profile-content {
  padding: 0 20px;
  transform: translateY(-30%);
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.profile-header {
  display: flex;
}
.profile-avatar {
  width: 150px;
}
.profile-avatar img {
  width: 100%;
  border-radius: 50%;
}
.profile-edit-button {
  align-self: flex-end;
  margin-left: auto;
}

.profile-name {
  font-size: 1.4em;
}

.profile-location {
  font-size: 1em;
  opacity: 0.5;
}

.profile-stats {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.profile-stat-number {
  margin-right: 5px;
  font-weight: bold;
}
.profile-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.4em;
  margin-top: 10px;
}
</style>
