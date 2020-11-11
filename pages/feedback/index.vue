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
    :items="data"
    :search="search"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="">
        <v-toolbar-title>Feedbacks</v-toolbar-title>
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
      
      </v-toolbar>
    </template>
    <template v-slot:item.action="{ item }">
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
  
    data: () => ({
      slug:'feedback',  
      search:'',
      snackbar:false,
      dialog: false,
      headers: [
        {
          text: '#',
          align: 'left',
          sortable: false,
          value: 'feedback_id',
        },
         {
          text: 'Feedback',
          align: 'left',
          sortable: false,
          value: 'feedback',
        },
         {
          text: 'Customer',
          align: 'left',
          sortable: false,
          value: 'company_name',
        },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      editedIndex: -1,
      editedItem: {
        id:'',  
        feedback: '',
       
      },
      defaultItem: {
        id:'',
        feedback: '',
      
      },
      response : {
        msg:''
      },
      data:[]
    }),

    computed: { },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },

    async created () {
     const data = await this.$axios.get(this.slug);
     this.data = data.data;
            
    },

    methods: {

      deleteItem (item) {
        confirm('Are you sure you want to delete this item?') && 
         this.$axios.delete(this.slug + '/' + item.feedback_id)
            .then((res) => {
              if(res.data.response_status){ 

              const index = this.data.indexOf(item)
              this.data.splice(index, 1)
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

      
    },
  }
</script>