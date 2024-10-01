<script setup>
import { onMounted, ref } from "vue";
import { useStore } from "../store";
import { VMarkdownEditor } from "vue3-markdown";
import "vue3-markdown/dist/style.css";

const showFormPost = ref(true);
const title = ref("");
const description = ref("");
const previewImage = ref(null);
const store = useStore();
const inputImg = ref(null);

onMounted(() => store.getPosts());

const handleSubmit = async () => {
  const file = inputImg.value?.files[0];
  const formData = new FormData();
  if (!title.value || !description.value) {
    return;
  }
  formData.append("title", title.value);
  formData.append("description", description.value);

  if (file) {
    formData.append("img", file);
  }

  try {
    const post = await store.createPost(formData);
    if (post) clearForm();
  } catch (error) {
    console.error("Error submitting the form:", error);
  }
};

const clearImage = () => {
  inputImg.value.value = "";
  previewImage.value = null;
};

const clearForm = () => {
  clearImage();
  title.value = "";
  description.value = "";
};

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    previewImage.value = URL.createObjectURL(file);
  }
};

const handleUpload = (file) => {
  console.log(file);
  return "https://i.postimg.cc/52qCzTVw/pngwing-com.png";
};
</script>
<template>
  <div class="wrapper">
    <form class="form" @submit.prevent="handleSubmit" v-if="showFormPost">
      <h3 class="title">Title post</h3>
      <input v-model="title" type="text" placeholder="Title of post" required />
      <h3 class="title">Image post</h3>
      <div class="wrapper-img">
        <label v-if="!previewImage" class="label-file" for="input-file"
          >Add image of post</label
        >
        <label v-else class="label-file" for="input-file"
          >Change image of post</label
        >
        <button v-if="previewImage" type="button" @click="clearImage">
          Clear img
        </button>
      </div>

      <img
        class="img-preview"
        :class="{ active: previewImage !== null }"
        v-if="previewImage !== null"
        :src="previewImage"
        alt=""
      />
      <input
        ref="inputImg"
        id="input-file"
        type="file"
        accept="image/jpeg, image/png ,image/jpg"
        @change="handleImageChange"
      />
      <h3 class="title">Editor</h3>
      <VMarkdownEditor
        class="editor"
        v-model="description"
        locale="en"
        :upload-action="handleUpload"
      />
      <div class="buttons">
        <button @click="clearForm" type="button">Cancel</button>
        <button type="submit">Add post</button>
      </div>
    </form>
  </div>
</template>
<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-inline: 10px;
}
input,
textarea {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid var(--c-1);
  background: var(--white);
  font-size: 1.2em;
}
input:focus,
textarea:focus {
  outline: none;
  background: var(--c-3);
}

.buttons {
  display: flex;
  justify-content: space-evenly;
}
button {
  padding: 15px 10px;
  border-radius: 10px;
  font-size: 1em;
}
button[type="submit"] {
  background: var(--c-4);
}

button[type="button"] {
  background: var(--gray);
}
.img-preview {
  object-fit: cover;
  transition: all 4s ease;
  max-height: 500px;
  width: 100%;
  opacity: 0;
  transform: scale(0.9);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.img-preview.active {
  height: 400px;
  opacity: 1;
  transform: scale(1);
}
input[type="file"] {
  display: none;
}
.wrapper-img {
  display: flex;
  gap: 10px;
}
.label-file {
  background: var(--c-2);
  padding: 10px;
  cursor: pointer;
  width: max-content;
  border-radius: 10px;
}

.editor {
  background: rgb(255, 250, 250) !important;
  height: 300px;
}
.view {
  border: 1px solid var(--c-4);
  border-radius: 10px;
  min-height: 100px;
  padding: 10px;
}
</style>
