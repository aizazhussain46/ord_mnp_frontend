<template>
<v-app>


<div class="text-center ma-2">

<v-snackbar
v-model="snackbar"
:top="'top'"
>
{{response.msg}}
<v-btn      
text
@click="snackbar = false"
>
Close
</v-btn>
</v-snackbar>
</div>
<v-data-table
:headers="headers"
:items="customers"
:search="search"
class="elevation-1"
>
<template v-slot:top>
<v-toolbar flat color="">
<v-toolbar-title dark>Maintenance Users</v-toolbar-title>
<v-divider
class="mx-4"
inset
vertical
></v-divider>



<v-text-field
v-model="search"
label="Search"
single-line
hide-details
></v-text-field>
<v-divider
class="mx-4"
inset
vertical
></v-divider>

<v-dialog v-model="dialog" max-width="1200px">
<template v-slot:activator="{ on }">
<v-btn color="primary" to="maintenance/create" class="accent--text mb-2">Add Maintenance User</v-btn>
</template>
<v-card>
<!-- <v-card-title>

<span class="headline">{{ formTitle }}</span> -->

<!-- <v-row>
<v-spacer></v-spacer>
<v-col cols="4"></v-col>
<v-col cols="4">
<v-text-field :readonly="isReadOnly"  v-model="editedItem.pwd" label="Password"></v-text-field>
</v-col>
<v-col>
<v-btn v-if="!isReadOnly" class="primary accent--text mt-3" text @click="save">Update Password</v-btn>
</v-col>
</v-row> -->


<!-- </v-card-title> -->
<v-card-title>
<v-icon small :color="editedItem.IsActive ? 'success' : 'error' ">mdi-checkbox-blank-circle</v-icon>
&nbsp;{{editedItem.IsActive ? 'Active' : 'Inactive'}}
<v-spacer></v-spacer>
</v-card-title>

<v-card-text>
<v-container>
<v-row>
<v-col>
<v-text-field :readonly="isReadOnly" :rules="Rules" v-model="editedItem.name" label="Name"></v-text-field>
</v-col>
<v-col>
<v-text-field :readonly="isReadOnly" :rules="Rules"  v-model="editedItem.email" label="Email"></v-text-field>
</v-col> 
</v-row>

<v-row>
<v-col>
<v-text-field :rules="Rules" v-model="editedItem.phone_number" label="Phone Number"></v-text-field>
</v-col>
<v-col>
<v-text-field :rules="Rules" v-model="editedItem.mobile_number" label="Mobile Number"></v-text-field>
</v-col>
</v-row>
<v-row>
<v-col>
<v-text-field :rules="Rules" v-model="editedItem.address" label="Address"></v-text-field>
</v-col>
<v-col>
<v-select
v-if="!isReadOnly"
:rules="Rules"
v-model="editedItem.state_id" 
:items="states"
@change="get_cities_by_id"
item-value="id"
item-text="state_name" 
label="State"
></v-select>
<v-text-field v-else :readonly="isReadOnly"  v-model="editedItem.state_name" label="State"></v-text-field>

</v-col>
<v-col>
<v-select 
v-if="!isReadOnly"
:rules="Rules"
v-model="editedItem.cities_by_state_id" 
:items="cities_by_state"
item-value="c_id"
item-text="c_name" 
label="City"
></v-select>

<v-text-field v-else :readonly="isReadOnly"  v-model="editedItem.city_name" label="City"></v-text-field>

</v-col>
</v-row>

<v-row v-if="!isReadOnly">
<v-col>
<v-checkbox
color="primary"
v-model="editedItem.IsActive"
label="Is Active"
></v-checkbox>
</v-col>
</v-row>

<v-row>

  <v-spacer></v-spacer>

  <v-btn class="primary accent--text" text @click="close">Cancel</v-btn>
  &nbsp;
  <v-btn v-if="!isReadOnly" class="primary accent--text" text @click="save">Save</v-btn>
</v-row>

<v-row v-if="!isReadOnly">
<v-col cols="4">
<v-text-field type="password" v-model="editedItem.pwd" label="Password"></v-text-field>
</v-col>

</v-row>

<v-row v-if="!isReadOnly">
<v-col>
<v-btn class="error" text @click="update_password">Update Password</v-btn>
</v-col>
</v-row>
</v-container>
</v-card-text>

</v-card>
</v-dialog>


</v-toolbar>
</template>
<template v-slot:item.action="{ item }">
<v-icon
small
class="mr-2"
@click="viewItem(item)"
>
mdi-eye
</v-icon>
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

