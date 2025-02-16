const transactiontypeDef = `#graphql

  type Transaction{
    _id:ID!
    userId:ID!
    description:String!
    paymentType: String!
    category:String!
    amount:Float!
    location:String
    date:String!
  }

  type Query{
    transactions: [Transaction!]
    transaction(transactionId:ID!):Transaction
  }

  type Mutation {
    createTransation(input:CreateTransationInput):Transaction!
    updateTransation(input:UpdateTransationInput):Transaction!
    deleteTransation(transactionId:ID!):Transaction!
  }

  input CreateTransationInput{
    description:String!
    paymentType: String!
    category:String!
    amount:Float!
    location:String
    date:String!
  }

 input UpdateTransationInput{
    transactionId: ID!
    description:String!
    paymentType: String!
    category:String!
    amount:Float!
    location:String
    date:String!
 }


`

export default transactiontypeDef