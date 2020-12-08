import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Category from '../components/Category'
import Login from '../components/Login'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login', 
    component: Login
  },
  {
    path: '/category',
    name: 'Category', // nombre que usamos en el :to="{name: 'category'}"
    component: Category
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
