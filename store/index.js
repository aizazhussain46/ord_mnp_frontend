export const state = () => ({
    users:[],
}) 

export const mutations = {

    // User

    USERS (state,payload) {
        state.users = payload
      },
  
      ADD_USER (state,payload) {
        state.users.push(payload)
    },
      
      UPDATE_USER (state,payload) {
         
          const index = state.users.findIndex(item => item.id == payload.id)
          state.users.splice(index, 1,{
              id:payload.id,
              role_id:payload.role_id,
              role:payload.role,
              name:payload.name,
              email:payload.email
          });
       },
  
      DELETE_USER (state,payload) {
        const index = state.users.indexOf(payload)
        state.users.splice(index, 1)
      },

}

export const actions = {
    async getRoles ({ commit }) {
        const res = await this.$axios.get('role');
        commit('ROLES',res.data);
      },
      async getUsers ({ commit }) {
        const res = await this.$axios.get('user');
        commit('USERS',res.data);
      }

}


 
  
