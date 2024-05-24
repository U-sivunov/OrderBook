import axios from 'axios'
import lodash from "lodash"

let ws = null
let buffer = []

function updateArray(array1, array2, isBids = true) {
  let array1ByPrice = lodash.keyBy(array1, 0);
  let array2ByPrice = lodash.keyBy(array2, 0);
  lodash.mergeWith(array1ByPrice, array2ByPrice, (objValue, srcValue) => {
    if (lodash.isArray(objValue)) {
      return srcValue;
    }
  });
  const mergedArray = lodash.values(array1ByPrice).filter(order => parseFloat(order[1]) !== 0);

  return mergedArray.sort((a, b) => isBids ? b[0] - a[0] : a[0] - b[0]);
}

export default {
  namespaced: true,
  state: {
    currencyPair: 'BTCUSDT',
    selectedLimit: 100,
    bids: [],
    asks: [],
    lastUpdateId: null,
    logs: []
  },
  mutations: {
    SET_CURRENCY_PAIR(state, payload) {
      state.currencyPair = payload
    },
    SET_BIDS(state, payload) {
      state.bids = payload
    },
    SET_ASKS(state, payload) {
      state.asks = payload
    },
    SET_LAST_UPDATE_ID(state, payload) {
      state.lastUpdateId = payload
    },
    SET_SELECTED_LIMIT(state, payload) {
      state.selectedLimit = payload;
    },
    ADD_LOG(state, payload) {
      state.logs.push(payload);
    }
  },
  actions: {
    async fetchCurrencyData({ commit, state }) {
      try {
        const response = await axios.get(`https://api.binance.com/api/v3/depth?symbol=${state.currencyPair}&limit=1000`)
        const filteredUpdates = buffer.filter(update => update.u > response.data.lastUpdateId);
        let asks = response.data.asks;
        let bids = response.data.bids;
        filteredUpdates.forEach(update => {
          asks = updateArray(asks, update.a, false);
          bids = updateArray(bids, update.b);
        })
        commit('SET_BIDS', bids)
        commit('SET_ASKS', asks)
        commit('SET_LAST_UPDATE_ID', response.data.lastUpdateId)
      } catch (error) {
        console.error(error)
      }
    },
    changeCurrencyPair({ commit, dispatch, state }, newPair) {
      const oldPair = state.currencyPair;
      const timestamp = new Date().toLocaleString();
      buffer = []
      commit('SET_CURRENCY_PAIR', newPair)
      if (oldPair !== newPair) {
        commit('ADD_LOG', `Changed from ${oldPair} to ${newPair} at ${timestamp}`);
      }
      if (ws) {
        ws.close()
      }

      ws = new WebSocket(`wss://stream.binance.com:9443/ws/${newPair.toLowerCase()}@depth`)
      dispatch('connectWebSocket');
      dispatch('fetchCurrencyData');
    },
    connectWebSocket({ commit, state }) {
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)

        if (!state.lastUpdateId) {
          buffer.push(data)
        } else {
          const bids = JSON.parse(JSON.stringify(state.bids));
          const asks = JSON.parse(JSON.stringify(state.asks));
          commit('SET_BIDS', updateArray(bids, data.b))
          commit('SET_ASKS', updateArray(asks, data.a, false))
          commit('SET_LAST_UPDATE_ID', data.u)
        }
      }
    },
    setSelectedLimit({ commit }, limit) {
      commit('SET_SELECTED_LIMIT', limit);
    }
  },
  getters: {
    currencyPair: state => state.currencyPair,
    bids: state => state.bids,
    asks: state => state.asks,
    logs: state => state.logs
  },
}
