
let wallets = [
    { id: 1, name: 'Bank', type: 'Bank', balance: 10000 },
    { id: 2, name: 'Cash', type: 'Cash', balance: 3500 },
    { id: 3, name: 'Card', type: 'Card', balance: 9000 },
  ];
  
  export function getWallets() {
    return [...wallets];
  }
  
  export function addWallet(wallet) {
    wallet.id = Date.now();
    wallets.push(wallet);
  }
  
  export function deleteWallet(id) {
    wallets = wallets.filter(w => w.id !== id);
  }
  
  export function updateWallet(updatedWallet) {
    wallets = wallets.map(w => (w.id === updatedWallet.id ? updatedWallet : w));
  }
  