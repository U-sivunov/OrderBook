<template>
  <v-container>
    <v-card>
      <v-card-title>
        Order Book {{ currencyPair }}
        <v-select
          v-model="localSelectedLimit"
          :items="limits"
          label="Number of elements"
          class="ml-4"
        ></v-select>
      </v-card-title>
      <v-card-text>
        <v-row style="flex-wrap: nowrap;">
          <v-col cols="12" md="6" class="order-book-table">
            <table>
              <thead>
              <tr>
                <th>Price</th>
                <th v-show="!isMobile">Quantity</th>
                <th>Total</th>
              </tr>
              </thead>
              <tbody>
              <template v-for="(order, index) in asks.slice(0, selectedLimit)" :key="index">
                <tr :style="{'background': `linear-gradient(to left, rgba(255, 0, 0, 0.2) ${calculateBar(order[1])}%, transparent ${calculateBar(order[1])}%)`}">
                  <td class="red--text">{{ parseFloat(order[0]).toFixed(2) }}</td>
                  <td v-show="!isMobile">{{ parseFloat(order[1]).toFixed(5) }}</td>
                  <td>{{ (order[0] * order[1]).toFixed(5) }}</td>
                </tr>
              </template>
              </tbody>
            </table>
          </v-col>
          <v-col cols="12" md="6" class="order-book-table">
            <table>
              <thead>
              <tr>
                <th>Price</th>
                <th v-show="!isMobile">Quantity</th>
                <th>Total</th>
              </tr>
              </thead>
              <tbody>
              <template v-for="(order, index) in bids.slice(0, selectedLimit)" :key="index">
                <tr :style="{'background': `linear-gradient(to left, rgba(0, 255, 0, 0.2) ${calculateBar(order[1])}%, transparent ${calculateBar(order[1])}%)`}">
                  <td class="green--text">{{ parseFloat(order[0]).toFixed(2) }}</td>
                  <td v-show="!isMobile">{{ parseFloat(order[1]).toFixed(5) }}</td>
                  <td>{{ (order[0] * order[1]).toFixed(5) }}</td>
                </tr>
              </template>
              </tbody>
            </table>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  export default {
    name: 'OrderBook',
    data() {
      return {
        limits: [10, 100, 500, 1000],
        isMobile: false,
        barScale: {
          'BTCUSDT': 1,
          'BNBBTC': 10,
          'ETHBTC': 10
        }
      }
    },
    created() {
      this.handleResize();
      window.addEventListener('resize', this.handleResize);
    },
    beforeUnmount() {
      window.removeEventListener('resize', this.handleResize);
    },
    methods: {
      ...mapActions('currency', ['setSelectedLimit']),
      calculateBar(quantity) {
        return quantity * 100 / this.barScale[this.currencyPair];
      },
      handleResize() {
        this.isMobile = window.innerWidth <= 600;
      },
      onLimitChange(value) {
        this.setSelectedLimit(value);
      }
    },
    computed: {
      ...mapState('currency', ['bids', 'asks', 'currencyPair', 'selectedLimit']),
      localSelectedLimit: {
        get() {
          return this.selectedLimit;
        },
        set(value) {
          this.onLimitChange(value);
        }
      }
    }
  }
</script>

<style scoped>
  .order-book-table {
    max-height: calc(100vh - 238px);
    overflow-y: auto;
    flex-shrink: 1;
    padding: 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  thead {
    position: sticky;
    top: 0;
    background: white;
  }

  tbody tr, thead tr {
    height: 20px;
    display: table-row;
  }

  tbody th, thead td {
    text-align: left;
    padding: 8px;
    height: 20px;
  }

  table thead {
    background-color: #f5f5f5;
  }

  .ask-orders td:first-child {
    color: rgb(227, 59, 84)
  }

  .bid-orders td:first-child {
    color: rgb(46, 189, 133);
  }

  .v-input {
    margin-left: 0 !important;
  }
  .v-row {
    margin: 0 !important;
  }

  .red--text {
    color: rgb(227, 59, 84) !important;
  }
  .green--text {
    color: rgb(46, 189, 133) !important;
  }

</style>
