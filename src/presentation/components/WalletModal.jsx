import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { addWallet , getWallets , updateWallet } from '../../infrastructure/services/WalletService';
import { walletSchema } from '../hooks/useFormValidation';

export default function WalletModal({ isOpen, setIsOpen, walletToEdit, setWallets }) {

  const [newName, setNewName] = useState('');
  const [newBalance, setNewBalance] = useState('');
  const [newType, setNewType] = useState('Cash');
  const [errors, setErrors] = useState({});


  useEffect(() => {
    if (walletToEdit) {
      setNewName(walletToEdit.name);
      setNewBalance(walletToEdit.balance);
      setNewType(walletToEdit.type);
    } else {
      setNewName('');
      setNewBalance('');
      setNewType('Cash');
    }
  }, [walletToEdit]);


  
//   setErrors(errors);
//   if (Object.keys(errors).length > 0) return;
  
  function closeModal() {
    setIsOpen(false);
  }

  function handleSave() {
    walletSchema
      .validate({ name: newName, balance: newBalance, type: newType }, { abortEarly: false })
      .then(() => {
        const walletData = {
          name: newName,
          balance: parseFloat(newBalance),
          type: newType,
        };
  
        if (walletToEdit) {
          updateWallet({ ...walletToEdit, ...walletData });
        } else {
          addWallet(walletData);
        }
  
        setWallets(getWallets());
        setIsOpen(false);
      })
      .catch((validationError) => {
        const formattedErrors = {};
        validationError.inner.forEach((err) => {
          formattedErrors[err.path] = err.message;
        });
        setErrors(formattedErrors);
      });
  }
  
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
                  {walletToEdit ? 'Edit Wallet' : 'Add New Wallet'}
                </Dialog.Title>

                <div className="mt-4 space-y-4">
                  {/* Wallet Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Wallet Name</label>
                    <input
                      type="text"
                      className={`block w-full border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}                      placeholder="Enter wallet name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  {/* Wallet Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Wallet Type</label>
                    <select
                      className="block w-full border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                    >
                      <option value="Cash">Cash</option>
                      <option value="Bank">Bank</option>
                      <option value="Card">Card</option>
                    </select>
                  </div>

                  {/* Balance */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Balance</label>
                    <input
                      type="text"
                      className={`block w-full border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.balance ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter balance"
                      value={newBalance}
                      onChange={(e) => setNewBalance(e.target.value)}
                    />
                    {errors.balance && <p className="text-red-500 text-xs mt-1">{errors.balance}</p>}
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-6 flex justify-end gap-4">
                  <button
                    type="button"
                    className=" cursor-pointer  inline-flex justify-center rounded-md bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className=" cursor-pointer inline-flex justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={handleSave}
                  >
                    {walletToEdit ? 'Save Changes' : 'Add Wallet'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
