export const constants = {
    
  userConstants:{
    user:"/user/#/users",
    roles:"/user/#/roles",
    },

  user:{
      users:"/service/identity/v1/users/users",
      deleteUser:"/service/identity/v1/users/users/",
      userIdentity:"/service/identity/v1/users/users/**"
    },  

  endpoints:{
        roles:"/service/identity/v1/users/roles",
        roleIdentity:"/service/identity/v1/users/roles/**",
        deleteRole:"/service/identity/v1/users/roles/"
  }
}