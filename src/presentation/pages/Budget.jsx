// import { useEffect, useState } from 'react';
// import BudgetModal from '../components/BudgetModal';
// import { getBudgets, deleteBudget } from '../../infrastructure/services/BudgetService';
// import get

// export default function Budget() {
//   const [budgets, setBudgets] = useState([]);

//   const [transactions, setTransactions] = useState([]);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [budgetToEdit, setBudgetToEdit] = useState(null);


//   const formatCurrency = (value) => {
//     return new Intl.NumberFormat('ar-EG', {
//       style: 'currency',
//       currency: 'EGP',
//     }).format(value);
//   };

//   useEffect(() => {
//     setBudgets(getBudgets());
//     setTransactions(getTransactions());

//   }, []);

//   function handleAddClick() {
//     setBudgetToEdit(null);
//     setIsModalOpen(true);
//   }

//   function handleEditClick(budget) {
//     setBudgetToEdit(budget);
//     setIsModalOpen(true);
//   }

//   function handleDeleteClick(id) {
//     deleteBudget(id);
//     setBudgets(getBudgets());
//   }
//   const getSpentAmount = (category) => {
//     return transactions
//       .filter(tx => tx.category === category)
//       .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
//   };

//   const getForecast = (spent) => {
//     const now = new Date();
//     const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
//     const elapsedDays = now.getDate();
//     return elapsedDays === 0 ? spent : (spent / elapsedDays) * daysInMonth;
//   };

//   return (
//     <div className="p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-xl font-bold">Budgets</h1>
//         <button
//           onClick={handleAddClick}
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           + Add Budget
//         </button>
//       </div>

//       {/* Budget Table */}
//       <div className="bg-white shadow rounded-md overflow-hidden">
//         <table className="min-w-full text-sm">
//           <thead className="bg-gray-100 text-left">
//             <tr>
//               <th className="px-4 py-2">Category</th>
//               <th className="px-4 py-2">Limit</th>
//               <th className="px-4 py-2">Spent</th>
//               <th className="px-4 py-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {budgets.length === 0 ? (
//               <tr>
//                 <td colSpan="5" className="text-center py-4 text-gray-500">No budgets added yet.</td>
//               </tr>
//             ) : (
//               budgets.map((budget) => {
//                 const spent = getSpentAmount(budget.category);
//                 const forecast = getForecast(spent);
//                 return (
//                   <tr key={budget.id} className="border-t">
//                     <td className="px-4 py-2">{budget.category}</td>
//                     <td className="px-4 py-2">{budget.limit}</td>
//                     <td className="px-4 py-2 text-red-600">{spent.toFixed(2)}</td>
//                     <td className="px-4 py-2 text-blue-600">{forecast.toFixed(2)}</td>
//                     <td className="px-4 py-2 flex gap-2">
//                       <button
//                         onClick={() => handleEditClick(budget)}
//                         className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDeleteClick(budget.id)}
//                         className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })
//             )}
//           </tbody>
//         </table>
//       </div>
      

//       {/* Budget Modal */}
//       <BudgetModal
//         isOpen={isModalOpen}
//         setIsOpen={setIsModalOpen}
//         budgetToEdit={budgetToEdit}
//         setBudgets={setBudgets}
//         onSuccess={() => setBudgets(getBudgets())}
//       />
//     </div>
//   );
// }

