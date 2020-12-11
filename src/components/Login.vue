<template>
    <v-layout align-center justify-center>
        <v-flex xs12 sm8 md6 xl4>
            <v-card>
                <v-toolbar dark color="blue darken-3">
                    <v-toolbar-title>
                        Acceso al Sistema
                    </v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-text-field v-model="email" autofocus color="accent" label="Email" required></v-text-field>
                    <v-text-field v-model="password" type="password" color="accent" label="Password" required></v-text-field>
                <v-flex align-center justify-center class="red--text" v-if="errorM">
                    {{ errorM }}
                </v-flex>
                </v-card-text>
                
                <v-card-actions class="px-3 pb-3">
                    <v-flex text-xs-right>
                        <v-btn @click="enter()" color="primary">Ingresar</v-btn>
                    </v-flex>
                </v-card-actions>
            </v-card>
        </v-flex>        
    </v-layout>
</template>

<script>
import axios from 'axios'

export default {
    data () {
        return {
            email: '',
            password: '',
            errorM: null, 
        }
    },
    methods:{
        enter(){ // ingresar
            axios.post('/user/login',{email: this.email, password: this.password})
            .then(res=>{
                return res.data;
            }).then(data=>{
                // llamo al action para guardar el token
                this.$store.dispatch('saveToken', data.tokenReturn) // token return es lo q nos devuelve el backend
                this.$router.push({name:'home'});
            })
            .catch(error=>{
                console.log(error);
                this.errorM = null;
                if(error.response.status==404){
                    this.errorM = '¡No existe el usuario o las credenciales son incorrectas!'
                }
                else{
                    this.errorM = '¡Ocurrió un error con el servidor!'
                }
            })
        }
    }
}
</script>
