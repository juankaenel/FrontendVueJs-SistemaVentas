<template>
    <v-layout align-start>
        <v-flex>
            <v-toolbar text color="white">
                <v-toolbar-title>Ventas</v-toolbar-title>
                <v-divider
                class="mx-2"
                inset
                vertical
                ></v-divider>
                <v-spacer></v-spacer>
                <v-btn color="primary" dark class="mr-3 mt-1" v-if="viewNew==0" @click="showNew()" >Nuevo</v-btn>
                <v-text-field class="text-xs-center"  v-if="viewNew==0" v-model="search" append-icon="search" 
                label="Búsqueda" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="1000px">
                <v-card>
                    <v-card-title>
                        <span class="headline">Seleccione un artículo</span>
                    </v-card-title>
                    <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12 sm12 md12 lg12 xl12>
                                <template>
                                    <v-text-field v-model="text" @keyup="getArticles" class="text-xs-center" append-icon="search" label="Búsqueda"></v-text-field>
                                    <v-data-table
                                        :headers="articlesHeaders"
                                        :items="articles"
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
                                        <template v-slot:[`item.select`]="{ item }">
                                        <v-icon small class="mr-2" @click="addDetail(item)">add</v-icon>
                                        </template>
                                        <template v-slot:[`item.category`]="{ item }">
                                            {{item.category.name}}
                                        </template>
                                        
                                    </v-data-table>
                                </template>
                            </v-flex>
                        </v-layout>
                    </v-container>
                    </v-card-text>
                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">Salir</v-btn>
                    
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
                :items="sales"
                :search="search"
                class="elevation-1"
                v-if="viewNew==0"
            >
               

                <template v-slot:[`item.state`]="{ item }">
                   <td>
                    <div v-if="item.state">
                        <span class="blue--text">Aceptado</span>
                    </div>
                    <div v-else>
                        <span class="red--text">Anulado</span>
                    </div>
                </td>       
                </template>
                <template v-slot:[`item.options`]="{ item }">
                   <!-- <v-icon small class="mr-2" @click="editItem(item)">edit</v-icon> -->
                    <v-icon small class="mr-2" @click="viewRevenue(item)">
                    tab
                    </v-icon>
                   <template v-if="item.state"> <!--En caso de que el registro esté activo y lo deseo desactivar le envio 2 como parametro-->
                        <v-icon small @click="enableDisableShow(2,item)">block</v-icon>
                   </template>
                   <template v-else>
                        <v-icon small @click="enableDisableShow(1,item)">check</v-icon> <!--Si le envio 1 quiero activar el registro-->
                   </template>

                </template>
                <template v-slot:no-data>
                <v-btn color="primary" @click="getSale">Reset</v-btn>
                </template>
            </v-data-table>
            <v-container grid-list-sm class="pa-4 white" v-if="viewNew">
                <v-layout row wrap>
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-select v-model="comprobantType"
                        :items="vouchers"
                        label="Tipo de comprobantes">
                        </v-select>
                    </v-flex>
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-text-field v-model="voucherSeries"
                        label="Serie comprobante">
                        </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-text-field v-model="comprobantNumber"
                        label="Número comprobante">
                        </v-text-field>
                    </v-flex>

                    <v-flex xs12 sm8 md8 lg8 xl8>
                        <v-autocomplete 
                        :items="people"
                        v-model="person"
                        label="Cliente">
                        </v-autocomplete>
                    </v-flex>
                    <v-flex xs12 sm4 md4 lg4 xl4>
                        <v-text-field type="number" v-model="tax"
                        label="Impuesto">
                        </v-text-field>
                    </v-flex>
                    
                    <v-flex xs12 sm8 md8 lg8 xl8>
                        <v-text-field v-model="code"
                        label="Código" @keyup.enter="searchCode()">
                        </v-text-field>
                    </v-flex>

                    <v-flex xs12 sm2 md2 lg2 xl2>
                        <v-btn small fab dark color="teal" @click="viewModalArticles">
                            <v-icon dark>list</v-icon>
                        </v-btn>
                    </v-flex>

                    <v-flex xs12 sm2 lg2 xl2 v-show="articleError">
                        <div class="red--text" v-text=articleError></div>
                    </v-flex>

                    <v-flex xs12 sm12 md12 lg12 xl12>
                        <template>
                            <v-data-table
                            :headers="headerDetails"
                            :items="details"
                            class="elevation-1"
                            >
                                <template v-slot:[`item.delete`]={item}>
                                      <v-icon small class="mr-2"
                                      @click="deleteDetail(details,item)">
                                            delete
                                       </v-icon>
                                </template>
                    
                                <template v-slot:[`item.quantity`]="{ item }">
                                    <v-text-field v-model="item.quantity" type="number"></v-text-field>
                                </template>

                                <template v-slot:[`item.salePrice`]="{ item }">
                                    <v-text-field v-model="item.salePrice" type="number"></v-text-field>
                                </template>
                    
                                 <template v-slot:[`item.discount`]="{ item }">
                                     <v-text-field v-model="item.discount" type="number"></v-text-field>
                                </template>

                                <template v-slot:[`item.subtotal`]="{ item }">
                                    {{(item.salePrice * item.quantity) - item.discount}}
                                </template>
                                
                                <template v-slot:no-data>
                                  <h3>No hay artículos agregados al detalle.</h3>
                                </template>
                            </v-data-table>
                            <v-flex class="text-xs-right">
                                <strong>Total Parcial: </strong>${{partialTotal=(total-taxTotal).toFixed(2)}}
                            </v-flex>
                            <v-flex class="text-xs-right">
                                <strong>Total Impuesto: </strong>${{taxTotal=((total*tax)/(1+tax)).toFixed(2)}}
                            </v-flex>
                            <v-flex class="text-xs-right">
                                <strong>Total Neto: </strong>${{total=calculateTotal}} <!--el total lo calculamos con la funcion computada calculateTotal-->
                            </v-flex>
                        </template>
                    </v-flex>
                    <v-flex xs12 sm12 md12 lg12 xl12>
                        <div class="red--text" v-for="v in messageValid" :key="v" v-text="v">

                        </div>
                    </v-flex>
                    <v-flex xs12 sm12 md12 lg12 xl12 class="mt-2">
                        <v-btn color="blue darken-1" text @click.native="hideNew()">Cancelar</v-btn>
                        <v-btn color="success" v-if="viewDetail==0" @click.native="save()">Guardar</v-btn>
                    </v-flex>

                </v-layout>
            </v-container>
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
                sales: [], // acá alamacenaré todos las ventas que traigo de la bd
                headers: [ // cabecera del datatable
                { text: 'Usuario', value: 'user.name', sortable: true },
                { text: 'Cliente', value: 'person.name', sortable: true },
                { text: 'Tipo de comprobante', value: 'comprobantType', sortable: true },
                { text: 'Serie de comprobante', value: 'voucherSeries', sortable: true },
                { text: 'Número de comprobante', value: 'comprobantNumber', sortable: false },
                { text: 'Fecha', value: 'createdAt', sortable: false },
                { text: 'Impuesto', value: 'tax', sortable: false },
                { text: 'Total', value: 'total', sortable: false },
                { text: 'Estado', value: 'state', sortable: false },
                { text: 'Opciones', value: 'options', sortable: false },
                ],
                editedIndex: -1, // cuando está en -1 significa que no voy a estar editando, y cuando es 1 estoy editando
                // variables
                _id:'',
                person:'',
                people:[],
                comprobantType: '',
                vouchers: ['BOLETA',' FACTURA', 'TICKET', 'GUIA'],
                voucherSeries: '',
                comprobantNumber: '',
                tax: 0.21,
                //details
                code:'',
                headerDetails:[
                    {text: 'Borrar', value: 'delete', sortable:false},                    
                    {text: 'Artículo', value: 'article', sortable:false},                    
                    {text: 'Cantidad', value: 'quantity', sortable:false},                    
                    {text: 'Precio', value: 'salePrice', sortable:false},                    
                    {text: 'Descuento', value: 'discount', sortable:false},                    
                    {text: 'Sub Total', value: 'subtotal', sortable:false},                    
                ],
                details:[],
                viewNew:'',
                articleError:null,
                total:0,
                partialTotal:0,
                taxTotal:0,
                articles:[],
                text:'',
                 articlesHeaders: [ // cabecera de la ventana modal
                { text: 'Código', value: 'code', sortable: false },
                { text: 'Nombre', value: 'name', sortable: true },
                { text: 'Categoría', value: 'category.name', sortable: true },
                { text: 'Stock', value: 'stock', sortable: false },
                { text: 'Precio de venta', value: 'salePrice', sortable: false },
                { text: 'Descripción', value: 'description', sortable: false },
                { text: 'Estado', value: 'state', sortable: false },
                { text: 'Seleccionar', value: 'select', sortable: false },
                ],
                // validaciones
                viewDetail:0,
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
            },
            calculateTotal(){
                let result=0.0;
                for(let i=0; i<this.details.length; i++){
                    result= result+((this.details[i].quantity * this.details[i].salePrice) - this.details[i].discount);
                }
            return result;
            }
        },
        watch: {
            dialog (val) {
            val || this.close()
            }
        },
        created () {
            this.getSale();
            this.selectPerson();
        },
        methods: {
            selectPerson(){
                let peopleArray = []; // guardo todas las personas en la consulta axios
                let peopleAct=[]; // guardamos las personas activas
                let header = {"token": this.$store.state.token} 
                let configuration = {headers: header}; 
                axios.get('person/list-clients', configuration) 
                .then( res => {
                    peopleArray = res.data;
                    peopleAct = peopleArray.filter(p=>p.state === 1) // filtro por estado activado
                    /* console.log(categoriesAct); */
                    peopleAct.map(p=>{ // pusheo las categorias activas para mostrar en el select
                        this.people.push({'text':p.name,'value':p._id}); // agregamos los elementos al array de people
                    })  
                })
                .catch( error => {
                    console.log(error);
                })
            },
            searchCode(){
                let header = {"token": this.$store.state.token} // mando el token
                let configuration = {headers: header}; // mando el token por el headers que defini que asi lo recibiría en el backend
                axios.get('article/queryCode?code='+this.code, configuration) 
                .then( res => {
                    this.addDetail(res.data); // le mando los datos de la consulta al método addDetail
                })
                .catch( error => {
                    this.articleError = 'No existe el artículo!'
                })
            },
            addDetail(data){
                this.articleError=null
                if(this.checkDetail(data._id)){
                    this.articleError = 'El artículo ya ha sido agregado!'
                }
                else{
                    this.details.push(
                        {
                        _id:data._id,
                        article: data.name,
                        quantity:1,
                        discount:0,
                        salePrice: data.salePrice,
                        }
                )
                }
                
            },
            checkDetail(id){ // revisa si se encuentra o no un articulo en el detalle
                let sw=false;
                for(let i=0; i < this.details.length; i++){ //recorro el array details
                    if(this.details[i]._id==id){
                        sw=true; 
                    }
                }
                return sw;
            },
            deleteDetail(array, item){
                let i = array.indexOf(item); // capturo el indice 
                if(i!= -1){
                    array.splice(i,1); // elimino ese indice
                }
            },
            getSale(){
                let header = {"token": this.$store.state.token} // mando el token
                let configuration = {headers: header}; // mando el token por el headers que defini que asi lo recibiría en el backend
                axios.get('sale/list', configuration) 
                .then( res => {
                    this.sales = res.data; 
                })
                .catch( error => {
                    console.log(error);
                })
            },
            getArticles(){
                let header = {"token": this.$store.state.token} 
                let configuration = {headers: header}; 
                axios.get('article/list?value='+this.text, configuration) 
                .then( res => {
                    this.articles = res.data; 
                })
                .catch( error => {
                    console.log(error);
                })
            },
            viewModalArticles(){
                this.dialog=1;
            }, 
            getDetails(id){ // obtiene los detalles de un ingreso específico
                let header = {"token": this.$store.state.token} 
                let configuration = {headers: header}; 
                axios.get('sale/query?_id='+id, configuration) 
                .then( res => {
                    this.details = res.data.details;
                })
                .catch( error => {
                    console.log(error);
                })
            },
            viewRevenue(item){ // ver ingreso
                this.clean();
                this.comprobantType = item.comprobantType;
                this.voucherSeries = item.voucherSeries;
                this.comprobantNumber = item.comprobantNumber;
                this.person = item.person._id;
                this.tax = item.tax;
                this.getDetails(item._id);
                this.viewNew = 1; // deseo mostrar el formulario
                this.viewDetail = 1;
            },
            validate () {
                this.valid=false;
                this.messageValid=[];
                if(!this.person){
                    // error de validación
                    this.messageValid.push('Debe seleccionar un cliente')
                }
                if(!this.comprobantType){
                    this.messageValid.push('Seleccione un tipo de comprobante')
                }
                if(!this.comprobantNumber){  
                    this.messageValid.push('Ingrese el número de comprobante')
                }
                if(!this.tax || this.tax < 0 || this.tax>1){  
                    this.messageValid.push('Ingrese un impuesto válido')
                }
                if(this.details.length<=0){  
                    this.messageValid.push('Ingrese al menos un artículo al detalle')
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
                this.adName = item.comprobantNumber;
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
                axios.put('revenue/activate',{'_id':this.adId}, configuration)
                .then((res)=> 
                this.adModal =0,
                this.adAction=0,
                this.adName= '',
                this.adId='',
                this.getSale(),                
                ).catch(error=>{
                    console.log(error);
                })
            },
            deactivate(){
                let header = {"token": this.$store.state.token} 
                let configuration = {headers: header}; 
                axios.put('revenue/deactivate',{'_id':this.adId}, configuration)
                .then((res)=> 
                this.adModal =0,
                this.adAction=0,
                this.adName= '',
                this.adId='',
                this.getSale(),                
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
                
            },

            clean() {
                this._id = '';
                this.person= '';
                this.comprobantType= '';
                this.voucherSeries= '';
                this.comprobantNumber= '';
                this.tax= 0.21;
                this.code= '';
                this.total= 0;
                this.partialTotal= 0;
                this.taxTotal= 0;
                this.details= [];
                this.viewNew= 0;

                this.valid= false;
                this.messageValid=[];
                this.viewDetail=0;
                },
            showNew(){
                this.viewNew=1;
            },
            hideNew(){
                this.viewNew=0;
                this.clean();
            },

            // editar y guardar
            save () {
             /*    console.log(validate()); */
                let header = {"token": this.$store.state.token} // mando el token
                let configuration = {headers: header}; // mando el token por el headers que defini que asi lo recibiría en el backend
            if (this.validate()){ // si returna true cancelo todo porque hay errores
                return ;
            }
                axios.post('sale/add',
                {
                'person':this.person, 
                'user':this.$store.state.user._id,
                'comprobantType': this.comprobantType, 
                'voucherSeries': this.voucherSeries, 
                'comprobantNumber':this.comprobantNumber, 
                'tax': this.tax, 
                'total':this.total,
                'details': this.details
                }, configuration)
                .then((res)=> 
                this.getSale(),                
                this.clean(),
                this.close(),
                )
                .catch(error=>{console.log(error);
                })
            this.close() // cerrar el modal
            }
        }
    }
</script>
