<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      dark
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
      class="no_print"
    >
    <!-- color="#7c5cc4" -->


       <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon class="white--text">{{ item.icon }}</v-icon>
          </v-list-item-action>
           <v-list-item-content>
            <v-list-item-title class="white--text"  v-text="item.title"/>
          </v-list-item-content>
        </v-list-item>
      </v-list>

       
    </v-navigation-drawer>
    <v-app-bar
      class="no_print"
      dark
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon  @click.stop="drawer = !drawer" />
      {{title}}
      <v-spacer />
      <span v-if="this.$auth.user" >
      Welcome, <b>{{this.$auth.user.name}}</b>
      <v-btn text @click="logout">      

        {{logout_btn.label}}
        <v-icon >{{ logout_btn.icon }}</v-icon>
      </v-btn>
     </span>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
   
    <v-footer
      :fixed="fixed"
      app
    >
      <span>&copy; {{year}}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  mounted () {
    
  },
  data () {
    return {
      year: new Date().getFullYear(),
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Home',
          to: '/'
        },
        // {
        //   icon: 'mdi-chart-bubble',
        //   title: 'User',
        //   to: '/user'
        // },
        {
          icon: 'mdi-chart-bubble',
          title: 'Customer',
          to: '/customer'
        },
          {
          icon: 'mdi-chart-bubble',
          title: 'Orders',
          to: '/order'
        },
       
         {
          icon: 'mdi-chart-bubble',
          title: 'SKU',
          to: '/product'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Stock',
          to: '/sku'
        },
         {
          icon: 'mdi-chart-bubble',
          title: 'Stock Adjust',
          to: '/stock_adjust'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Discount',
          to: '/discount'
        },
        {
        icon: 'mdi-chart-bubble',
        title: 'Customer Group List',
        to: '/customer_group'
        },   
         {
          icon: 'mdi-chart-bubble',
          title: 'Driver',
          to: '/driver'
        }, 
        {
          icon: 'mdi-chart-bubble',
          title: 'Coldstorage',
          to: '/coldstorage'
        },
         {
          icon: 'mdi-chart-bubble',
          title: 'Maintenance User',
          to: '/maintenance'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Request',
          to: '/request'
        },

         {
          icon: 'mdi-chart-bubble',
          title: 'Feedback',
          to: '/feedback'
        },
                {
        icon: 'mdi-chart-bubble',
        title: 'Reports',
        to: '/report'
        },

          // {
          //   icon: 'mdi-chart-bubble',
          //   title: 'Role',
          //   to: '/role'
          // },
        //  {
        //   icon: 'mdi-chart-bubble',
        //   title: 'Status',
        //   to: '/status'
        // },
             
        //  {
        //   icon: 'mdi-chart-bubble',
        //   title: 'Category',
        //   to: '/category'
        // },
     
  
       
      ],
      
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'MOVENPICK',
      logout_btn:{
        icon:'mdi-logout',
        label:'Logout'
      }
    }
  },
  methods:{
  async logout() {
    await this.$auth.logout();
  },
  }
}
</script>
<style>
@media print{
    .no_print{
        display: none;
        }
}
</style>
