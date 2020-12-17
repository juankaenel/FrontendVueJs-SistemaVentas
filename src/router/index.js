import Vue from 'vue'
import VueRouter from 'vue-router'
import Store from '../store/index'
import Home from '../views/Home.vue'
import Category from '../components/Category'
import Article from '../components/Article'
import User from '../components/User'
import Login from '../components/Login'
import store from '../store/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      admin: true,
      grocer: true, // almacenero
      seller: true // vendedor
    }
  },
  {
    path: '/login',
    name: 'login', 
    component: Login,
    meta:{
      free: true,
    }
  },
  {
    path: '/category',
    name: 'category', // nombre que usamos en el :to="{name: 'category'}"
    component: Category,
    meta: {
      admin: true,
      grocer: true, // almacenero
    }
  },
  {
    path: '/user',
    name: 'user', // nombre que usamos en el :to="{name: 'user'}"
    component: User,
    meta: {
      admin: true,
    }
  },
  {
    path: '/article',
    name: 'article', 
    component: Article,
    meta: {
      admin: true,
      grocer:true,
    }
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// Validaciones de ruta 
router.beforeEach((to, from, next)=>{
  // login
  if(to.matched.some(record=> record.meta.free )){
    // si a la ruta que accedo dentro de su etiqueta meta tiene la propiedad free == true le permitimos el acceso
    next();
  }
  // Administrador
  else if(store.state.user && store.state.user.role == 'Administrador'){
    if(to.matched.some(record=> record.meta.admin )){
      next();
    }
  }
  // Vendedor
  else if(store.state.user && store.state.user.role == 'Vendedor'){
    if(to.matched.some(record=> record.meta.seller )){
      next();
    }
  }
  // Almacenero
  else if(store.state.user && store.state.user.role == 'Almacenero'){
    if(to.matched.some(record=> record.meta.grocer )){
      next();
    }
  }
  else{ // si no tiene acceso como adm, vendedor o almacenero vaya al loguin
    next({name: 'login'})
  }
})

export default router
