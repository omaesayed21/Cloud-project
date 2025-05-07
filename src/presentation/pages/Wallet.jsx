import { useState, useEffect } from 'react';
import { getWallets, deleteWallet } from '../../infrastructure/services/WalletService';
import WalletModal from '../components/WalletModal';
import toast, { Toaster } from "react-hot-toast";
import { RefreshCw } from 'lucide-react';  // Ensure this is the correct import for the icon

export default function Wallets() {
  const [wallets, setWallets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [walletToEdit, setWalletToEdit] = useState(null);
  const [loading, setLoading] = useState(false);  // Add loading state

  const fetchWallets = async () => {
    setLoading(true);  // Set loading to true before fetching
    try {
      const data = await getWallets();
      setWallets(data);
    } catch (error) {
      toast.error("Failed to fetch wallets");
    } finally {
      setLoading(false);  // Set loading to false after the fetch
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const handleAdd = () => {
    setWalletToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (wallet) => {
    setWalletToEdit(wallet);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    await deleteWallet(id);
    fetchWallets();
    toast.success("Wallet deleted");
  };

  const handleModalSuccess = (action) => {
    fetchWallets();
    toast.success(`Wallet ${action}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <RefreshCw className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="mt-4 text-lg text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 container mx-auto">
      <Toaster />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Wallets</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleAdd}
        >
          Add Wallet
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {wallets.map((wallet) => (
          <div key={wallet.id} className="border rounded p-4 shadow">
            <h3 className="text-lg font-semibold">{wallet.name}</h3>
            <p>Type: {wallet.type}</p>
            <p>Balance: {wallet.balance} {wallet.currency}</p>
            <p>Notes: {wallet.notes}</p>
            <div className="mt-2 flex justify-end space-x-2">
              <button
                className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
                onClick={() => handleEdit(wallet)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                onClick={() => handleDelete(wallet.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <WalletModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        walletToEdit={walletToEdit}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
