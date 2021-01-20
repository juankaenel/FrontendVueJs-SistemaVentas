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
                <v-dialog v-model="modalComprobant" max-width="1000px">
                    <v-card>
                        <v-card-title class="headline">
                            <v-btn>
                                <v-icon>
                                    print
                                </v-icon>
                                Reporte de Venta
                            </v-btn>
                        </v-card-title>
                        <v-card-text>
                            <div id="invoice">
                                 <header>
                                    <div id="logo"> <!-- formato base 64-->
                                        <img src=" data:image/png;base64,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" id="imagen">
                                    </div>
                                    <div id="datos">
                                        <p id="encabezado">
                                            <b>Devkoders</b><br>Dean Fúnes 120, Córdoba - Argentina<br>Telefono:(+54)372555555<br>Email:devkoders29@gmail.com
                                        </p>
                                    </div>
                                    <div id="fact">
                                        <p>{{comprobantType}}<br>
                                        {{voucherSeries}}--{{comprobantNumber}}<br>
                                        {{date}}</p>
                                    </div>
                                </header>
                                <br>
                                <section>
                                    <div>
                                        <table id="facliente">
                                            <tbody>
                                                <tr>
                                                    <td id="cliente">
                                                        <strong>Sr(a). Juan Carlos Arcila Díaz</strong><br>
                                                        <strong>Documento:</strong> 47715777<br>
                                                        <strong>Dirección:</strong> Zarumilla 113 - Chiclayo<br>
                                                        <strong>Teléfono:</strong> 931742904<br>
                                                        <strong>Email:</strong> jcarlos.ad7@gmail.com
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </section>
                                <br>
                                <section>
                                    <div>
                                        <table id="facarticulo">
                                            <thead>
                                                <tr id="fa">
                                                    <th>CANT</th>
                                                    <th>DESCRIPCION</th>
                                                    <th>PRECIO UNIT</th>
                                                    <th>DESC.</th>
                                                    <th>PRECIO TOTAL</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td style="text-align:center;">cant</td>
                                                    <td>descripcion del producto descripcion del producto descripcion del producto</td>
                                                    <td style="text-align:right;">precio uni</td>
                                                    <td style="text-align:right;">descuento</td>
                                                    <td style="text-align:right;">precio total</td>
                                                </tr>
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <th></th>
                                                    <th></th>
                                                    <th></th>
                                                    <th style="text-align:right;">SUBTOTAL</th>
                                                    <th style="text-align:right;">subtotal</th>
                                                </tr>
                                                <tr>
                                                    <th></th>
                                                    <th></th>
                                                    <th></th>
                                                    <th style="text-align:right;">IVA</th>
                                                    <th style="text-align:right;">iva</th>
                                                </tr>
                                                <tr>
                                                    <th></th>
                                                    <th></th>
                                                    <th></th>
                                                    <th style="text-align:right;">TOTAL</th>
                                                    <th style="text-align:right;">total</th>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </section>
                                <br>
                                <br>
                                <footer>
                                    <div id="gracias">
                                        <p><b>Gracias por su compra!</b></p>
                                    </div>
                                </footer>
                            </div>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn @click="hideComprobant()" color="blue darken-1" text>Cancelar</v-btn>
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
                    <v-icon small class="mr-2" @click="viewComprobant(item)">
                    print
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
                // comprobante modal
                modalComprobant:0,
                date:null,
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
            viewComprobant(item){
                this.clean();
                this.comprobantType = item.comprobantType;
                this.voucherSeries = item.voucherSeries;
                this.comprobantNumber = item.comprobantNumber;
                this.person = item.person;
                this.tax = item.tax;
                this.getDetails(item._id);
                this.date = item.createdAt;
                this.modalComprobant = 1;

            },
            hideComprobant(){
                this.modalComprobant = 0;
            },
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
                axios.put('sale/activate',{'_id':this.adId}, configuration)
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
                axios.put('sale/deactivate',{'_id':this.adId}, configuration)
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

<style>
	    #invoice {
            padding: 20px;
            font-family: Arial, sans-serif;
            font-size: 16px ;
        }

        #logo {
            float: left;
            margin-left: 2%;
            margin-right: 2%;
        }
        #imagen {
            width: 100px;
        }

        #fact {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
        }   

        #datos {
            float: left;
            margin-top: 0%;
            margin-left: 2%;
            margin-right: 2%;
            /*text-align: justify;*/
        }

        #encabezado {
            text-align: center;
            margin-left: 10px;
            margin-right: 10px;
            font-size: 16px;
        }

        section {
            clear: left;
        }

        #cliente {
            text-align: left;
        }

        #facliente {
            width: 40%;
            border-collapse: collapse;
            border-spacing: 0;
            margin-bottom: 15px;
        }

        #fa {
            color: #FFFFFF;
            font-size: 14px;
        }

        #facarticulo {
            width: 100%;
            border-collapse: collapse;
            border-spacing: 0;
            padding: 20px;
            margin-bottom: 15px;
        }

        #facarticulo thead {
            padding: 20px;
            background: #2183E3;
            text-align: center;
            border-bottom: 1px solid #FFFFFF;
        }

        #gracias {
            text-align: center;
        }
</style>
