<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar flat color="white">
                <v-btn @click="createPDF()">
                    <v-icon>print</v-icon>
                </v-btn>
                <v-toolbar-title class="ml-2">Artículos</v-toolbar-title>
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
                            <v-text-field v-model="code" label="Código"></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm6 md6>
                            <v-select v-model="category"
                                :items="categories"
                                label="Categoría"
                                >
                            </v-select>
                          </v-flex>
                        
                          <v-flex xs12 sm12 md12>
                            <v-text-field v-model="name" label="Nombre"></v-text-field>
                          </v-flex>

                           <v-flex xs12 sm6 md6>
                            <v-text-field type="number" v-model="stock" label="Stock"></v-text-field>
                          </v-flex>

                           <v-flex xs12 sm6 md6>
                            <v-text-field v-model="salePrice" label="Precio de venta"></v-text-field>
                          </v-flex>

                          <v-flex xs12 sm12 md12>
                            <v-text-field v-model="description" label="Descripción"></v-text-field>
                          </v-flex>
                          <v-flex xs12 sm12 md12 v-show="valid" class="font-weight-bold">
                                    <div class="red--text" v-for="v in messageValid" :key="v" v-flat="v">

                                    </div>
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="close">Cancelar</v-btn>
                    <v-btn color="blue darken-1" flat @click="save">Guardar</v-btn>
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
                            <v-btn @click="closeDialog()" color="light-blue darken-2" flat>
                                Cancelar
                            </v-btn>
                            <v-btn v-if="adAction==1" color="deep-orange accent-3" @click="activate()" flat>
                                Activar
                            </v-btn>
                            <v-btn v-if="adAction==2" color="deep-orange accent-3" @click="deactivate()" flat>
                                Desactivar
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
            <v-data-table
                :headers="headers"
                :items="articles"
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
                 <template v-slot:[`item.category`]="{ item }">
                    {{item.category.name}}
                 </template>
                <template v-slot:no-data>
                <v-btn color="primary" @click="getArticles">Reset</v-btn>
                </template>
            </v-data-table>
        </v-flex>
    </v-layout>
