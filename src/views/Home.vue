<template>
  <v-container grid-list-m>
    <v-layout wrap>
      <v-flex xs12 sm12 md12>
        <div class="ct-chart">
          <canvas id="myChart">

          </canvas>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios';
import Chart from 'chart.js';

export default {
data(){
  return{
    values:[], // almaceno todos los meses con sus totales
    months:[], // almaceno los meses
    totals:[], // almaceno los totales
  }
},
methods:{
  getGraphic(){
                let header = {"token": this.$store.state.token} // mando el token
                let configuration = {headers: header}; // mando el token por el headers que defini que asi lo recibiría en el backend
                axios.get('sale/twelveMonthChart', configuration)  // obtiene la lista de venta de 12 meses
                .then( res => {
                    this.values = res.data; 
                    this.graph();
                })
                .catch( error => {
                    console.log(error);
                })
            },
  graph(){
     let monthn='';
    // recorro todo el array valores y envio los totales y meses
      this.values.map((x)=>{
        switch(parseInt(x._id.month)){
          case 1:
            monthn= "Enero";
            break;
          case 2: 
            monthn= "Febrero";
            break;
          case 3:
            monthn= "Marzo";
            break;
          case 4:
            monthn= "Abril";
            break;
          case 5:
            monthn= "Mayo";
            break;
          case 6:
            monthn= "Junio";
            break;
          case 7:
            monthn= "Julio";
            break;
          case 8:
            monthn= "Agosto";
            break;
          case 9:
            monthn= "Septiembre";
            break;
          case 10:
            monthn= "Octubre";
            break;
          case 11:
            monthn= "Noviembre";
            break;
          case 12:
            monthn= "Diciembre";
            break;
          default:
            monthn='Error';
        }

      //this.months.push(x._id.month);
      this.months.push(monthn+'-'+x._id.year);
      this.totals.push(x.total);
    })
    
    var ctx = document.getElementById('myChart');
    var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: this.months,
        datasets: [{
            label: 'Venta de los últimos 12 meses',
            data: this.totals, // [1, 2, 3, 4]
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
              ],
            borderWidth: 1
        }]
        },
        options: {
          scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
        }
});
    

  },
},
mounted(){
  this.getGraphic();
} 
}

</script>
