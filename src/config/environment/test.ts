export const test: any = {
  mongodb: {
    
    uri: 'mongodb://localhost/scaffolding-test',
    options: {
      useNewUrlParser: true,
      useFindAndModify: false
    }
  },

  minForSyncResources: 15,

  //Setting json web token
  secretJwt: 'privateJWTKey'
};
