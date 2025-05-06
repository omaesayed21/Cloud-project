import { useState, useEffect } from 'react';
import { Wallet, CreditCard, DollarSign, PieChart, TrendingDown } from 'lucide-react';
import { TransactionService } from '../../infrastructure/services/TransactionService';
import { getWallets } from '../../infrastructure/services/WalletService'; // Import getWallets
import { motion } from 'framer-motion'; // Importing framer-motion for animations

// Main Dashboard Component
export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalBalance: 0,
    monthlySpending: 0,
    walletCount: 0,
    categories: [],
  });

  // Simulate fetching data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch actual wallet and transaction data
        const wallets = await getWallets(); // Updated method to use getWallets
        const transactions = await TransactionService.getTransactions(); // Fetch transaction service
        
        // Calculations
        const totalBalance = wallets.reduce((total, wallet) => total + wallet.balance, 0);
        const monthlySpending = transactions.reduce((total, tx) => {
          const currentMonth = new Date().getMonth();
          const txMonth = new Date(tx.date).getMonth();
          if (txMonth === currentMonth && tx.type === 'expense') {
            total += tx.amount;
          }
          return total;
        }, 0);
        
        const walletCount = wallets.length;
        const categories = transactions.reduce((acc, tx) => {
          acc[tx.category] = acc[tx.category] || 0;
          acc[tx.category] += tx.amount;
          return acc;
        }, {});

        setDashboardData({
          totalBalance,
          monthlySpending,
          walletCount,
          categories: Object.keys(categories).map((category) => ({
            name: category,
            amount: categories[category],
            percentage: (categories[category] / monthlySpending) * 100,
          })),
        });

        setLoading(false);
      } catch (err) {
        setError('Error loading data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);  // Empty dependency array means this effect runs once when the component mounts.

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-4xl mb-4">!</div>
          <h2 className="text-xl font-bold mb-2">An error occurred</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Overview of your financial status</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StatCard 
              title="Total Balance"
              value={`$${dashboardData.totalBalance.toLocaleString()}`}
              icon={<DollarSign className="h-6 w-6 text-green-500" />}
              bgColor="bg-green-50"
              textColor="text-green-600"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <StatCard 
              title="Monthly Spending"
              value={`$${dashboardData.monthlySpending.toLocaleString()}`}
              icon={<TrendingDown className="h-6 w-6 text-red-500" />}
              bgColor="bg-red-50"
              textColor="text-red-600"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StatCard 
              title="Wallet Count"
              value={dashboardData.walletCount}
              icon={<Wallet className="h-6 w-6 text-blue-500" />}
              bgColor="bg-blue-50"
              textColor="text-blue-600"
            />
          </motion.div>

          {/* Ensuring Budget Usage card is the same height as the others */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <StatCard 
              title="Budget Usage"
              value="75%"
              icon={<CreditCard className="h-6 w-6 text-purple-500" />}
              bgColor="bg-purple-50"
              textColor="text-purple-600"
            >
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div className="bg-purple-600 h-2.5 rounded-full w-3/4"></div>
              </div>
            </StatCard>
          </motion.div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Category Breakdown</h2>
            <div className="flex items-center">
              <PieChart className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-sm text-gray-500">Current month</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {dashboardData.categories.map((category, index) => (
              <CategoryItem 
                key={index}
                name={category.name}
                amount={category.amount}
                percentage={category.percentage}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// StatCard component
function StatCard({ title, value, icon, bgColor, textColor, children }) {
  return (
    <div className={`${bgColor} p-6 rounded-lg shadow h-full`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-600 text-sm">{title}</h3>
          <p className={`${textColor} text-2xl font-bold mt-1`}>{value}</p>
        </div>
        <div className="p-2 rounded-full bg-white shadow">
          {icon}
        </div>
      </div>
      {children}
    </div>
  );
}

// CategoryItem component
function CategoryItem({ name, amount, percentage }) {
  const getColorClass = (categoryName) => {
    const colors = {
      'Food': 'bg-blue-500',
      'Entertainment': 'bg-green-500',
      'Transportation': 'bg-yellow-500',
    };
    return colors[categoryName] || 'bg-gray-500';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center">
          <div className={`h-3 w-3 rounded-full ${getColorClass(name)} mr-2`}></div>
          <span className="font-medium">{name}</span>
        </div>
        <div className="text-gray-700">${amount.toLocaleString()}</div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div 
          className={`${getColorClass(name)} h-1.5 rounded-full`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
