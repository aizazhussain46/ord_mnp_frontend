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
:items="requests"
:search="search"
class="elevation-1"
:items-per-page=10
:footer-props="{
    itemsPerPageOptions:[5,10,15]
}"
>
<template  v-slot:item.keyword="{ item }">
<v-chip small class="accent--text" :class="myBtnClass(item.keyword)">
{{item.keyword | capitalize}}
</v-chip>

</template>


<template v-slot:top>
<v-toolbar flat color="">
<v-toolbar-title dark>Requests</v-toolbar-title>
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
<!-- <template v-slot:activator="{ on }">
<v-btn color="primary" to="order/create" class="accent--text mb-2">New Item</v-btn>
</template> -->
<v-card>
<!-- <v-card-title>

<span class="headline">{{ formTitle }}</span> -->




<v-card-text>
<v-container>
<v-row>
<v-col>
<v-toolbar
class="primary mb-2 accent--text"
dark
flat
>
<v-toolbar-title>{{ editedItem.company_name }}</v-toolbar-title>
</v-toolbar>
</v-col>


</v-row>


  <v-row>

     <v-col>
        
    <v-img
    v-if="editedItem.image"
    :src="editedItem.image"
    aspect-ratio="1"
    class="grey lighten-2"
    max-width="300"
    max-height="300"
    ></v-img>
    </v-col>

  </v-row>
  <v-row>
          <v-col>{{editedItem.message}}</v-col>
  </v-row>

<v-row>
    
<v-col cols="6">
<v-select
v-model="editedItem.status_id"
:items="statusses"
item-value="id"
item-text="status" 
label="Statusses"
></v-select>
</v-col>
<v-col cols="6">
      <v-menu
          
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        :return-value.sync="date"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="date"
            label="Schedule Date"
            readonly
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker color="primary accent--text" v-model="date" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
          <v-btn text color="primary" @click="$refs.menu.save(date)">OK</v-btn>
        </v-date-picker>
      </v-menu>
    </v-col>
    </v-row>
    <v-row>
<v-col>
<v-btn class="primary accent--text" text @click="close">Cancel</v-btn>
&nbsp;
<v-btn class="primary accent--text" text @click="save">Save</v-btn>
</v-col>

</v-row>

</v-container>
</v-card-text>

</v-card>
</v-dialog>


</v-toolbar>
</template>
<template v-slot:item.action="{ item }">
<!-- <v-icon
small
class="mr-2"
@click="viewItem(item)"
>
mdi-eye
</v-icon>
 -->
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
mdi-close-circle
</v-icon>
</template>


</v-data-table>
</v-app>
</template>
<script>
export default {

data: () => ({
date: new Date().toISOString().substr(0, 10),
menu: false,

snackbar:false,
action:'',
search:'',
dialog: false,
headers: [

{
text: '#',
align: 'left',
value: 'id',
},

{
text: 'Customer Name',
align: 'left',
sortable: false,
value: 'company_name',
},
{
text: 'Status',
align: 'left',
sortable: false,
value: 'keyword',
},
{
text: 'Scheduled Date',
align: 'left',
sortable: false,
value: 'schedule',
},
{
text: 'Submitted At',
align: 'left',
sortable: false,
value: 'created_at',
},
{ text: 'Action', value: 'action', sortable: false },

],
msg:"",

snackbar:false,
Rules : [
v => !!v || 'This field is required',
],

statusses: [
    {id:1,status:'Open'},
    {id:2,status:'Scheduled'},
    {id:5,status:'Repaired'}
],
editedIndex: -1,
editedItem: {
    id:'',
    status_id:'',
},
defaultItem: {
    id:'',
    status_id:'',
},
response : {
msg:''
},
requests:[],

}),

computed: {

isReadOnly(){
return this.action == 'View Item'
},
formTitle () {
return (this.action) ? this.action :this.editedIndex === -1 ? 'New Item' : 'Edit Item'
},

},

watch: {
dialog (val) {
val || this.close()
},
},

created () {
this.initialize()
this.myBtnClass()

},  

filters: {
  capitalize (v) {
     return v.charAt(0).toUpperCase() + v.slice(1)
  }
},
methods: {
     
myBtnClass(name) {
  switch(name) {

  case 'open':
      return 'warning darken-3'
  case 'scheduled':
      return 'green lighten-1'
  case 'repaired':
      return 'blue lighten-1'
  default:
      return 'error'
  
}
    
}, 
    
async initialize () {

const requests = await this.$axios.get('maintenanceuser');

this.requests = requests.data;

console.log(requests.data);

// const statusses = await this.$axios.get('status');
// this.statusses = statusses.data;


},

editItem (item) {

this.editedIndex = this.requests.indexOf(item)
this.editedItem = Object.assign({}, item)
this.dialog = true
this.action = 'Edit Item';
},

// viewItem (item) {
// this.editedIndex = this.requests.indexOf(item)
// this.editedItem = Object.assign({}, item)
// this.dialog = true
// this.action = 'View Item';
// },


deleteItem (item) {
    
const payload = {
request_id : item.id,
status_id : 7
};

confirm('Are you sure you want to delete this item?') &&
this.$axios.post('request_status_change',payload)
.then((res) => {
if(res.data.response_status){
const index = this.requests.indexOf(item)
this.requests.splice(index, 1)
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
save () {


const payload = {
request_id : this.editedItem.id,
status_id : this.editedItem.status_id,
scheduling: this.date
};

this.$axios.post('request_status_change',payload)
.then(res => {
 console.log(res.data.updated_record);   
 Object.assign(this.requests[this.editedIndex],res.data.updated_record);
 this.snackbar = res.data.response_status;
this.response.msg = res.data.message;
this.close()

})
.catch(error => console.log(error));

},
},
}
</script>