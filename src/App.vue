<template>
  <v-app id="app">
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
      v-if="loggedIn" 
    > 
      <v-list dense> <!--Opciones de menú izquierdo--->
      <!--Solo se listará si está logueado como admin, vendedor o vendedor --->
        <template v-if="isAdmin || isGrocer || isSeller">
          <v-list-item :to="{name: 'home'}">
            <v-list-item-action>
              <v-icon>home</v-icon>
            </v-list-item-action>
            <v-list-item-title>
              Inicio
            </v-list-item-title>
          </v-list-item>
        </template>
        <!-- Template almacen -->
        <template v-if="isAdmin || isGrocer">
          <v-list-group>
            
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>
                  Almacén
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            
            <v-list-item :to="{name: 'category'}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Categorías
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item :to="{name: ''}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Artículos
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

          </v-list-group>
        </template>
        <!-- Template compras -->
        <template v-if="isAdmin || isGrocer">
          <v-list-group>
            
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>
                  Compras
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            
            <v-list-item :to="{name: ''}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Ingresos
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item :to="{name: ''}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Proveedores
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

          </v-list-group>
        </template>   
        <!-- Template ventas -->
        <template v-if="isAdmin || isSeller">
          <v-list-group>
            
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>
                  Ventas
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            
            <v-list-item :to="{name: ''}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Ventas
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item :to="{name: ''}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Clientes
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

          </v-list-group>
        </template>
        <!-- Template Accesos -->
        <template v-if="isAdmin">
          <v-list-group>
            
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>
                  Accesos
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            
            <v-list-item :to="{name: ''}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Usuarios
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

          </v-list-group>
        </template>
         <!-- Template Consultas -->
        <template v-if="isAdmin || isGrocer || isSeller">
          <v-list-group>
            
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>
                  Consultas
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            
            <v-list-item :to="{name: ''}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Consulta Compras
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item :to="{name: ''}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Consulta Ventas
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

          </v-list-group>
        </template>  

      </v-list>
    </v-navigation-drawer>

    <!--Barra nav horizontal-->
    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="blue darken-3"
      dark
    >
      <v-toolbar-title
        style="width: 300px"
        class="ml-0 pl-3"
      >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <span class="hidden-sm-and-down">Sistema</span>
      </v-toolbar-title>
     
      <v-spacer></v-spacer>
      <v-btn  @click="logout()" icon v-if="loggedIn" >
        <v-icon>logout</v-icon> Salir
      </v-btn>
      <v-btn :to="{name: 'login'}" icon v-else>
        <v-icon>login</v-icon> Login
      </v-btn>

    </v-app-bar>

    <v-main>
      <v-container
        fluid
        fill-height
      >
      <v-slide-y-transition mode="out-in">
        <router-view/>
      </v-slide-y-transition>
      </v-container>
    </v-main>

    <!-- FOOTER -->
    <v-footer height="auto">
      <v-layout justify-center>
        <v-flex text-xs-center>
          <v-card text tile color="primary" class="white--text">
            <v-card-text class="text-center white--text p-0">
              Juan Kaenel &copy; 2020
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>


export default {
  name: 'App',
  data: () => {
    return {
      drawer:true,
    }
  },
  computed:{
    loggedIn(){ // verifica si está logueado devolviendo true si existe un usr en el state
      return this.$store.state.user; 
    },
    isAdmin(){  // verifica si es admin. Si existe el usr y su rol es adm devolverá true
      return this.$store.state.user && this.$store.state.user.role == 'Administrador';
    },
    isGrocer(){ // verifica si es almacenero.
      return this.$store.state.user && this.$store.state.user.role == 'Almacenero';
    },
    isSeller(){ // verifica si es vendedor
      return this.$store.state.user && this.$store.state.user.role == 'Vendedor';
    }
  },
  created(){ // verificamos si existe un token en el local storage para no volver a autenticarse. para eso llamo al action
    this.$store.dispatch('autoLogin');
  },
  methods:{
    logout(){ // cerrar sesión
      this.$store.dispatch('exit'); // llamo a la action exit que me borrará el token y hará que cierre sesión 
    } 

  },
};
</script>
