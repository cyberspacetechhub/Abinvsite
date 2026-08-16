
const {
    getTransactions,
    getTransaction,
    deleteTransaction,
    getTransactionsByUser
} = require('../services/transactionService')

const handleGetTransactions = async (req, res) => {
    const data = {
        page: req.query.page,
        limit: req.query.limit
    }
    const transactions = await getTransactions(data)
    if(transactions.error) {
        return res.status(400).json("No data found")
    }
    return res.status(200).json(transactions)
}

const handleGetTransaction = async (req, res) => {
    if(!req.params.id) return res.status(400).json("No id found")
    const _id = req.params.id
    const transaction = await getTransaction(_id)
    if(transaction.error) return res.status(400).json("No data found")

    return res.status(200).json(transaction)
}

const handleDeleteTransaction = async (req, res) => {
    if(!req.params.id) return res.status(400).json("No id found")
    const _id = req.params.id
    const transaction = await deleteTransaction(_id)
    if(transaction.error) return res.status(400).json("No data found")

    return res.status(200).json(transaction)
}


const handleGetTransactionByUser= async (req, res) => {
    // console.log(req.params.id)
    const data = {
      page: req.query.page,
      limit: req.query.limit,
      userId: req.params.id,
    };
    const transactions = await getTransactionsByUser(data);
    if (!transactions)
      return res.status(404).json({ message: "Transaction not found" });
    return res.status(200).json(transactions);
  };

module.exports = {
    handleGetTransactions,
    handleGetTransaction,
    handleDeleteTransaction,
    handleGetTransactionByUser
}