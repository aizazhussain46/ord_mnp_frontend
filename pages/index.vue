<template>
<div>
<v-row>
<v-col>
<v-card class="no_print" >

<v-list-item four-line >
<v-list-item-content>
<div class="overline mb-4">Today's Orders</div>
<v-list-item-title color="pink darken-2" class=" headline mb-1">{{daily_orders.orders_count}} </v-list-item-title>
<v-list-item-subtitle>
</v-list-item-subtitle>
</v-list-item-content>
<v-list-item-avatar
tile class="primary" size="60">
<span><v-icon class="accent--text">mdi-package-variant</v-icon></span>
</v-list-item-avatar>
</v-list-item>
</v-card>

</v-col>

<v-col>
<v-card class="no_print">
<v-list-item four-line>
<v-list-item-content>
<div class="overline mb-4">Last Week Orders</div>
<v-list-item-title color="pink darken-2" class=" headline mb-1">{{weekly_orders.orders_count}}</v-list-item-title>
<v-list-item-subtitle>
</v-list-item-subtitle>
</v-list-item-content>

<v-list-item-avatar
tile class="primary" size="60">
<span><v-icon class="accent--text">mdi-package-variant</v-icon></span>
</v-list-item-avatar>
</v-list-item>
</v-card>
</v-col>


<v-col>
<v-card class="no_print">

<v-list-item four-line>
<v-list-item-content>
<div class="overline mb-4">Last Month Orders</div>
<v-list-item-title color="pink darken-2" class=" headline mb-1">{{monthly_orders.orders_count}}</v-list-item-title>
<v-list-item-subtitle>
</v-list-item-subtitle>
</v-list-item-content>

<v-list-item-avatar
tile class="primary" size="60">
<span><v-icon class="accent--text">mdi-package-variant</v-icon></span>
</v-list-item-avatar>
</v-list-item>
</v-card>
</v-col>

</v-row>

<v-row>
<v-col>
<v-card class="no_print" >

<v-list-item four-line >
<v-list-item-content>
<div class="overline mb-4">Today's Order Income</div>
<v-list-item-title color="pink darken-2" class=" headline mb-1">{{daily_orders.orders_amount | get_decimal_value | get_comma_seperator}} </v-list-item-title>
<v-list-item-subtitle>
</v-list-item-subtitle>
</v-list-item-content>
<v-list-item-avatar
tile class="primary" size="60">
<span><v-icon class="accent--text">mdi-sale</v-icon></span>
</v-list-item-avatar>
</v-list-item>
</v-card>

</v-col>

<v-col>
<v-card class="no_print">
<v-list-item four-line>
<v-list-item-content>
<div class="overline mb-4">Last Week Order Income</div>
<v-list-item-title color="pink darken-2" class=" headline mb-1">{{weekly_orders.orders_amount | get_decimal_value | get_comma_seperator}}</v-list-item-title>
<v-list-item-subtitle>
</v-list-item-subtitle>
</v-list-item-content>

<v-list-item-avatar
tile class="primary" size="60">
<span><v-icon class="accent--text">mdi-sale</v-icon></span>
</v-list-item-avatar>
</v-list-item>
</v-card>
</v-col>


<v-col>
<v-card class="no_print">

<v-list-item four-line>
<v-list-item-content>
<div class="overline mb-4">Last Month Order Income</div>
<v-list-item-title color="pink darken-2" class=" headline mb-1">{{monthly_orders.orders_amount | get_decimal_value | get_comma_seperator}}</v-list-item-title>
<v-list-item-subtitle>
</v-list-item-subtitle>
</v-list-item-content>

<v-list-item-avatar
tile class="primary" size="60">
<span><v-icon class="accent--text">mdi-sale</v-icon></span>
</v-list-item-avatar>
</v-list-item>
</v-card>
</v-col>

</v-row>
<v-row>
<v-col cols="9">
    <RecentOrder />
</v-col>
<v-col cols="3">
<v-row>

<!-- <v-col>
<v-card class="no_print">

<v-list-item>
<v-list-item-content>
<div class="overline mb-4">Total Sales</div>
<v-list-item-title color="pink darken-2" class=" headline mb-1">{{products}} </v-list-item-title>
<v-list-item-subtitle>
</v-list-item-subtitle>
</v-list-item-content>
<v-list-item-avatar
tile class="primary" size="60">
<span><v-icon class="accent--text"> mdi-currency-usd </v-icon> </span>
</v-list-item-avatar>
</v-list-item>
</v-card>

