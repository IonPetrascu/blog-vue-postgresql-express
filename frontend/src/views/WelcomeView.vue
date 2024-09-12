<script setup></script>

<template>
  <div class="welcome-page">
    <ul class="circles">
      <li v-for="i in 10" :key="i"></li>
    </ul>
    <div class="wrapper">
      <h1>Welcome to Blog</h1>
      <p>
        Hi, I'm Petrascu Ion, a beginner front-end developer. This is my Blog
        project built with Vue.js.
      </p>
      <router-link to="/posts"
        ><button class="btn-start">Start</button></router-link
      >
    </div>
  </div>
</template>

<style scoped>
.welcome-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100% - 80px);
  text-align: center;
  padding: 20px;
  width: 100%;
}
.btn-start {
  background: var(--violet);
  padding: 5px 10px;
  color: var(--white);
  font-size: 2em;
  margin-top: 20px;
  border-radius: 5px;
}
.wrapper {
  margin: 0 auto;
  max-width: 1000px;
}
h1 {
  font-size: 3rem;
  color: var(--rose);
}

p {
  font-size: 1.5rem;
  color: var(--rose);
  margin-top: 20px;
}

.circles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100% - 80px);
  overflow: hidden;
  pointer-events: none;
}

.circles li {
  position: absolute;
  display: block;
  list-style: none;
  width: 20px;
  height: 20px;
  background: var(--orange);
  animation: animate 27s linear infinite;
  bottom: -150px;
}

.circles li:nth-child(1) {
  left: 25%;
  width: 80px;
  height: 80px;
  animation-delay: 0s;
}

.circles li:nth-child(2) {
  left: 10%;
  width: 20px;
  height: 20px;
  animation-delay: 2s;
  animation-duration: 12s;
}

.circles li:nth-child(3) {
  left: 70%;
  width: 20px;
  height: 20px;
  animation-delay: 4s;
}

.circles li:nth-child(4) {
  left: 40%;
  width: 60px;
  height: 60px;
  animation-delay: 0s;
  animation-duration: 18s;
}

.circles li:nth-child(5) {
  left: 65%;
  width: 20px;
  height: 20px;
  animation-delay: 0s;
}

.circles li:nth-child(6) {
  left: 75%;
  width: 110px;
  height: 110px;
  animation-delay: 3s;
}

.circles li:nth-child(7) {
  left: 35%;
  width: 150px;
  height: 150px;
  animation-delay: 7s;
}

.circles li:nth-child(8) {
  left: 50%;
  width: 25px;
  height: 25px;
  animation-delay: 15s;
  animation-duration: 45s;
}

.circles li:nth-child(9) {
  left: 20%;
  width: 15px;
  height: 15px;
  animation-delay: 2s;
  animation-duration: 35s;
}

.circles li:nth-child(10) {
  left: 85%;
  width: 150px;
  height: 150px;
  animation-delay: 0s;
  animation-duration: 18s;
}

@keyframes animate {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
    border-radius: 0;
  }

  100% {
    transform: translateY(-1000px) rotate(720deg);
    opacity: 0;
    border-radius: 50%;
  }
}
</style>
