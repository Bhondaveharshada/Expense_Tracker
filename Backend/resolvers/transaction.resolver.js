import Transaction from "../models/transaction.model.js"

const transationResolver ={
    Query:{
        transactions : async(_,_,context) =>{
           try {
            if(!context.getUser()){
                throw new Error("Unauthorized")
            }
            const userId = await context.getUser()._id
            const transactions = await Transaction.find({userId})
            return transactions
           } catch (error) {
             console.error("Error in getting Transactions",error);
             throw new Error("Error getting Transactions");
             
           }
        },

        transaction : async(_,{transactionId},context) =>{
            try {
                const transaction = await Transaction.findById(transactionId)
                return transaction
            } catch (error) {
                console.error("Error in getting Transaction",error);
                 throw new Error("Error getting Transaction");
            }
        }
    },
    Mutation:{

    }
}

export default transationResolver