import { mergeResolvers } from "@graphql-tools/merge";
import userResolver from "./user.resolver.js";
import transationResolver from "./transaction.resolver.js";


const mergeResolver = mergeResolvers([transationResolver ,userResolver])

export default mergeResolver