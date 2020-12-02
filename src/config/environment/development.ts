export const development: any = {
  
  mongodb: {
    uri: 'mongodb://localhost/finalProject',
    options: {
      useNewUrlParser: true,
      useFindAndModify: false
    }
  },

  minForSyncResources: 15,

  //Setting json web token
  secretJwt: 'privateJWTKey'
};
