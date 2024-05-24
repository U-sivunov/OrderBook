import { createStore } from 'vuex'
import currency from './modules/currency.js'

export default createStore({
  modules: {
    currency
  }
})
