import express from 'express';
import http from 'http';
import cors from 'cors';
import { ApolloServer } from "@apollo/server";
import {expressMiddleware} from '@apollo/server/express4';
import {ApolloServerPluginDrainHttpServer} from '@apollo/server/plugin/drainHttpServer';
import mergeResolver from "./resolvers/index.js";
import mergeTypeDefinations from "./typeDefs/index.js";

const app = express()
const httpServer = http.createServer(app);

const server = new ApolloServer({
    typeDefs:mergeTypeDefinations,
    resolvers:mergeResolver,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })
   await server.start();

   
   app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
        context: async ({ req }) => ({ req}),
    })
);

// Modified server startup
await new Promise((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)   
).then(console.log(`🚀 Server ready at http://localhost:4000/`))

