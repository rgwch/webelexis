/**
 * Created by gerry on 16.12.15.
 */
var LocalStrategy=require('passport-local').Strategy
var User= require('./kontakt.js')

module.exports=function(passport){
  passport.serializeUser(function(user,done){
    done(null,user.guid)
  })

  passport.deserializeUser(function(id, done){
    User.findOne({'guid':id},function(err,user){
      done(err,user)
    })
  })
  passport.use(new LocalStrategy(function(username,password,done){
    return done(null,"hello")

  }))

}
