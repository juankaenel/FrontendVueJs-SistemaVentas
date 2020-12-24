<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar text color="white">
                <v-toolbar-title>Clientes</v-toolbar-title>
                <v-divider
                class="mx-2"
                inset
                vertical
                ></v-divider>
                <v-spacer></v-spacer>
                <v-text-field class="text-xs-center" v-model="search" append-icon="search" 
                label="Búsqueda" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark class="mb-2" v-on="on">Nuevo</v-btn>
                </template>
                <v-card>
                    <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container grid-list-md>
                        <v-layout wrap>
                          
                          <v-flex xs12 sm6 md6>
                            <v-text-field v-model="name" label="Nombre"></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6 md6>
                            <v-select v-model="role" :items="roles" label="Rol"></v-select>
                          </v-flex>

                          <v-flex xs12 sm6 md6>
                            <v-select v-model="docType" :items="docTypes" label="Tipo de documento"></v-select>
                          </v-flex>
                          <v-flex xs12 sm6 md6>
                            <v-text-field v-model="docNumber" label="Número de documento"></v-text-field>
                          </v-flex>

                          <v-flex xs12 sm6 md6>
                            <v-text-field v-model="direction" label="Dirección"></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6 md6>
                            <v-text-field v-model="phone" label="Número de teléfono"></v-text-field>
                          </v-flex>  

                          <v-flex xs12 sm6 md6>
                            <v-text-field v-model="email" label="Email"></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6 md6>
                            <v-text-field v-model="password" type="password" label="Contraseña"></v-text-field>
                          </v-flex>  

                          <v-flex xs12 sm12 md12 v-show="valid" class="font-weight-bold">
                                    <div class="red--text" v-for="v in messageValid" :key="v" v-text="v">

                                    </div>
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                    <v-btn color="blue darken-1" text @click="save">Guardar</v-btn>
                    </v-card-actions>
                </v-card>
                </v-dialog>
                <v-dialog v-model="adModal" max-width="290"> <!--Dialog para activar o desactivar items-->
                    <v-card>
                        <v-card-title class="headline" v-if="adAction==1">
                            Activar Item
                        </v-card-title>
                        
                        <v-card-title class="headline" v-if="adAction==2">
                            Desactivar Item
                        </v-card-title>
                        <v-card-text>
                            Estas a punto de <span v-if="adAction==1">activar </span> <span v-if="adAction==2">desactivar </span> el item {{adName}}      
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn @click="closeDialog()" color="light-blue darken-2" text="flat">
                                Cancelar
                            </v-btn>
                            <v-btn v-if="adAction==1" color="deep-orange accent-3" @click="activate()" text="flat">
                                Activar
                            </v-btn>
                            <v-btn v-if="adAction==2" color="deep-orange accent-3" @click="deactivate()" text="flat">
                                Desactivar
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
            <v-data-table
                :headers="headers"
                :items="people"
                :search="search"
                class="elevation-1"
            >
                <template v-slot:[`item.state`]="{ item }">
                   <td>
                    <div v-if="item.state">
                        <span class="blue--text">Activo</span>
                    </div>
                    <div v-else>
                        <span class="red--text">Inactivo</span>
                    </div>
                </td>       
                </template>
                <template v-slot:[`item.options`]="{ item }">
                   <v-icon small class="mr-2" @click="editItem(item)">edit</v-icon>

                   <template v-if="item.state"> <!--En caso de que el registro esté activo y lo deseo desactivar le envio 2 como parametro-->
                        <v-icon small @click="enableDisableShow(2,item)">block</v-icon>
                   </template>
                   <template v-else>
                        <v-icon small @click="enableDisableShow(1,item)">check</v-icon> <!--Si le envio 1 quiero activar el registro-->
                   </template>

                </template>
                <template v-slot:no-data>
                <v-btn color="primary" @click="getUsers">Reset</v-btn>
                </template>
            </v-data-table>
        </v-flex>
    </v-layout>