</v-col> -->

<v-col>
<v-card class="no_print">

<v-list-item>
<v-list-item-content>
<div class="overline mb-4">Total Products</div>
<v-list-item-title color="pink darken-2" class=" headline mb-1">{{products}}</v-list-item-title>
<v-list-item-subtitle>
</v-list-item-subtitle>
</v-list-item-content>
<v-list-item-avatar
tile class="primary" size="60">
<span><v-icon class="accent--text">mdi-nutrition</v-icon></span>
</v-list-item-avatar>
</v-list-item>
</v-card>

</v-col>

</v-row>
<v-row>
<v-col>
<v-card class="no_print">

<v-list-item>
<v-list-item-content>
<div class="overline mb-4">Total Customers</div>
<v-list-item-title color="pink darken-2" class=" headline mb-1">{{customers}}</v-list-item-title>
<v-list-item-subtitle>
</v-list-item-subtitle>
</v-list-item-content>
<v-list-item-avatar
tile class="primary" size="60">
<span><v-icon class="accent--text">mdi-account</v-icon></span>
</v-list-item-avatar>
</v-list-item>
</v-card>

</v-col>
</v-row>
<v-row>
<v-col>
<v-card class="no_print">

<v-list-item>
<v-list-item-content>
<div class="overline mb-4">Total Orders</div>
<v-list-item-title color="pink darken-2" class=" headline mb-1">{{orders}} </v-list-item-title>
<v-list-item-subtitle>
</v-list-item-subtitle>
</v-list-item-content>
<v-list-item-avatar
tile class="primary" size="60">
<span><v-icon class="accent--text">mdi-package-variant</v-icon></span>
</v-list-item-avatar>
</v-list-item>
</v-card>

</v-col>


</v-row>
<v-row>

<!-- <v-col cols="6">
<v-card class="no_print">

    <v-toolbar flat class="title">Driver A's order (Today)
    </v-toolbar>
<template>
  <v-data-table
    :headers="test_headers"
    :items="order_by_driver"
    hide-default-footer
    class="elevation-1"
  ></v-data-table>
</template>

</v-card>

</v-col> -->

<!-- <v-col cols="6">
    <v-card class="no_print">

    <v-toolbar flat class="title">Driver B's order (Today)
    </v-toolbar>
    <template>
    <v-data-table
    :headers="test_headers"
    :items="order_by_driver"
    hide-default-footer
    class="elevation-1"
    ></v-data-table>
    </template>

    </v-card>

</v-col> -->

</v-row>
<v-row>



</v-row>
</v-col>
</v-row>
</div>
</template>

<script>

import RecentOrder from '../components/Order/Recent_Order';
// import OrderByDriver from '../components/Order/OrderByDriver';

export default{
components : {
    RecentOrder,
    // OrderByDriver
},

data(){
return {
 test_headers: [
          {
            text: 'Customer',
            align: 'left',
            sortable: false,
            value: 'company_name',
          },
            {
            text: 'Order Total',
            align: 'left',
            sortable: false,
            value: 'order_total',
          },
          
        ],
        order_by_driver: [
          {
          company_name:'francis',
           order_total:'78776.00'
          },
           {
          company_name:'francis',
           order_total:'78776.00'
          },
           {
          company_name:'francis',
           order_total:'78776.00'
          },
           {
          company_name:'francis',
           order_total:'78776.00'
          },
           {
          company_name:'francis',
           order_total:'78776.00'
          },
         
        ],   
orders:'',
products:'',
customers:'',
daily_orders:'',
weekly_orders:'',
monthly_orders:'',
}
},
created () {
this.initialize()
},
filters: {
  get_decimal_value: function (value) {
    if (!value) return ''
    return (Math.round(value * 100) / 100).toFixed(2);
  },
  get_comma_seperator: function (x) {
    if (!x) return ''
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
  

},
methods: {

async initialize () {

const counters = await this.$axios.get('counters');

this.daily_orders = counters.data.daily_orders
this.weekly_orders = counters.data.weekly_orders
this.monthly_orders = counters.data.monthly_orders

this.orders = counters.data.orders;
this.products = counters.data.products;
this.customers = counters.data.customers;



},
}
}
</script>