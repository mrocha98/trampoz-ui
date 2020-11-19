<template>
  <router-view />
</template>

<style lang="scss">
  html, body, #app {
    height: 100vh;
  }

  body {
    background-color: #17212F;
    color: rgba(255, 255, 255, 0.87);
  }

  #app {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
</style>
