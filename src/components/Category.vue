<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-toolbar-title>Categorías</v-toolbar-title>
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
        
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="close">Cancelar</v-btn>
                    <v-btn color="blue darken-1" flat @click="save">Guardar</v-btn>
                    </v-card-actions>
                </v-card>
                </v-dialog>
            </v-toolbar>
            <v-data-table
                :headers="headers"
                :items="categories"
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
                   <v-icon small class="mr-2" @click="editItem(item.id)">edit</v-icon>
                   <v-icon small @click="deleteItem(item.id)">delete</v-icon>
                </template>
                <template v-slot:no-data>
                <v-btn color="primary" @click="getCategories">Reset</v-btn>
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
                categories: [], // acá alamacenaré todas las categorías que traigo de la bd
                headers: [ // cabecera del datatable
                { text: 'Nombre', value: 'name', sortable: true },
                { text: 'Descripción', value: 'description', sortable: false },
                { text: 'Estado', value: 'state', sortable: false },
                { text: 'Opciones', value: 'options', sortable: false },
                ],
                editedIndex: -1, // cuando está en -1 significa que no voy a estar editando, y cuando es 1 estoy editando
                // variables
                _id:'',
                name:'',
                description:'',
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
            this.getCategories()
        },
        methods: {
            getCategories(){
                axios.get('category/list')
                .then( res => {
                    this.categories = res.data; 
                })
                .catch( error => {
                    console.log(error);
                })
            },
            
            editItem (item) {
                this.editedIndex = this.categories.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialog = true
            },

            deleteItem (item) {
                const index = this.desserts.indexOf(item)
                confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
            },

            close () {
                this.dialog = false // se oculta el modal
            },

            clean() {
                this._id = '';
                this.name= '';
                this.description= '';
            },
            save () {
            if (this.editedIndex > -1) {
                // Editar los datos del registro
            } else {
                // Guardar un nuevo registro los datos del registro
                axios.post('category/add',{'name': this.name,'description': this.description})
                .then((res)=> 
                this.clean(),
                this.close(),
                this.getCategories(),                
                )
                .catch(error=>{console.log(error);
                })
            }
            this.close()
            }
        }
    }
</script>
