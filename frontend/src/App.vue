<script setup></script>

<template>
  <main class="wrapper">
    <header class="header">
      <h1>SomeApp</h1>
      <nav class="nav">
        <RouterLink to="/registration">Registration</RouterLink>
        <RouterLink to="/auth">Authorisation</RouterLink>
      </nav>
    </header>

    <div>
      <RouterView />
    </div>
  </main>
</template>

<style scoped>
.wrapper {
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 10px;
  height: 100vh;
}
.header {
  background: #9796966c;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5px;
}
.nav {
  display: flex;
  gap: 15px;
}
</style>
