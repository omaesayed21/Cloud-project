
const STORAGE_KEY = 'budgets';

export function getBudgets() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function addBudget(budget) {
  const budgets = getBudgets();
  const newBudget = { ...budget, id: Date.now() };
  budgets.push(newBudget);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets));
}

export function updateBudget(updatedBudget) {
  const budgets = getBudgets().map((budget) =>
    budget.id === updatedBudget.id ? updatedBudget : budget
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets));
}

export function deleteBudget(id) {
  const budgets = getBudgets().filter((budget) => budget.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets));
}
