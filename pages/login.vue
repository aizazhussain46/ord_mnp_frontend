<template>
<v-app>
   <v-snackbar
      v-model="snackbar"
      :top="'top'"
      color="red"
    >
      {{msg}}
      <v-btn      
        text
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
<v-content>
<v-container
class="fill-height"
>
<v-row
justify="center"
>
<v-col
cols="12"
sm="8"
md="6"
>
<v-card class="elevation-12">
     
<v-toolbar color="#212121" dark flat>
<v-toolbar-title class="white--text">Login form</v-toolbar-title>
</v-toolbar>
<v-card-text>
<v-form ref="form" method="post">

<v-text-field
v-model="email"
label="E-mail"
required
></v-text-field>

<v-text-field
v-model="password"
type="password"
label="Password"
required
></v-text-field>

<!-- <div class="red--text">{{msg}}</div> -->

</v-form>
</v-card-text>
<v-card-actions>
<v-spacer />
<v-btn dark :loading="loading" @click="login">Login</v-btn>
</v-card-actions>
</v-card>
</v-col>
</v-row>
</v-container>
</v-content>
</v-app>
</template>

<script>


export default {
layout:'login',
data:() => ({
loading:false,    
snackbar:false,    
email:'',
password:'',          
msg:''
}),
methods:{

login () {
this.loading = true

let credentials = {
email: this.email,
password: this.password
};
this.$auth.loginWith('local',{ data:credentials })
.catch((e) => {
    this.snackbar = true
    this.msg = e.response.data.error 
    setTimeout(() => {
        this.loading = false
        location.reload();
    },3000);
})


}



}

}
</script>