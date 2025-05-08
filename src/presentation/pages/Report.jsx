import { useEffect, useState, useRef } from 'react'
import { TransactionService } from '../../infrastructure/services/TransactionService'
import { getWallets } from '../../infrastructure/services/WalletService'
import { getBudgets } from '../../infrastructure/services/BudgetService'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default function ReportPage() {
  const [transactions, setTransactions] = useState([])
  const [wallets, setWallets] = useState([])
  const [budgets, setBudgets] = useState([])
  const reportRef = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      TransactionService.getTransactions(token)
        .then(setTransactions)
        .catch((err) => console.error('Transaction error:', err))

      getWallets(token)
        .then(setWallets)
        .catch((err) => console.error('Wallet error:', err))

      getBudgets(token)
        .then(setBudgets)
        .catch((err) => console.error('Budget error:', err))
    }
  }, [])


  const getCurrentDate = () => {
    const today = new Date()
    const day = String(today.getDate()).padStart(2, '0')
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const year = today.getFullYear()
    return `${day}/${month}/${year}`
  }

  const walletData = wallets.map((wallet) => {
    const relatedTx = transactions.filter((t) => t.account_id === wallet.id)

    const income = relatedTx
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const expense = relatedTx
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    const expenseCategories = [
      ...new Set(relatedTx.filter((t) => t.type === 'expense').map((t) => t.category_id)),
    ]

    const walletBudgets = budgets.filter(
      (b) => b.category_type === 'expense' && expenseCategories.includes(b.category_id)
    )

    const totalBudget = walletBudgets.reduce((sum, b) => sum + b.amount, 0)

    const budgetUsage =
      totalBudget > 0 ? Math.round((expense / totalBudget) * 100) : 0

    return {
      ...wallet,
      income,
      expense,
      balance: wallet.balance,
      budget: totalBudget,
      budgetUsage,
    }
  })

  // const handleDownloadPDF = () => {
  //   const input = reportRef.current
  //   if (!input) return
  
  //   // نمنع تأثيرات الألوان الحديثة
  //   input.style.colorScheme = 'light'
  //   input.style.filter = 'none'
  
  //   html2canvas(input, {
  //     backgroundColor: '#ffffff', // تأكد إن الخلفية بيضاء
  //     useCORS: true,
  //     logging: true,
  //   }).then((canvas) => {
  //     const imgData = canvas.toDataURL('image/png')
  //     const pdf = new jsPDF()
  //     const pdfWidth = pdf.internal.pageSize.getWidth()
  //     const pdfHeight = (canvas.height * pdfWidth) / canvas.width
  //     pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
  //     pdf.save('wallet-report.pdf')
  //   }).catch((err) => {
  //     console.error('PDF generation error:', err)
  //   })
  // }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div
        ref={reportRef}
        className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8"
      >
        <h1 className="text-3xl font-bold text-center mb-4">Financial Report</h1>
        
      

        <p className="text-gray-600 text-center text-sm mb-8 italic">
          This report summarizes your wallet activity across income, expenses, and budget,
          providing a comprehensive financial snapshot for informed decision-making.
        </p>

        {/* عرض التاريخ الحالي */}
        <p className="text-center text-sm text-gray-600 mb-6">Report Date: {getCurrentDate()}</p>

        <div className="space-y-6">
          {walletData.map((wallet) => (
            <div
              key={wallet.id}
              className="border rounded-lg p-6 shadow-sm bg-gray-100"
            >
              <h2 className="text-xl font-semibold mb-2">{wallet.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                <div>
                  <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>Income</p>
                  <p className="font-bold" style={{ color: 'rgb(22, 163, 74)' }}>{wallet.income} EGP</p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>Expense</p>
                  <p className="font-bold" style={{ color: 'rgb(220, 38, 38)' }}>{wallet.expense} EGP</p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>Net Balance</p>
                  <p className="font-bold">{wallet.balance} EGP</p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>Budget</p>
                  <p className="font-bold" style={{ color: 'rgb(37, 99, 235)' }}>{wallet.budget} EGP</p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'rgb(107, 114, 128)' }}>Budget Usage</p>
                  <p
                    className="font-bold"
                    style={{
                      color:
                        wallet.budgetUsage > 100
                          ? 'rgb(220, 38, 38)'
                          : 'rgb(202, 138, 4)',
                    }}
                  >
                    {wallet.budgetUsage}% 
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-sm text-gray-600">
          <p>
            Monitoring your wallets regularly helps you understand your spending habits and stick to your financial goals. Always adjust your budgets to reflect your real needs.
          </p>
        </div>
      </div>

      {/* <div className="mt-8 text-center">
        <button
          onClick={handleDownloadPDF}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Download PDF
        </button>
      </div> */}
    </div>
  )
}
