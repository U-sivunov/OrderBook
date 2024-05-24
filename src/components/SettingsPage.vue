<template>
  <v-container>
    <v-card>
      <v-card-title>Settings</v-card-title>
      <v-card-text>
        <v-select
          v-model="selectedCurrencyPair"
          :items="currencyPairs"
          label="Select Currency Pair"
          @change="onCurrencyPairChange"
        ></v-select>
      </v-card-text>
    </v-card>
    <v-card style="margin-top: 20px">
      <v-card-title>Change log</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item
            v-for="(log, index) in logs"
            :key="index"
          >
            {{ log }}
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
  import { mapActions, mapGetters, mapState } from 'vuex';

  export default {
    name: 'SettingsPage',
    data() {
      return {
        currencyPairs: ['BTCUSDT', 'BNBBTC', 'ETHBTC']
      }
    },
    computed: {
      ...mapState('currency', ['currencyPair']),
      ...mapGetters('currency', ['logs']),
      selectedCurrencyPair: {
        get() {
          return this.currencyPair;
        },
        set(value) {
          this.changeCurrencyPair(value);
        }
      }
    },
    methods: {
      ...mapActions('currency', ['changeCurrencyPair']),
      onCurrencyPairChange(value) {
        this.changeCurrencyPair(value);
      }
    }
  };
</script>
