import { useState, useEffect } from 'react';
import { getWallets , deleteWallet } from '../../infrastructure/services/WalletService';
import WalletModal from '../components/WalletModal';

export default function Wallets() {
  const [wallets, setWallets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [walletToEdit, setWalletToEdit] = useState(null);  

  useEffect(() => {
    setWallets(getWallets());
  }, []);

  const handleAdd = () => {
    setWalletToEdit(null); 
    setIsModalOpen(true);
  };

  const handleEdit = (wallet) => {
    setWalletToEdit(wallet); 
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    deleteWallet(id);
    setWallets(getWallets());
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Wallets</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
        >
          Add Wallet
        </button>
      </div>

      {/* Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        {wallets.map((wallet) => (
          <div
            key={wallet.id}
            className="bg-white shadow rounded-xl p-4 border flex flex-col gap-2"
          >
            <div className="text-lg font-semibold text-gray-800">
              {wallet.name}
            </div>
            <div className="text-sm text-gray-500">Type: {wallet.type}</div>
            <div className="text-lg text-green-600 font-bold">
              EGP {wallet.balance.toLocaleString()}
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => handleEdit(wallet)}
                className="text-sm px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500  cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(wallet.id)}
                className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600  cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

{/* Modal */}
      <WalletModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        walletToEdit={walletToEdit}
        setWallets={setWallets}
      />
    </div>
  );
}
