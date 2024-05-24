<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title>
      <div class="logo-wrapper">
        <img src="@/assets/market-logo.png" alt="Crypto Market Logo" class="logo">
        <b>CryptoMarket</b>
      </div>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn text to="/settings">Settings</v-btn>
    <v-btn text to="/order-book">Order Book</v-btn>
  </v-app-bar>
</template>

<script>
  export default {
    name: 'HeaderComponent'
  }
</script>

<style scoped>
  .header {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    background-color: #f5f5f5;
  }

  .logo-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 60px;
  }

  .logo {
    height: 60px;
  }

  @media (max-width: 600px) {
    .logo-wrapper b {
      display: none;
    }
  }

  nav a {
    margin-left: 15px;
  }
</style>