</template>
<script>
    import axios from 'axios';
    export default {
        data(){
            return{
                dialog: false,
                search:'',
                people: [], // acá alamacenaré todos las personas que traigo de la bd
                headers: [ // cabecera del datatable
                { text: 'Tipo de Persona', value: 'personType', sortable: true },
                { text: 'Nombre', value: 'name', sortable: true },
                { text: 'Tipo de documento', value: 'docType', sortable: true },
                { text: 'Número de documento', value: 'docNumber', sortable: false },
                { text: 'Dirección', value: 'direction', sortable: false },
                { text: 'Teléfono', value: 'phone', sortable: false },
                { text: 'Email', value: 'email', sortable: false },
                { text: 'Estado', value: 'state', sortable: false },
                { text: 'Opciones', value: 'options', sortable: false },
                ],
                editedIndex: -1, // cuando está en -1 significa que no voy a estar editando, y cuando es 1 estoy editando
                // variables
                _id:'',
                name:'',
                personType:'',
                personTypes: ['Administrador', 'Almacenero', 'Vendedor'],
                docType: '',
                docTypes : ['DNI','RUC', 'PASAPORTE', 'CEDULA'],
                docNumber: '',
                direction: '',
                phone: '',
                email: '',
                password: '',
                // validaciones
                valid:false, // si es 1 existe un error de validación, si es cero no hay error
                messageValid:[], // almaceno los mensajes de validaciones que el usr no cumple 
                // activar y desactivar registros
                adModal:0, // la utilizo para activar o desactivar el modal
                adAction:0, // 1 activar, 2 desactivar
                adName:'', // nombre del registro que deseo activar/desactivar
                adId:'', // id del registro que deseo activar/desactivar
                }
        },
        computed: {
            formTitle () {
            return this.editedIndex === -1 ? 'Nuevo Registro' : 'Editar Registro'
            }
        },
        watch: {
            dialog (val) {
            val || this.close()
            }
        },
        created () {
            this.getClients()
        },
        methods: {
            getClients(){
                let header = {"token": this.$store.state.token} // mando el token
                let configuration = {headers: header}; // mando el token por el headers que defini que asi lo recibiría en el backend
                axios.get('person/list-clients', configuration) 
                .then( res => {
                    this.people = res.data; 
                })
                .catch( error => {
                    console.log(error);
                })
            },
            
            validate () {
                this.valid=false;
                this.messageValid=[];
                if(!this.role){
                    // error de validación
                    console.log('falta rol');
                    this.messageValid.push('Debe seleccionar un rol')
                }
                if(this.name.length < 1 || this.name.length > 50){
                    this.messageValid.push('El nombre de la usuario debe estar entre 1 y 50 caracteres')
                }
                if(this.docNumber.length>20){  
                    this.messageValid.push('El documento no puede tener más de 20 caracteres')
                }
                if(this.direction.length>70){  
                    this.messageValid.push('La dirección no puede tener más de 70 caracteres')
                }
                if(this.phone.length>20){  
                    this.messageValid.push('El número de teléfono no puede tener más de 20 caracteres')
                }
                if(this.email.length < 1 || this.email.length > 50){
                    this.messageValid.push('El email del usuario debe estar entre 1 y 50 caracteres')
                }

                if(this.password.length < 1 || this.password.length > 64){
                    this.messageValid.push('La contraseña del usuario debe estar entre 1 y 64 caracteres')
                }


                if(this.messageValid.length>0){
                    this.valid = true; // existen mensajes de validación
                }           
                return this.valid; // returna true o false
            },
            editItem (item) {
                this._id = item._id;
                this.role = item.role;
                this.name = item.name;
                this.docType = item.docType;
                this.docNumber = item.docNumber;
                this.direction = item.direction;
                this.phone = item.phone;
                this.email = item.email;
                this.password = item.password;
                this.dialog = true; // muestro la pantalla modal
                this.editedIndex = 1; // ahora paso a editar no a guardar
            },

            enableDisableShow(action, item) {
                this.adModal = 1;
                this.adName = item.name;
                this.adId = item._id;
                if (action == 1){
                    // activar
                    this.adAction = 1;
                }else if(action == 2){
                    // desactivar
                    this.adAction = 2;
                }else{
                    this.adModal = 0; // si no se asigna un valor 1 o 2 no muestro el modal
                }
            },
            activate(){
                let header = {"token": this.$store.state.token} // mando el token
                let configuration = {headers: header}; // mando el token por el headers que defini que asi lo recibiría en el backend
                axios.put('user/activate',{'_id':this.adId}, configuration)
                .then((res)=> 
                this.adModal =0,
                this.adAction=0,
                this.adName= '',
                this.adId='',
                this.getUsers(),                
                ).catch(error=>{
                    console.log(error);
                })
            },
            deactivate(){
                let header = {"token": this.$store.state.token} 
                let configuration = {headers: header}; 
                axios.put('user/deactivate',{'_id':this.adId}, configuration)
                .then((res)=> 
                this.adModal =0,
                this.adAction=0,
                this.adName= '',
                this.adId='',
                this.getUsers(),                
                ).catch(error=>{
                    console.log(error);
                })
            },
            closeDialog(){
                // hace referencia al modal de activar o desactivar un item, este cierra el modal
                this.adModal=0;
            },

            close () {
                // hace referencia al modal que se ejecuta cuando queremos agregar un nuevo elemento a la tabla
                this.dialog = false // se oculta el modal
                this.clean();
            },

            clean() {
                this._id = '';
                this.role= '';
                this.name= '';
                this.docNumber= '';
                this.direction= '';
                this.phone= '';
                this.email= '';
                this.password= '';

                this.valid= false,
                this.messageValid=[],
                this.editedIndex= -1 // reinicio ya el editedindex ya que pude realizar la edición
            },
            // editar y guardar
            save () {
             /*    console.log(validate()); */
                let header = {"token": this.$store.state.token} // mando el token
                let configuration = {headers: header}; // mando el token por el headers que defini que asi lo recibiría en el backend
            if (this.validate()){ // si returna true cancelo todo porque hay errores
                return ;
            }
            if (this.editedIndex > -1) { // cuando mi editedIndex > -1 entro en modo de edición, put
                axios.put('user/update',{
                    '_id':this._id,
                    'role':this.role, 
                    'name':this.name, 
                    'docType': this.docType, 
                    'docNumber':this.docNumber, 
                    'direction': this.direction, 
                    'phone': this.phone, 
                    'email':this.email, 
                    'password': this.password}
                    , configuration)
                .then((res)=> 
                this.getClients(),                
                this.clean(),
                this.close(),
                )
            } else {
                axios.post('user/add',{'role':this.role, 'name':this.name, 'docType': this.docType, 'docNumber':this.docNumber, 'direction': this.direction, 'phone': this.phone, 'email':this.email, 'password': this.password}, configuration)
                .then((res)=> 
                this.getClients(),                
                this.clean(),
                this.close(),
                )
                .catch(error=>{console.log(error);
                })
            }
            this.close() // cerrar el modal
            }
        }
    }
</script>