</template>
<script>
    import axios from 'axios';
    import jsPDF from 'jspdf';
    import autoTable from 'jspdf-autotable'
    export default {
        data(){
            return{
                dialog: false,
                search:'',
                articles: [], // acá alamacenaré todas las categorías que traigo de la bd
                headers: [ // cabecera del datatable
                { text: 'Código', value: 'code', sortable: false },
                { text: 'Nombre', value: 'name', sortable: true },
                { text: 'Categoría', value: 'category.name', sortable: true },
                { text: 'Stock', value: 'stock', sortable: false },
                { text: 'Precio de venta', value: 'salePrice', sortable: false },
                { text: 'Descripción', value: 'description', sortable: false },
                { text: 'Estado', value: 'state', sortable: false },
                { text: 'Opciones', value: 'options', sortable: false },
                ],
                editedIndex: -1, // cuando está en -1 significa que no voy a estar editando, y cuando es 1 estoy editando
                // variables
                _id:'',
                name:'',
                code:'',
                category:'',
                categories:[],
                stock:0,
                salePrice:0,
                description:'',
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
            this.getArticles();
            this.selectCategories();
        },
        methods: {
            selectCategories(){
                let categoriesArray = []; // guardo todas las categorias en la consulta axios
                let categoriesAct=[]; // guardamos las categorias activas
                let header = {"token": this.$store.state.token} 
                let configuration = {headers: header}; 
                axios.get('category/list', configuration) 
                .then( res => {
                    categoriesArray = res.data;
                    categoriesAct = categoriesArray.filter(cat=>cat.state === 1) // filtro por estado activado
                    /* console.log(categoriesAct); */
                    categoriesAct.map(cat=>{ // pusheo las categorias activas para mostrar en el select
                        this.categories.push({'text':cat.name,'value':cat._id}); // agregamos los elementos al array de categories
                    })  
                })
                .catch( error => {
                    console.log(error);
                })
            },
            getArticles(){
                let header = {"token": this.$store.state.token} 
                let configuration = {headers: header}; 
                axios.get('article/list', configuration) 
                .then( res => {
                    this.articles = res.data; 
                })
                .catch( error => {
                    console.log(error);
                })
            },
            
            validate () {
                this.valid=false;
                this.messageValid=[];
                if(!this.category){
                    this.messageValid.push('Debe seleccionar una categoría')
                }
                if(this.code.length > 64){
                    this.messageValid.push('El código no debe ser mayor a 64 caracteres')
                }
                if(this.name.length < 1 || this.name.length > 50){
                    this.messageValid.push('El nombre del artículo debe estar entre 1 y 50 caracteres')
                }
                if(this.description.length>255){
                    this.messageValid.push('La descripción del artículo no puede sobrepasar los 255 caracteres')
                }
                if(this.stock.length < 0){
                    this.messageValid.push('Ingrese un stock válido')
                }
                if(this.stock.length < 0){
                    this.messageValid.push('Ingrese un precio de venta válido')
                }
                if(this.messageValid.length>0){
                    this.valid = true; // existen mensajes de validación
                }           
                return this.valid; // returna true o false
            },
            editItem (item) {
                this._id = item._id;
                this.category = item.category._id;
                this.code = item.code;
                this.name = item.name;
                this.stock = item.stock;
                this.salePrice = item.salePrice;
                this.description = item.description;
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
                axios.put('article/activate',{'_id':this.adId}, configuration)
                .then((res)=> 
                this.adModal =0,
                this.adAction=0,
                this.adName= '',
                this.adId='',
                this.getArticles(),                
                ).catch(error=>{
                    console.log(error);
                })
            },
            deactivate(){
                let header = {"token": this.$store.state.token} 
                let configuration = {headers: header}; 
                axios.put('article/deactivate',{'_id':this.adId}, configuration)
                .then((res)=> 
                this.adModal =0,
                this.adAction=0,
                this.adName= '',
                this.adId='',
                this.getArticles(),                
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
                this.name= '';
                this.code= '';
                this.stock= '';
                this.salePrice= '';
                this.description= '';
                this.valid= false,
                this.messageValid=[],
                this.editedIndex= -1 // reinicio ya el editedindex ya que pude realizar la edición
            },
            // editar y guardar
            save () {
             /*    console.log(validate()); */
            if (this.validate()){ // si returna true cancelo todo porque hay errores
                return ;
            }
            if (this.editedIndex > -1) { // cuando mi editedIndex > -1 entro en modo de edición, put
                let header = {"token": this.$store.state.token} // mando el token
                let configuration = {headers: header}; // mando el token por el headers que defini que asi lo recibiría en el backend
                axios.put('article/update',{
                '_id': this._id,
                'category': this.category,
                'code': this.code,
                'name': this.name,
                'stock': this.stock,
                'salePrice': this.salePrice,
                'description': this.description}
                , configuration)
                .then((res)=> 
                this.getArticles(),                
                this.clean(),
                this.close(),
                )
            } else {
                let header = {"token": this.$store.state.token} // mando el token
                let configuration = {headers: header}; // mando el token por el headers que defini que asi lo recibiría en el backend
                // Guardar un nuevo registro los datos del registro
                axios.post('article/add',{
                'category': this.category,
                'code': this.code,
                'name': this.name,
                'stock': this.stock,
                'salePrice': this.salePrice,
                'description': this.description}
                , configuration)
                .then((res)=> 
                this.getArticles(),                
                this.clean(),
                this.close(),
                )
                .catch(error=>{console.log(error);
                })
            }
            this.close() // cerrar el modal
            },
            createPDF (){
                let columns = [
                    {title:"Nombre",dataKey: "name"},
                    {title:"Código",dataKey: "code"},
                    {title:"Categoría",dataKey: "category"},
                    {title:"Stock",dataKey: "stock"},
                    {title:"Precio de venta",dataKey: "salePrice"},
                ]; //columnas
                let rows =[]; //filas

                // recorro el array articles
                this.articles.map((x)=>{
                    console.log(x.category);
                    rows.push(
                        {
                        name:x.name,
                        code:x.code,
                        category:x.category.name,
                        stock:x.stock,
                        salePrice:x.salePrice,
                        }
                    )
                });
                let doc = new jsPDF('p','pt');
                doc.autoTable(columns,rows,{
                    margin: {top: 60},
                    addPageContent: function(data){
                        doc.text("Lista de Artículos", 40, 30);
                    }
                })

                doc.save('Artículos.pdf');
            }
        }
    }
</script>
