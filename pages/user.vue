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
    :items="users"
    :search="search"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="">
        <v-toolbar-title>Users</v-toolbar-title>
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
            <v-btn color="primary" dark class="mb-2" v-on="on">New Item</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                    <v-text-field v-model="editedItem.name" label="User Name"></v-text-field>

                </v-row>
                <v-row>
                   <v-text-field :rules="(emailRules)" v-model="editedItem.email" label="User Email"></v-text-field>
          
                </v-row>

                 <v-row>
                   <v-text-field type="password" v-model="editedItem.password" label="User Password"></v-text-field>
                </v-row>
                <v-row>

                     <v-select
                     v-model="editedItem.role_id" 
                    :items="roles"
                    item-value="id"
                    item-text="role" 
                    label="User Role"
                    ></v-select>
          
                 
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
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>
  </v-data-table>
</v-app>
</template>
<script>
  export default {
   // async fetch({store}){
      // await store.dispatch('getRoles')
      // await store.dispatch('getUsers')       
   // },
    data: () => ({
     
      snackbar:false,
      search:'',
      dialog: false,
      headers: [
        {
          text: 'User Name',
          align: 'left',
          sortable: false,
          value: 'name',
        },
         {
          text: 'User Email',
          align: 'left',
          sortable: false,
          value: 'email',
        },
         {
          text: 'User role',
          align: 'left',
          sortable: false,
          value: 'role',
        },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      emailRules: [
      v => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
      editedIndex: -1,
      editedItem: {
        role:'',
        role_id:'',
        name: '',
        email: '',
        password:''
      },
      defaultItem: {
        role:'',
        role_id:'',
        name: '',
        email:'',
        password:'',      
      },
       response : {
        msg:''
      },
      roles:[],
      users:[],
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
      // roles(){
      //   return this.$store.state.roles
      //   },
      // users(){
      //     return this.$store.state.users
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

      async initialize () {

          const roles = await this.$axios.get('role');
          this.roles = roles.data;

          const users = await this.$axios.get('user');
          this.users = users.data;


      },

      editItem (item) {
        this.editedIndex = this.users.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        confirm('Are you sure you want to delete this item?') &&
          this.$axios.delete('user/'+item.id)
            .then((res) => {
              if(res.data.response_status){
              const index = this.users.indexOf(item)
              this.users.splice(index, 1)
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
                role_id:this.editedItem.role_id,
                name:this.editedItem.name,
                email:this.editedItem.email,
                password:this.editedItem.password
              };
        if (this.editedIndex > -1) {
            this.$axios.put('user/' + this.editedItem.id,payload)
            .then(res => {
              if(res.data.response_status){
              const index = this.users.findIndex(item => item.id == this.editedItem.id)
              this.users.splice(index, 1, res.data.updated_record);
              this.snackbar = res.data.response_status;
              this.response.msg = res.data.message;
              this.close()
              }
            })
            .catch(error => console.log(err));
          
        } else {
             
             this.$axios.post('user',payload)
              .then((res) => {
              if(res.data.response_status){  
              this.users.push(res.data.new_record)  
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