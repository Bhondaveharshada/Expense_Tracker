import passport from "passport";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js"

import { GraphQLLocalStrategy } from "graphql-passport";

 const configurePassport = async () => {
  passport.serializeUser((user, done) => {
    console.log("serializing User");

    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    console.log("Deserializing User");
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  passport.use(
    new GraphQLLocalStrategy(async (username, password, done) => {
       try {
        const user = User.findOne({username})
        if(!user){
            throw new Error('Invalid username or password')
        }
        const validPassword = await bcrypt.compare(password,user.password)
        if(!validPassword){
            throw new Error('Invalid username or password')
        }
        return done(null,user)
       } catch (err) {
        
       }
     
      })
  )
};

export default configurePassport ;
