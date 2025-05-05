const STORAGE_KEY = "transactions";

const getTransactions = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveTransactions = (txs) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(txs));
};

const addTransaction = (tx) => {
  const txs = getTransactions();
  const newTx = {
    ...tx,
    id: Date.now()
  };
  txs.push(newTx);
  saveTransactions(txs);
};

const deleteTransaction = (id) => {
  const txs = getTransactions().filter(tx => tx.id !== id);
  saveTransactions(txs);
};

const updateTransaction = (id, updatedTx) => {
  const txs = getTransactions().map(tx =>
    tx.id === id ? { ...updatedTx, id } : tx
  );
  saveTransactions(txs);
};

export const TransactionService = {
  getTransactions,
  addTransaction,
  deleteTransaction,
  updateTransaction
};
