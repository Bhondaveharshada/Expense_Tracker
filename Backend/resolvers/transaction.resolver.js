import Transaction from "../models/transaction.model.js"

const transationResolver ={
    Query:{
        transactions : async(_, __,context) =>{
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
        createTransation: async (_,{input},context) =>{
           try {
            
            const newTransaction = new Transaction({
                ...input,
                userId:context.getUser()._id
            })
            await newTransaction.save()
            return newTransaction

           } catch (error) {
            console.error("Error creating Transaction", error.message);
            throw new Error("Error creating Transaction")
            
           }

        },
        updateTransation: async (_,{input},) =>{
          try {
            const updateTransation = await Transaction.findByIdAndUpdate(input.transactionId, input , {new:true})
            return updateTransation
          } catch (error) {
            console.error("Error updating Transaction", error);
            throw new Error("Error updating Transaction")
          }

        },
        
        deleteTransation: async (_ ,{transactionId}) =>{
          try {
            const deleteTransation = await Transaction.findByIdAndDelete(transactionId)
            return deleteTransation
          } catch (error) {
            console.error("Error deleting Transaction", error);
            throw new Error("Error deleting Transaction")
          }

        }
    }
}

export default transationResolver