</v-data-table>
</v-app>
</template>
<script>
export default {
// async fetch({store}){
// await store.dispatch('getRoles')
// await store.dispatch('getcustomers')       
// },
data: () => ({

snackbar:false,
action:'',
search:'',
dialog: false,
headers: [
{
text: 'Name',
align: 'left',
sortable: false,
value: 'name',
},
{
text: 'Email',
align: 'left',
sortable: false,
value: 'email',
},
{
text: 'Mobile Number',
align: 'left',
sortable: false,
value: 'mobile_number',
},
{
text: 'Address',
align: 'left',
sortable: false,
value: 'address',
},
{ text: 'Actions', value: 'action', sortable: false },
],
emailRules: [
v => /.+@.+/.test(v) || 'E-mail must be valid',
],
msg:"",
errors:[
{password:''},
{email:''}
],

snackbar:false,
Rules : [
v => !!v || 'This field is required',
],

editedIndex: -1,
editedItem: {
customer_category_name:'',
customer_category_id:'',
name: '',
email: '',
password:'',
ntn:'',
group:'',
phone_number:'',
mobile_number:'',
address:'',
state_id:'',
state_name:'',
city_id:'',
city_name:'',
IsActive:'',
},
defaultItem: {
customer_category_name:'',
customer_category_id:'',
name: '',
email:'',
password:'', 
ntn:'',    
group:'',
phone_number:'',
mobile_number:'',
address:'',
state_id:'',
state_name:'',
city_id:'',
city_name:'', 
IsActive:'',
},
response : {
msg:''
},
customers:[],
customer_categories:[],
states:[],
cities_by_state:[],
cities_by_state_id:'',
cities_by_state_name:'',


}),

computed: {
isReadOnly(){
    return this.action == 'View Item'
},
formTitle () {
return (this.action) ? this.action :this.editedIndex === -1 ? 'New Item' : 'Edit Item'
},
// roles(){
//   return this.$store.state.roles
//   },
// customers(){
//     return this.$store.state.customers
// }


},

watch: {
dialog (val) {
val || this.close()
},
},

created () {
this.initialize()

},

methods: {


get_cities_by_id(){
this.$axios.get('state/'+this.editedItem.state_id).then((res) => this.cities_by_state = res.data);
},

async initialize () {

const customers = await this.$axios.get('maintenance');
this.customers = customers.data;

const states = await this.$axios.get('state');
this.states = states.data;


},

editItem (item) {
this.editedIndex = this.customers.indexOf(item)
this.editedItem = Object.assign({}, item)
this.dialog = true
this.action = 'Edit Item';
},

viewItem (item) {
this.editedIndex = this.customers.indexOf(item)
this.editedItem = Object.assign({}, item)
this.dialog = true
this.action = 'View Item';
},


deleteItem (item) {
confirm('Are you sure you want to delete this item?') &&
this.$axios.delete('maintenance/'+item.id)
.then((res) => {
if(res.data.response_status){
const index = this.customers.indexOf(item)
this.customers.splice(index, 1)
this.snackbar = res.data.response_status;
this.response.msg = res.data.message;

}
});
},

close () {
this.dialog = false
setTimeout(() => {
this.editedItem = Object.assign({}, this.defaultItem)
this.editedIndex = -1
}, 300)
},

update_password () {
this.$axios.post('update_password/' + this.editedItem.id, {pwd:this.editedItem.pwd})
  .then(res =>{
      this.snackbar = res.data.response_status;
      this.response.msg = res.data.message;
      this.close()
  }).catch(error => console.log(err));
},
save () {
const payload = {
name:this.editedItem.name,
email:this.editedItem.email,
// password:this.editedItem.password,
customer_category_id:this.editedItem.customer_category_id,
ntn:this.editedItem.ntn,
phone_number:this.editedItem.phone_number,
mobile_number:this.editedItem.mobile_number,
address:this.editedItem.address,
state_id:this.editedItem.state_id,
cities_by_state_id:(this.editedItem.cities_by_state_id) ? this.editedItem.cities_by_state_id : this.editedItem.city_id,
IsActive:this.editedItem.IsActive ? 1 : 0,
};


this.$axios.put('maintenance/' + this.editedItem.id,payload)
.then(res => {
if(res.data.response_status){
const index = this.customers.findIndex(item => item.id == this.editedItem.id)
this.customers.splice(index, 1, res.data.updated_record);
this.snackbar = res.data.response_status;
this.response.msg = res.data.message;
this.close()
}
else{


  if(res.data.errors){
      this.snackbar = true;
      this.response.msg = res.data.message;
  }
  else{
      this.errors = res.data.errors;
  }

}
})
.catch(error => console.log(err));

},
},
}
</script>