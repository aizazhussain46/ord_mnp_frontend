<template>
<v-app>
  <div class="text-center ma-2">

    <v-snackbar
      v-model="snackbar"
      :top="'top'"
      :color="error_class"
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
    :items="stocks"
    :search="search"
    class="elevation-1"
  >

 
    <!-- <template v-slot:item.discount_type="{ item }">
      {{item.discount_type == 'percentage' ? '%': item.discount_type}}
    </template> -->
    <template v-slot:top>
      <v-toolbar flat color="">
        <v-toolbar-title>Stocks</v-toolbar-title>
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
          <template v-slot:activator="{ on }">
            <v-btn color="primary"  class="mb-2 accent--text" v-on="on">ADD STOCK</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                 
                   <v-col>
                    <v-text-field type="number" v-model="editedItem.stock" label="Stock"></v-text-field>
                  </v-col>
                 
                 
                  </v-row>
                   <v-row>
                  <v-col>
                  <v-select
                  v-model="editedItem.product_id" 
                  :items="products"
                  :item-text="item => item.id +' - '+ item.product_title"
                  item-value="id"
                  label="Product Name"
                  ></v-select>
                  </v-col>
                   </v-row>
                 </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <!-- <template v-slot:item.action="{ item }">
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
    </template> -->
    <template v-slot:no-data>
      <!-- <v-btn color="primary" @click="initialize">Reset</v-btn> -->
    </template>
  </v-data-table>
  </v-app>
</template>
<script>
  export default {
    // async fetch({store}){
    //     await store.dispatch('getRoles')
    //   },

    data: () => ({
      slug : 'stock',
      error_class:'',
      search:'',
      snackbar:false,
      dialog: false,
      headers: [
        {
          text: 'Stock ID',
          align: 'left',
          value: 'stock_id',
        },
         {
          text: 'Qty',
          align: 'left',
          value: 'stock',
        },
         {
          text: 'Product ID',
          align: 'left',
          value: 'id',
        },
         {
          text: 'Product Sku Code',
          align: 'left',
          value: 'legacy_code_sku',
        },
        {
          text: 'Product Title',
          align: 'left',
          value: 'product_title',
        },
         {
          text: 'Product Expiry',
          align: 'left',
          value: 'expiry_date',
        },
        // { text: 'Actions', value: 'action', sortable: false },
      ],
      editedIndex: -1,
      editedItem: {
        stock: '',
        product_id:'',
       
      },
      defaultItem: {
        stock: '',
        product_id:'',
      
      },
      response : {
        msg:''
      },
      stocks:[],
      products:[],
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
      // stocks(){
        
      //   return this.$store.state.stocks

      // }
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },

    async created () {
     const stocks = await this.$axios.get('stock');
     this.stocks = stocks.data;       
     const products = await this.$axios.get('product');
   
     this.products = products.data;     
    },

    methods: {


      editItem (item) {
          this.editedIndex = this.stocks.indexOf(item)
          this.editedItem = Object.assign({}, item)
          this.dialog = true
          
      },

      deleteItem (item) {
        confirm('Are you sure you want to delete this item?') && 
         this.$axios.delete(this.slug + '/'+item.stock_id)
            .then((res) => {            

              if(res.data.response_status){ 

              const index = this.stocks.indexOf(item)
              this.stocks.splice(index, 1)
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
            stock: this.editedItem.stock,
            product_id : this.editedItem.product_id
           
            }

           if (this.editedIndex > -1) {

            this.$axios.put(this.slug + '/' + this.editedItem.id,payload)
            .then(res => {
              if(res.data.response_status){ 

              const index = this.stocks.findIndex(item => item.id == this.editedItem.id)
              Object.assign(this.stocks[index],res.data.updated_record);
              this.error_class = '';
              this.snackbar = res.data.response_status;
              this.response.msg = res.data.message;
              this.close()
              }
            
            })
            .catch(error => console.log(error));
           }
           else{
              
            this.$axios.post(this.slug,payload)
              .then((res) => {

              if(res.data.response_status){ 

              this.stocks.unshift(res.data.new_record)
              this.error_class = '';
              this.snackbar = res.data.response_status = true;
              this.response.msg = res.data.message;

              this.close()
              
              }
              else{
              this.snackbar = res.data.response_status = true;
              this.response.msg = res.data.message;
              this.error_class = 'error';
              }
             

            });
         
           }

        
      },
    },
  }
</script>