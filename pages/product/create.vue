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

<v-form ref="form" lazy-validation>
  <v-toolbar flat dark>
<v-toolbar-title class="headline">Create</v-toolbar-title>
<v-spacer></v-spacer>
<v-btn
color="primary"
class="mr-4 accent--text"
@click="save"
>
Submit
</v-btn>
</v-toolbar>

<v-card-text>
<v-container>

<v-row>
<v-col>
<v-text-field :rules="Rules" v-model="product_title" label="Product Title"></v-text-field>
</v-col>
<v-col>
<v-text-field :rules="Rules" v-model="legacy_code_sku" label="SKU CODE"></v-text-field>
</v-col>
</v-row>

<v-row>
<v-col>
<v-text-field :rules="Rules" v-model="group_code" label="Group Code"></v-text-field>
</v-col>
<v-col>
<v-text-field v-model="group_description" label="Group Description"></v-text-field>
</v-col>
</v-row>

<v-row>
<v-col>
<v-text-field :rules="Rules" v-model="pack_code" label="Pack Code"></v-text-field>
</v-col>
<v-col>
<v-text-field v-model="pack_description" label="Pack Description"></v-text-field>
</v-col>
</v-row>

<v-row>

<v-col>
<v-text-field type="number" :rules="Rules"  v-model="product_price" label="Product Price"></v-text-field>
</v-col>
<!-- <v-col>
<v-select
:rules="Rules"
v-model="product_category_id" 
:items="categories"
item-value="id"
item-text="category" 
label="Product Category"
></v-select>
</v-col> -->
 <v-col>
        <v-menu
          ref="menu1"
          v-model="menu1"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
         
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="expiry_date"
              readonly
              label="Expiry Date"
              hint="MM/DD/YYYY format"
              persistent-hint
              @blur="date = parseDate(expiry_date)"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker  color="primary accent--text" v-model="date" no-title @input="menu1 = false"></v-date-picker>
        </v-menu>
      </v-col>

</v-row>

<v-row>
<v-col>
<!-- <v-select
:rules="Rules"
v-model="unit_of_measurement" 
:items="uoms"
item-value="uom"
item-text="uom" 
label="Unit of Measurement"
></v-select> -->
<v-text-field v-model="unit_of_measurement" label="Unit Of Measurement"></v-text-field>
</v-col>

<v-col>
<v-text-field type="number" v-model="unit_in_case" label="Unit in Case"></v-text-field>
</v-col>
<v-col>
<v-text-field type="number" v-model="weight" label="Value"></v-text-field>
</v-col>
</v-row>


<v-row>
<v-col>
<v-textarea  v-model="product_description" label="Production Description"></v-textarea>
</v-col>
</v-row>

<v-row>
<v-col>
<v-checkbox
color="primary"
v-model="IsActive"
label="Is Active"
></v-checkbox>
</v-col>
</v-row>

<v-row>
<v-col>
    <v-btn :rules="Rules" class="primary accent--text" @click="onPick_soi_attachment">{{(!product_image.name) ? 'Upload Product Image' : product_image.name}}
    <v-icon right dark>mdi-cloud-upload</v-icon></v-btn>   
    <input required type="file" @change="check_soi_attachment" style="display:none;" accept="image/*" ref="soi_attachmentInput">

</v-col>
</v-row>

</v-container>
</v-card-text>

</v-form>

<template v-slot:item.action="{ item }">
<v-icon
small
class="mr-2"
@click="editItem(item)"
>
mdi-pencil
</v-icon>
<v-icon
small
@click="deleteItem(item)"
>
mdi-delete
</v-icon>
</template>
<template v-slot:no-data>
<!-- <v-btn color="primary" @click="initialize">Reset</v-btn> -->
</template>
</v-card>
</v-app>
</template>


<script>

export default {
  async created () {
     const categories = await this.$axios.get('category');
     this.categories = categories.data;
            
    },
data:(vm) => ({
date: new Date().toISOString().substr(0, 10),
expiry_date: vm.formatDate(new Date().toISOString().substr(0, 10)),
menu1: false,
categories:[],

legacy_code_sku:'',
product_title:'',
product_price:'',
product_image:'',
product_category_id:'',
uoms:[
  {uom:'kg'},
  {uom:'ltr'},
  {uom:'grm'}
],

unit_of_measurement:'',
product_description:'',
unit_in_case:'',
weight:'',
expiry_date:'',
IsActive:'',
group_code:'',
group_description:'',
pack_code:'',
pack_description:'',
msg:"",
snackbar:false,
Rules : [
  v => !!v || 'This field is required',
],

}),
computed:{

   computedexpiry_date () {
        return this.formatDate(this.date)
      },
},
 watch: {
      date (val) {
        this.expiry_date = this.formatDate(this.date)
      },
    },
methods:{

    formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${month}/${day}/${year}`
      },
        parseDate (date) {
        if (!date) return null

        const [month, day, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },

onPick_soi_attachment () { 
this.$refs.soi_attachmentInput.click() 
},

check_soi_attachment(e) { 

this.product_image = e.target.files[0] || ''; 

},

get_cities_by_id(){
    this.$axios.get('state/'+this.state_id).then((res) => this.cities = res.data);
},
save(){
// var payload = {
// legacy_code_sku:this.legacy_code_sku,
// product_title:this.product_title,
// product_price:this.product_price,
// product_image:this.product_image,
// product_category_id:this.product_category_id,
// unit_of_measurement:this.unit_of_measurement,
// product_description:this.product_description,
// unit_in_case:this.unit_in_case,
// weight:this.weight,
// expiry_date:this.expiry_date,
// IsActive:this.IsActive
// };

  let product = new FormData();
  product.append('legacy_code_sku',this.legacy_code_sku);
  product.append('group_code',this.group_code);
  product.append('group_description',this.group_description);
  product.append('pack_code',this.pack_code);
  product.append('pack_description',this.pack_description);
  product.append('product_title',this.product_title); 
  product.append('product_price',this.product_price);
  product.append('product_image',this.product_image);
  product.append('product_category_id',this.product_category_id);
  product.append('unit_of_measurement',this.unit_of_measurement);
  product.append('product_description',this.product_description);
  product.append('unit_in_case',this.unit_in_case);
  product.append('weight',this.weight);
  product.append('expiry_date',this.expiry_date);
  product.append('IsActive',this.IsActive == true ? 1 : 0);
if(this.$refs.form.validate()){

this.$axios.post('product',product).then((res) => {
    
    this.snackbar = res.data.response_status;

    if(res.data.response_status){
        
        this.msg = res.data.message;
        setTimeout(() => {
            this.$router.push('/product');
        },1000);
    }
    else{
        this.errors = res.data.errors;
    }


});

}

},

}

}
</script>