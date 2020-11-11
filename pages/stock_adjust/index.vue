<template>
<v-app>
  <div class="text-center ma-2">

    <v-snackbar
      v-model="snackbar"
      :top="'top'"
      :color="err"
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
    :items="stock_adj"
    :search="search"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="">
        <v-toolbar-title>Stock Adjustment</v-toolbar-title>
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
            <v-btn color="primary"  class="mb-2 accent--text" v-on="on">Adjust Stock</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  
                  <v-col>
                    <v-select
                    class="mb-2"
                    v-model="editedItem.product"
                    :items="products"
                    item-value="id"
                    :item-text="item => item.id +' - '+ item.product_title"
                    label="Products"
                    ></v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                  <v-col>
                    <v-text-field type="number" v-model="editedItem.qty" label="Quantity"></v-text-field>
                  </v-col>
                  </v-row>
                  <v-row>
                  <v-col>
                    <v-select
                    v-model="editedItem.reason"
                    :items="reasons"
                    item-value="id"
                    item-text="reason" 
                    label="Reason"
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
  </v-data-table>  
  
  </v-app>
</template>
<script>

  export default {

    data: () => ({

      reasons :[
        {id:1,reason:'stolen'},
        {id:2,reason:'misplaced'},
        {id:3,reason:'damaged'},
      ],
      search:'',
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
          text: 'Product ID',
          align: 'left',
          sortable: false,
          value: 'product_id',
        },  
         {
          text: 'Product',
          align: 'left',
          sortable: false,
          value: 'product_title',
        },        
         {
          text: 'Quantity',
          align: 'left',
          sortable: false,
          value: 'quantity',
        },
         {
          text: 'Reason',
          align: 'left',
          sortable: false,
          value: 'reason',
        },
         {
          text: 'Created At',
          align: 'left',
          sortable: false,
          value: 'created_at',
        },
        // { text: 'Actions', value: 'action', sortable: false },
      ],
      editedIndex: -1,
      editedItem: {
        product: '',
        qty: '',
        reason: '',       
      },
      defaultItem: {
        product: '',
        qty: '',
        reason: '',      
      },
      response : {
        msg:''
      },
      err:'',
      stock_adj:[],
      products:[]
    }),

    computed: {
     
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
      // stock_adj(){
        
      //   return this.$store.state.stock_adj

      // }
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },

    async created () {

     
     const stock_adj = await this.$axios.get('stock_adjustment');
     this.stock_adj = stock_adj.data;

      const products = await this.$axios.get('product');
      this.products = products.data;
            
    },

    methods: {
      editItem (item) {
          this.editedIndex = this.stock_adj.indexOf(item)
          this.editedItem = Object.assign({}, item)
          this.dialog = true
          
      },

      deleteItem (item) {
        confirm('Are you sure you want to delete this item?') && 
         this.$axios.delete('stock_adjustment/'+item.id)
            .then((res) => {

              if(res.data.response_status){ 

              const index = this.stock_adj.indexOf(item)
              this.stock_adj.splice(index, 1)
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
        let payload = {
           product_id: this.editedItem.product,
            quantity: this.editedItem.qty,
            reason: this.editedItem.reason,
        };
           if (this.editedIndex > -1) {

            this.$axios.put('stock_adjustment/' + this.editedItem.id,payload)
            .then(res => {
              console.log(res.data);
              // if(res.data.response_status){ 
              // const index = this.stock_adj.findIndex(item => item.id == this.editedItem.id)
              // console.log(res.data);
              // this.snackbar = res.data.response_status;
              // this.response.msg = res.data.message;
              // this.close()
              // }
            })
            .catch(error => console.log(err));
           }
           else{
              
            this.$axios.post('stock_adjustment',payload)
              .then((res) => {

                this.snackbar = true;

              if(res.data.response_status){ 

                this.err = ''

              this.stock_adj.push(res.data.new_record[0])
            
              this.response.msg = res.data.message;

            
              
              }
              else{

                 this.err = 'error'
                 this.response.msg = 'You cannot add quntity in stock adjustmnet'

              }

                this.close()

            });
         
           }

        
      },
    },
  }
</script>