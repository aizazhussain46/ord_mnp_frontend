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
    :items="states"
    :search="search"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="">
        <v-toolbar-title>States</v-toolbar-title>
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
            <v-btn color="primary"  class="mb-2" v-on="on">New Item</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col>
                    <v-text-field v-model="editedItem.state_name" label="State"></v-text-field>
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
          text: 'state',
          align: 'left',
          sortable: false,
          value: 'state_name',
        },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      editedIndex: -1,
      editedItem: {
        state_name: '',
       
      },
      defaultItem: {
        state_name: '',
      
      },
      response : {
        msg:''
      },
      states:[],
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
     const states = await this.$axios.get('state');
     this.states = states.data;
            
    },

    methods: {

      editItem (item) {
          this.editedIndex = this.states.indexOf(item)
          this.editedItem = Object.assign({}, item)
          this.dialog = true
          
      },

      deleteItem (item) {
        confirm('Are you sure you want to delete this item?') && 
         this.$axios.delete('state/'+item.id)
            .then((res) => {

              if(res.data.response_status){ 

              const index = this.states.indexOf(item)
              this.states.splice(index, 1)
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

            this.$axios.put('state/' + this.editedItem.id, {
            state_name: this.editedItem.state_name
            })
            .then(res => {
              if(res.data.response_status){ 
            const index = this.states.findIndex(item => item.id == this.editedItem.id)
            this.states.splice(index, 1,{
            id:this.editedItem.id,
            state_name:this.editedItem.state_name
            });
              this.snackbar = res.data.response_status;
              this.response.msg = res.data.message;
              this.close()
              }
            })
            .catch(error => console.log(err));
           }
           else{
              
            this.$axios.post('state',{state_name:this.editedItem.state_name})
              .then((res) => {

              if(res.data.response_status){ 

              this.states.push(res.data.new_record)
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