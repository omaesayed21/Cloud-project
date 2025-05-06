import { getWallets , updateWallet } from "./WalletService";


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

  const wallets = getWallets();
  const wallet = wallets.find(w => w.id === tx.walletId);
  if(wallet){
    wallet.balance +=tx.type === 'income' ? tx.amount : -tx.amount;
    updateWallet(wallet);
  }
};

const deleteTransaction = (id) => {
  const txs = getTransactions();
  const txToDelete = txs.find(tx => tx.id === id);
  const updatedTxs = txs.filter(tx => tx.id !== id);
  

  const wallets= getWallets();
  const wallet = wallets.find(w => w.id === txToDelete.walletId);
  if(wallet){
  
    wallet.balance -= txToDelete.type === 'income' ? txToDelete.amount : -txToDelete.amount;
    updateWallet(wallet)

  }
  saveTransactions(updatedTxs);
};


const updateTransaction = (id, updatedTx) => {
  const txs = getTransactions().map(tx =>
    tx.id === id ? { ...updatedTx, id } : tx
  );
  const oldTx = txs.find(tx => tx.id === id);
  if(oldTx){
    const wallets = getWallets()
    const oldWallet = wallets.find( w => w.id ===oldTx.walletId)
    const newWallet = wallets.find( w => w.id ===updatedTx.walletId)
    
    if(oldWallet){
      oldWallet.balance -=oldTx.type === 'income' ? oldTx.amount : -oldTx.amount;
      newWallet.balance +=updatedTx.type === 'income' ? updatedTx.amount : -updatedTx.amount;
      updateWallet(oldWallet);
    }
    if(newWallet){
      newWallet.balance +=updatedTx.type === 'income' ? updatedTx.amount : -updatedTx.amount;
      
      updateWallet(newWallet);
    }
  }
  const updatedTxs = txs.map(tx => (tx.id === id ? { ...updatedTx, id } : tx));
  saveTransactions( updatedTxs );
};

export const TransactionService = {
  getTransactions,
  addTransaction,
  deleteTransaction,
  updateTransaction
};
