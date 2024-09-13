<script setup>
import { onMounted, ref } from "vue";
import { useStore } from "../store";

const showFormPost = ref(true);
const title = ref("Title of post");
const description = ref("description");
const previewImage = ref(null);

const store = useStore();

onMounted(() => store.getPosts());

const handleSubmit = async (event) => {
  /*   console.log(event.target[1].files[0]);

  const file = event.target[1].files[0];
  const formData = new FormData();
  formData.append("file", file);

  store.createPost(title.value, description.value); */

  const file = event.target[1].files[0];
  const formData = new FormData();
  formData.append("title", title.value);
  formData.append("description", description.value);
  formData.append("img", file);

  console.log(formData);

  try {
    await store.createPost(formData);
  } catch (error) {
    console.error("Error submitting the form:", error);
  }
};

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    previewImage.value = URL.createObjectURL(file);
  }
};
</script>
<template>
  <div class="wrapper">
    <form
      class="form"
      @submit.prevent="(event) => handleSubmit(event)"
      v-if="showFormPost"
    >
      <input v-model="title" type="text" placeholder="Title of post" required />
      <label for="input-file">Add image of post</label>
      <img
        class="img-preview"
        :class="{ active: previewImage !== null }"
        v-if="previewImage !== null"
        :src="previewImage"
        alt=""
      />
      <input
        id="input-file"
        type="file"
        accept="image/jpeg, image/png ,image/jpg"
        @change="handleImageChange"
      />
      <textarea
        v-model="description"
        type="text"
        placeholder="Enter description"
      ></textarea>
      <div class="buttons">
        <button type="button">Cancel</button>
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
  max-width: 700px;
  margin: 0 auto;
}
input,
textarea {
  padding: 10px;
  border-radius: 10px;
  border: none;
  background: var(--white);
  font-size: 1.2em;
}
input:focus,
textarea:focus {
  outline: none;
  background: #c5c5c5;
}

textarea {
  height: 300px;
  resize: none;
}

.buttons {
  display: flex;
  justify-content: space-evenly;
}
button {
  padding: 10px;
  border-radius: 10px;
  font-size: 1.2em;
}
button[type="submit"] {
  background: rgb(97, 253, 97);
}

button[type="button"] {
  background: rgb(245, 61, 61);
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
</style>
