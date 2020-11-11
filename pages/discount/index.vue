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
<v-row>
<v-col>

<v-data-table
:headers="headers"
:items="discounts"
:search="search"
class="elevation-1"
>

<template  v-slot:item.categories="{ item }">
<v-col style="margin-left:-15px !important;" sm="6">
{{item.categories[0].customer_category_name}}
</v-col>
</template>

<template  v-slot:item.products="{ item }">
<v-col style="margin-left:-15px !important;">
<div v-for="(p,index) in item.products" :key="index">

<v-chip small class="ma-1 accent--text grey">
{{p.product_title}}
</v-chip>

<v-chip small class="ma-1 accent--text primary">
{{p.discount_amount}}
</v-chip>
</div>

</v-col>
</template>


<!-- <template v-slot:item.discount_type="{ item }">
{{item.discount_type == 'percentage' ? '%': item.discount_type}}
</template> -->
<template v-slot:top>
<v-toolbar flat color="">
<v-toolbar-title>Discounts</v-toolbar-title>
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
<v-dialog v-model="dialog" max-width="500px">
<template v-slot:activator="{  }">
<v-btn color="primary" to="/discount/create"  class="mb-2 accent--text">add discount</v-btn>
</template>

</v-dialog>
</v-toolbar>
</template>
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
</v-data-table>
</v-col>

</v-row>

</v-app>
</template>
<script>
export default {
data: () => ({
search:'',
dropdown:'',
snackbar:false,
dialog: false,
headers: [
{
text: '#',
align: 'left',
sortable: false,
value: 'id',
},
{
text: 'Title',
align: 'left',
sortable: false,
value: 'discount_title',
},
{
text: 'Type',
align: 'left',
sortable: false,
value: 'discount_type',
},
{
text: 'Customer Group',
align: 'left',
sortable: false,
value: 'categories',
},
{
text: 'Discount on Product',
align: 'left',
sortable: false,
value: 'products',
},
{ text: 'Actions', value: 'action', sortable: false },
],
editedIndex: -1,

response : {
msg:''
},
discounts:[],
cat_to_upload:[],
products:[],
}),


async created () {
const discounts = await this.$axios.get('discount');
this.discounts = discounts.data;

const customer_categories = await this.$axios.get('customer_group');
this.cat_to_upload = customer_categories.data;

const product = await this.$axios.get('product');
this.products = product.data;

},

methods: {
deleteRow(index) {
this.editedItem.inputs.splice(index,1)
},
editItem (item) {
    this.$router.push(`discount/${item.id}`);
},

deleteItem (item) {
confirm('Are you sure you want to delete this item?') && 
this.$axios.delete('discount/'+item.id)
.then((res) => {
    if(res.data.response_status){ 

    const index = this.discounts.indexOf(item)
    this.discounts.splice(index, 1)
    this.snackbar = res.data.response_status;             
    this.response.msg = res.data.message;

    }
});
},


},
}
</script>