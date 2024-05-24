<template>
  <v-app>
    <HeaderComponent />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
  import HeaderComponent from './components/HeaderComponent.vue'
  import {mapActions} from "vuex";

  export default {
    name: 'App',
    components: {
      HeaderComponent
    },
    methods: {
      ...mapActions('currency', ['changeCurrencyPair']),
    },
    created() {
      this.changeCurrencyPair(this.$store.state.currency.currencyPair);
    },
  }
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
  }
</style>
