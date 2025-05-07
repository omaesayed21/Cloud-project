import React, { useContext } from 'react'
import { budgetContext } from './BudgetContext'

export default function BudgetList() {
  const { budgets, addBudget, deleteBudget, setEditingBudget, editingBudget } = useContext(budgetContext)

  return (
    <div>
      <h1>Budgets</h1>
      <div>
        <button onClick={addBudget}>Add New Budget</button>
        <ul>
          {budgets.map((budget) => (
            <li key={budget.id}>
              {budget.name} - {budget.amount}
              <button onClick={() => setEditingBudget(budget)}>Edit</button>
              <button onClick={() => deleteBudget(budget.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
      {editingBudget && (
        <div>
          <h2>Edit Budget</h2>
          <input 
            type="text"
            value={editingBudget.name}
            onChange={(e) => setEditingBudget({ ...editingBudget, name: e.target.value })}
          />
          <input 
            type="number"
            value={editingBudget.amount}
            onChange={(e) => setEditingBudget({ ...editingBudget, amount: e.target.value })}
          />
          <button onClick={() => updateBudget(editingBudget.id)}>Update</button>
        </div>
      )}
    </div>
  )
}
