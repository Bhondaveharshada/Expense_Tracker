import { mergeTypeDefs } from "@graphql-tools/merge";
import userTypeDef from "./user.typeDef.js";
import transactiontypeDef from "./transaction.typeDef.js";

const mergeTypeDefinations = mergeTypeDefs([userTypeDef,transactiontypeDef])

export default mergeTypeDefinations