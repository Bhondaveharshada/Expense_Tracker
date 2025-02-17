import { Query } from "mongoose";
import {users} from "../dummyData/data.js"
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"

const userResolver ={
    Query : {

        authUser: async (_, __, context) => {
			try {
				const user = await context.getUser();
				return user;
			} catch (err) {
				console.error("Error in authUser: ", err);
				throw new Error("Internal server error");
			}
		},

       user: async (_, { userId }) => {
			try {
				const user = await User.findById(userId);
				return user;
			} catch (err) {
				console.error("Error in user query:", err);
				throw new Error(err.message || "Error getting user");
			}
		},
    },
    
    Mutation :{

        signUp:async(_, {input},context) =>{
            try {
                const {username ,email, password ,gender} = input;

                if(!username || !email || !password || !gender){
                    throw new Error("All fields are required")
                }
                const existiingUser = await User.findOne({username});
                if(existiingUser){
                    throw new Error("User already Exist")
                }
                const salt = await bcrypt.genSalt(10)
                const hashPassword = await bcrypt.hash(password,salt)

                const girlprofilepic = `https://avatar-placeholder.iran.liara.run/public/girl?username=${username}`
                const boyprofilepic = `https://avatar-placeholder.iran.liara.run/public/boy?username=${username}`

                const newUser = new User({
                    username,
                    email,
                    password:hashPassword,
                    gender,
                    profilePicture: gender ==="male" ? boyprofilepic : girlprofilepic,
                })

                await newUser.save()
                await login(newUser)
                return newUser;
            } catch (err) {
                console.log("error in sign up", err);
                throw new Error(err.message  || "Internal server error")
                
            }
        },
        
        login : async(_,{input},context) =>{
            try {
                const {username, password} = input
                const {user} =  await context.authenticate('graphql-local',{username,password})

                await login(user)
                return user

            } catch (error) {
                console.log("error in login:", err);
                throw new Error(err.message  || "Internal server error") 
            }
        },

        logout: async (_, __, context) => {
			try {
				await context.logout();
				context.req.session.destroy((err) => {
					if (err) throw err;
				});
				context.res.clearCookie("connect.sid");

				return { message: "Logged out successfully" };
			} catch (err) {
				console.error("Error in logout:", err);
				throw new Error(err.message || "Internal server error");
			}
		},
    }
}

export default userResolver;