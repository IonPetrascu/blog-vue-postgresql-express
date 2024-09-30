<script setup>
import { useRoute, useRouter } from "vue-router";
import { useStore } from "../store";
import { onMounted, ref, watch, computed } from "vue";
import PopupSubscribers from "../components/PopupSubscribers.vue";
import Posts from "../components/Posts.vue";

const store = useStore();
const route = useRoute();
const router = useRouter();
const showSubscribers = ref(false);
const popupDataType = ref("");
const userId = computed(() => route.params.id);
const showImgSettings = ref(false);

const isMyProfile = computed(() => {
  if (store.userInfo) {
    return store.userInfo.id === Number(route.params.id);
  }
  return false;
});

const popupData = computed(() => {
  return popupDataType.value === "subscribers"
    ? store.profile?.subscribers
    : store.profile?.subscriptions;
});

const isSubscribed = computed(() => {
  return (
    store.profile?.subscribers.findIndex(
      (sub) => sub.subscriber_id === store.userInfo?.id
    ) !== -1
  );
});

const createChat = async () => {
  const res = await store.createChat(userId.value, "New chat");
  if (res.success) {
    goToChats();
  }
};

const openSubscribersPopup = () => {
  popupDataType.value = "subscribers";
  showSubscribers.value = true;
};

const openSubscriptionsPopup = () => {
  popupDataType.value = "subscriptions";
  showSubscribers.value = true;
};

const goToChats = () => router.push("/chats");
const following = () => store.subscribeToUser(userId.value);
const removeFollowing = () => store.deleteSubscription(userId.value);
const closePopup = () => (showSubscribers.value = false);

const handleImgSettings = () => {
  showImgSettings.value = !showImgSettings.value;
};

const handleImageChange = async (event) => {
  try {
    const file = event.target.files[0];
    const formData = new FormData();

    if (!file) throw new Error("Error");
    formData.append("img", file);
    await store.changeProfileImg(formData);
    handleImgSettings();
  } catch (error) {
    console.error("Error on change img:", error);
  }
};

onMounted(() => store.getUserInfo(userId.value));

watch(
  () => route.params.id,
  (newUserId) => {
    store.getUserInfo(newUserId);
    closePopup();
  }
);
</script>
<template>
  <div class="profile-container">
    <div class="profile-banner"></div>
    <div class="profile-content">
      <div class="profile-header">
        <div class="profile-avatar">
          <img
            v-if="store.profile?.user?.img"
            :src="`http://localhost:3000/${store.profile.user.img}`"
            alt="Profile Image"
          />
          <img
            v-else
            src="../assets/default-user-img.jpg"
            alt="Profile Image"
          />
          <button
            v-if="isMyProfile"
            @click="handleImgSettings"
            class="profile-avatar-settings"
          >
            <img src="../assets/settings.svg" alt="settings img" />
          </button>
          <div class="avatar-settings-list" v-if="showImgSettings">
            <input
              ref="inputImg"
              id="input-file"
              multiple
              type="file"
              accept="image/jpeg, image/png ,image/jpg"
              @change="handleImageChange"
            />
          </div>
        </div>
        <button v-if="isMyProfile" class="profile-edit-button">Edit</button>
      </div>
      <div class="profile-details">
        <div class="profile-info">
          <h3 class="profile-name">{{ store.profile?.user.u_name }}</h3>
          <span class="profile-location">{{
            store.profile?.user.country
          }}</span>
        </div>
        <div v-if="!isMyProfile" class="profile-actions">
          <button
            v-if="!isSubscribed"
            @click="following"
            class="profile-action-btn following-btn"
          >
            Following
          </button>
          <button
            v-else
            @click="removeFollowing"
            class="profile-action-btn following-btn"
          >
            UnFollowing
          </button>
          <button class="profile-action-btn message-btn" @click="createChat">
            Message
          </button>
        </div>
      </div>
      <div class="profile-stats">
        <div class="profile-stat-item">
          <span class="profile-stat-number">{{
            store.profile?.posts.length
          }}</span>
          <span class="profile-stat-label">Posts</span>
        </div>
        <div class="profile-stat-item">
          <span class="profile-stat-number">{{
            store.profile?.subscribers.length
          }}</span>
          <button @click="openSubscribersPopup" class="profile-stat-label">
            Followers
          </button>
        </div>
        <div class="profile-stat-item">
          <span class="profile-stat-number">{{
            store.profile?.subscriptions.length
          }}</span>
          <button @click="openSubscriptionsPopup" class="profile-stat-label">
            Following
          </button>
        </div>
      </div>
    </div>
    <Posts :posts="store.profile?.posts" />
    <PopupSubscribers
      v-if="showSubscribers"
      :data="popupData"
      :type="popupDataType"
      @close-popup="closePopup"
    />
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
  position: relative;
}
.profile-avatar img {
  width: 100%;
  border-radius: 50%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
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
.profile-avatar-settings {
  position: absolute;
  transition: all 0.4s ease;
}
.profile-avatar-settings:hover {
  transform: rotate(45deg);
}
.profile-avatar-settings img {
  width: 20px;
  height: 20px;
}
.avatar-settings-list {
  position: absolute;
  top: 20px;
  padding: 10px;
  background: var(--white);
}
</style>
