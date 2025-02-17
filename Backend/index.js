import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import ConnectMongo from 'connect-mongodb-session';
import { ApolloServer } from "@apollo/server";
import {expressMiddleware} from '@apollo/server/express4';
import {ApolloServerPluginDrainHttpServer} from '@apollo/server/plugin/drainHttpServer';
import {buildContext} from "graphql-passport"
import mergeResolver from "./resolvers/index.js";
import mergeTypeDefinations from "./typeDefs/index.js";
import { connectDB } from './db/connectdb.js';
import configurePassport from "./passport/passport.config.js"

dotenv.config()
configurePassport()
const app = express()
const httpServer = http.createServer(app);

const MongoDBStore = ConnectMongo(session)

const store = new MongoDBStore({
    uri:process.env.MONGO_URI,
    collection:"sessions"
})
store.on("err",(err)=> console.log(err))

app.use(
    session({
      secret:process.env.SESSION_SECRET,
      resave:false, //this specifies whether to save session to store on every request
      saveUninitialized:false, //specifies whether to store unintiallized session
      cookie:{
        maxAge:1000 * 60 *60 * 24 * 7,
        httpOnly: true // prevents the cross-site Scripting 
      },
      store:store
    })
)

app.use(passport.initialize())
app.use(passport.session())


const server = new ApolloServer({
    typeDefs:mergeTypeDefinations,
    resolvers:mergeResolver,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })
   await server.start();

   
   app.use(
    '/graphql',
    cors({
        credentials:true
    }),
    express.json(),
    expressMiddleware(server, {
        context: async ({ req,res }) => buildContext({ req,res}),
    })
);


await new Promise((resolve) =>httpServer.listen({ port: 4000 }, resolve))
await connectDB()
console.log(`🚀 Server ready at http://localhost:4000/graphql`)