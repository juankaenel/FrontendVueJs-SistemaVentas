import Vue from 'vue'
import Vuex from 'vuex'
import decode from 'jwt-decode'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null,
    user: null,
  },
  mutations: {
    SET_TOKEN(state, token){ 
      state.token = token;
    },
    SET_USER(state, user){
      state.user = user;
    }
  },
  actions: {
    saveToken({commit}, token){ // lo utilizamos para almacenar el token en el local storage
      commit('SET_TOKEN', token)
      commit('SET_USER', decode(token)) // obtengo el usr a través de la decodificación del token
      localStorage.setItem("token", token)
    },
    autoLogin({commit}){ // verifica el local storage q haya un token para no volver a pedir al usr q se loguee
      let token = localStorage.getItem("token")
      if(token){
        commit('SET_TOKEN', token)
        commit('SET_USER', decode(token))
      }
      router.push({name: 'home'})
    },
    exit({commit}){ // elimina el token del local storage
      commit('SET_TOKEN', null)
      commit('SET_USER', null)
      localStorage.removeItem("token")
      router.push({name: 'login'})
    }
  },
  modules: {
  }
})
