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

<v-form ref="form" lazy-validation>
<v-card-text>
<v-container>

<v-row>
<v-col>
<v-text-field :rules="Rules" v-model="name" label="Name"></v-text-field>
</v-col>
<v-col>
<v-text-field :rules="Rules" type="password" v-model="password" label="Password"></v-text-field>
<span v-if="errors.password" class="error--text">{{errors.password[0]}}</span>
</v-col>
</v-row>
<v-row>
<v-col>
<v-text-field type="number" :rules="Rules" v-model="phone_number" label="Phone Number"></v-text-field>
</v-col>
<v-col>
<v-text-field type="number" :rules="Rules" v-model="mobile_number" label="Mobile Number"></v-text-field>
</v-col>
</v-row>
<v-row>
<v-col>
<v-text-field :rules="Rules" v-model="address" label="Address"></v-text-field>
</v-col>
</v-row>
<v-row>
<v-col>
<v-select
:rules="Rules"
v-model="state_id" 
:items="states"
@change="get_cities_by_id"
item-value="id"
item-text="state_name" 
label="State"
></v-select>
</v-col>
<v-col>
<v-select
:rules="Rules"
v-model="city_id" 
:items="cities"
item-value="c_id"
item-text="c_name" 
label="City"
></v-select>

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
<v-btn
color="primary"
class="mr-4 accent--text"
@click="register"
>
Submit
</v-btn>
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

const states = await this.$axios.get('state');
this.states = states.data;

},
data:() => ({

IsActive:'',

states:[],
cities:[],

name : "",
password :"",
phone_number : "",
mobile_number : "",
address : "",
state_id : "",
city_id : "",
msg:"",
errors:[
{password:''},
],

snackbar:false,
Rules : [
v => !!v || 'This field is required',
],

}),
methods:{

get_cities_by_id(){
this.$axios.get('state/'+this.state_id).then((res) => this.cities = res.data);
},
register(){
var payload = {
name : this.name,
password : this.password,
phone_number : this.phone_number,
mobile_number : this.mobile_number,
address : this.address,
state_id : this.state_id,
city_id : this.city_id,
IsActive:this.IsActive ? 1 : 0 
};


if(this.$refs.form.validate()){

this.$axios.post('driver',payload).then((res) => {
console.log(res.data);
this.snackbar = res.data.response_status;

if(res.data.response_status){

this.msg = res.data.message;
setTimeout(() => {
this.$router.push('/driver');
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