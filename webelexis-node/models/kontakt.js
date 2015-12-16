/**
 * Created by gerry on 16.12.15.
 */
var mongoose=require('mongoose')
var bcrypt=require('bcrypt-nodejs')

var kontaktSchema=mongoose.Schema({
  guid: String,
  user:{
    username: String,
    password: String,
  },
  person: {
    dob: String,
    firstname: String,
    lastname: String,
    salutation: String,
  }
})

kontaktSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
kontaktSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Kontakt', kontaktSchema);