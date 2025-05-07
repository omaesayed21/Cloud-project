// import { Dialog, Transition } from '@headlessui/react';
// import { Fragment, useState, useEffect } from 'react';
// import { budgetSchema } from '../hooks/useFormValidation';
// import { addBudget , getBudgets , updateBudget } from '../../infrastructure/services/BudgetService';

// export default function BudgetModal({ isOpen, setIsOpen, budgetToEdit, setBudgets, onSuccess }) {
//   const [category, setCategory] = useState('');
//   const [limit, setLimit] = useState('');
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     if (budgetToEdit) {
//       setCategory(budgetToEdit.category);
//       setLimit(budgetToEdit.limit);
//     } else {
//       setCategory('');
//       setLimit('');
//     }
//   }, [budgetToEdit]);

//   function closeModal() {
//     setIsOpen(false);
//   }

//   function handleSave() {
//     budgetSchema
//       .validate({ category, limit }, { abortEarly: false })
//       .then(() => {
//         const budgetData = {
//           category,
//           limit: parseFloat(limit),
//         };

//         if (budgetToEdit) {
//           updateBudget({ ...budgetToEdit, ...budgetData });
//           onSuccess && onSuccess('updated');
//         } else {
//           addBudget(budgetData);
//           onSuccess && onSuccess('added');
//         }

//         setBudgets(getBudgets());
//         setIsOpen(false);
//       })
//       .catch((validationError) => {
//         const formattedErrors = {};
//         validationError.inner.forEach((err) => {
//           formattedErrors[err.path] = err.message;
//         });
//         setErrors(formattedErrors);
//       });
//   }

//   return (
//     <Transition appear show={isOpen} as={Fragment}>
//       <Dialog as="div" className="relative z-10" onClose={closeModal}>
//         <Transition.Child
//           as={Fragment}
//           enter="ease-out duration-300"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="ease-in duration-200"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
//         </Transition.Child>

//         <div className="fixed inset-0 overflow-y-auto">
//           <div className="flex min-h-full items-center justify-center p-4 text-center">
//             <Transition.Child
//               as={Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-0 scale-95"
//               enterTo="opacity-100 scale-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100 scale-100"
//               leaveTo="opacity-0 scale-95"
//             >
//               <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
//                 <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
//                   {budgetToEdit ? 'Edit Budget' : 'Add New Budget'}
//                 </Dialog.Title>

//                 <div className="mt-4 space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//                     <input
//                       type="text"
//                       className={`block w-full border p-2 rounded-md text-sm focus:outline-none focus:ring-2 ${
//                         errors.category ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
//                       }`}
//                       placeholder="e.g. Food"
//                       value={category}
//                       onChange={(e) => setCategory(e.target.value)}
//                     />
//                     {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Limit</label>
//                     <input
//                       type="text"
//                       className={`block w-full border p-2 rounded-md text-sm focus:outline-none focus:ring-2 ${
//                         errors.limit ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'
//                       }`}
//                       placeholder="Enter amount"
//                       value={limit}
//                       onChange={(e) => setLimit(e.target.value)}
//                     />
//                     {errors.limit && <p className="text-red-500 text-xs mt-1">{errors.limit}</p>}
//                   </div>
//                 </div>

//                 <div className="mt-6 flex justify-end gap-4">
//                   <button
//                     type="button"
//                     className="inline-flex justify-center rounded-md bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400"
//                     onClick={closeModal}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="button"
//                     className="inline-flex justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
//                     onClick={handleSave}
//                   >
//                     {budgetToEdit ? 'Save Changes' : 'Add Budget'}
//                   </button>
//                 </div>
//               </Dialog.Panel>
//             </Transition.Child>
//           </div>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// }
