<template>
<v-app>

<v-snackbar
v-model="snackbar"
:top="'top'"
>
{{msg}}
<v-btn      
text
@click="snackbar = false"
>
Close
</v-btn>
</v-snackbar>

<v-card>

<v-toolbar flat dark>
<v-toolbar-title class="headline">Create</v-toolbar-title>
</v-toolbar>
<v-container>

<v-form ref="form" lazy-validation>
<v-row>
<v-col>
<v-text-field :rules="Rules"  v-model="discount_title" label="Discount Name"></v-text-field>
</v-col>
<v-col>
<v-select
:rules="Rules" 
v-model="discount_type" 
:items="['percentage','amount']"
label="Discount Type"
></v-select>
</v-col>
</v-row>

<v-row>
  <v-col>
<v-text-field readonly v-model="ccn" label="Customer Group"></v-text-field>
</v-col>
<v-col>
<v-select
v-model="customer_category_id" 
:items="cat_to_upload"
item-value="id"
item-text="customer_category_name" 
label="Change Customer Group"
></v-select>
</v-col>

</v-row>

<v-row v-for="(input,index) in inputs" :key="index">
<v-col dense>
<v-select
:rules="Rules" 
v-model="input.product_id" 
:items="products"
item-value="id"
item-text="product_title" 
label="Products"
></v-select>
</v-col>

<v-col>
<v-text-field :rules="amountRules"  type="number" v-model.number="input.amount" label="Discount Amount"></v-text-field>
</v-col>
<v-col cols="1">
<v-icon class="py-5 px-5 red--text"   @click="deleteRow(index)">mdi-delete</v-icon>
</v-col>
</v-row>
<v-row>
<v-col>
<v-btn color="primary" small @click="add_item">+ Add Product</v-btn>    
</v-col>   
</v-row>    

</v-form>
<v-card-actions>
<v-spacer></v-spacer>
<v-btn v-if="inputs.length"  class="primary darken-1" text @click="save">Save</v-btn>
</v-card-actions>
  
</v-container>
</v-card>
</v-app>
</template>


<script>

export default {
async created () {

const discount_by_id = await this.$axios.get(`discount/${this.$route.params.id}`);

this.inputs = discount_by_id.data.products;
this.discount_title = discount_by_id.data.discount_title;
this.discount_type = discount_by_id.data.discount_type;

this.ccn = discount_by_id.data.customer_category_name;
this.cci = discount_by_id.data.customer_category_id;

const customer_categories = await this.$axios.get('customer_group');
this.cat_to_upload = customer_categories.data;

const product = await this.$axios.get('product');
this.products = product.data;


},
data:() => ({
cci:'',
ccn:'',  
inputs: [{
product_id: '',
amount: 0,
}],    
discount_title: '',
discount_amount:'',
discount_type:'',
customer_category_id:'',  
cat_to_upload:[],
products:[],
discount_by_id:[],
msg:'',
snackbar:false,
Rules : [
v => !!v || 'This field is required',
],
amountRules : [
 v => (v > 0 && v <= 70) || 'Amount should be in range of 1 to 70',
],
}),
computed:{
 
},
methods:{
deleteRow(index) {
this.inputs.splice(index,1)
},
add_item(){
this.inputs.push({
item: '',
amount: 0
});
},

save () {

const payload = {
  discount_title: this.discount_title,
  discount_type: this.discount_type,
  customer_category_id: (!this.customer_category_id) ? this.cci : this.customer_category_id,
  products:this.inputs          
}

if(this.$refs.form.validate()){              
this.$axios.put(`discount/${this.$route.params.id}`,payload)
.then((res) => {

if(res.data.response_status){ 

setTimeout(() => {
  this.$router.push('/discount');
},1000);

}
else{
this.msg = res.data.errors;
}


});

}


},

}

}
</script>