const { AuthenticationService, JWTStrategy } = require('@feathersjs/authentication');
const { LocalStrategy } = require('@feathersjs/authentication-local');
const { expressOauth } = require('@feathersjs/authentication-oauth');
const ElexisUtil = require('./util/elexis-types')
const elexisUtils = new ElexisUtil()


class ElexisAuth extends LocalStrategy{
  comparePassword(user,password){
    return new Promise((resolve, reject) => {
      const hashed = elexisUtils.hashPassword(password, user.salt)
      if (hashed.hashed === user.hashed_password) {
          resolve(user)
      } else {
          reject(false)
      }
  });
  }
}
module.exports = app => {
  const authentication = new AuthenticationService(app);

  authentication.register('jwt', new JWTStrategy());
  authentication.register('local', new ElexisAuth());

  app.use('/authentication', authentication);
  app.configure(expressOauth());
};
