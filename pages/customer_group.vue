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
    :items="customer_categories"
    :search="search"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="">
        <v-toolbar-title>Customer Grouping</v-toolbar-title>
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
            <v-btn color="primary" class="mb-2 accent--text" v-on="on">Add Customer Group</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col>
                    <v-text-field v-model="editedItem.customer_category_name" label="Name"></v-text-field>
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
  </v-data-table>
  </v-app>
</template>
<script>
  export default {
   
    data: () => ({
      search:'',
      snackbar:false,
      dialog: false,
      headers: [
        {
          text: 'id',
          align: 'left',
          sortable: false,
          value: 'id',
        },
         {
          text: 'Group Name',
          align: 'left',
          sortable: false,
          value: 'customer_category_name',
        },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      editedIndex: -1,
      editedItem: {
        customer_category_name: '',
       
      },
      defaultItem: {
        customer_category_name: '',
      
      },
      response : {
        msg:''
      },
      customer_categories:[],
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
  
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },

    async created () {
     const customer_categories = await this.$axios.get('customer_group');
     this.customer_categories = customer_categories.data;
            
    },

    methods: {

      editItem (item) {
          this.editedIndex = this.customer_categories.indexOf(item)
          this.editedItem = Object.assign({}, item)
          this.dialog = true
          
      },

      deleteItem (item) {
        confirm('Are you sure you want to delete this item?') && 
         this.$axios.delete('customer_group/'+item.id)
            .then((res) => {
            
              if(res.data.response_status){ 

              const index = this.customer_categories.indexOf(item)
              this.customer_categories.splice(index, 1)
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
           if (this.editedIndex > -1) {

            this.$axios.put('customer_group/' + this.editedItem.id, {
            customer_category_name: this.editedItem.customer_category_name
            })
            .then(res => {
//              console.log(res.data);
            if(res.data.response_status){ 
            const index = this.customer_categories.findIndex(item => item.id == this.editedItem.id)
            this.customer_categories.splice(index, 1,{
            id:this.editedItem.id,
            customer_category_name:this.editedItem.customer_category_name
            });
              this.snackbar = res.data.response_status;
              this.response.msg = res.data.message;
              this.close()
              }
            })
            .catch(error => console.log(err));
           }
           else{
              
            this.$axios.post('customer_group',{customer_category_name:this.editedItem.customer_category_name})
              .then((res) => {

              if(res.data.response_status){ 

              this.customer_categories.push(res.data.new_record)
              this.snackbar = res.data.response_status;
              this.response.msg = res.data.message;

              this.close()
              
              }

            });
         
           }

        
      },
    },
  }
</script>