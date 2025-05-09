import { useState, useEffect } from "react";
import {
  Wallet,
  CreditCard,
  DollarSign,
  PieChart,
  TrendingDown,
} from "lucide-react";
import { TransactionService } from "../../infrastructure/services/TransactionService";
import { getWallets } from "../../infrastructure/services/WalletService"; // Import getWallets
import { motion } from "framer-motion"; // Importing framer-motion for animations
import { CategoryService } from "../../infrastructure/services/CategoryService";
import { RefreshCw } from "lucide-react";
// Main Dashboard Component
export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalBalance: 0,
    monthlySpending: 0,
    walletCount: 0,
    budgetUsage: 0, // Add budget usage to the state
    categories: [],
  });

  // Simulate fetching data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        // Fetch data
        const [wallets, transactions, categories] = await Promise.all([
          getWallets(token),
          TransactionService.getTransactions(token),
          CategoryService.getCategories(token),
        ]);

        console.log("Wallets:", wallets);
        console.log("Transactions:", transactions);
        console.log("Categories:", categories);

        // Calculations
        const totalBalance = wallets.reduce(
          (total, wallet) => total + (wallet.balance || 0),
          0
        );

        const monthlySpending = transactions.reduce((total, tx) => {
          const currentMonth = new Date().getMonth();
          const txMonth = new Date(tx.date).getMonth();
          if (txMonth === currentMonth && tx.type === "expense") {
            total += tx.amount;
          }
          return total;
        }, 0);

        const budgetUsage = totalBalance
          ? (monthlySpending / totalBalance) * 100
          : 0;

        const walletCount = wallets.length;

        // Calculate category breakdown
        const categoryMap = transactions.reduce((acc, tx) => {
          const category = categories.find((c) => c.id === tx.category_id);
          const categoryName = category ? category.name : "Unknown";
          acc[categoryName] = (acc[categoryName] || 0) + tx.amount;
          return acc;
        }, {});

        const categoryData = Object.keys(categoryMap).map((name) => ({
          name,
          amount: categoryMap[name],
          percentage: monthlySpending
            ? (categoryMap[name] / monthlySpending) * 100
            : 0,
        }));

        setDashboardData({
          totalBalance,
          monthlySpending,
          walletCount,
          budgetUsage,
          categories: categoryData,
        });

        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        let errorMessage = "Error loading data";
        if (err.message.includes("token")) {
          errorMessage = "Please log in to view your dashboard";
        } else if (err.message.includes("Failed to fetch")) {
          errorMessage = "Unable to connect to the server";
        }
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

          {/* Dynamic Budget Usage card */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <StatCard
              title="Budget Usage"
              value={`${dashboardData.budgetUsage.toFixed(2)}%`}
              icon={<CreditCard className="h-6 w-6 text-purple-500" />}
              bgColor="bg-purple-50"
              textColor="text-purple-600"
            >
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-purple-600 h-2.5 rounded-full"
                  style={{ width: `${dashboardData.budgetUsage}%` }}
                ></div>
              </div>
            </StatCard>
          </motion.div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Category Breakdown
            </h2>
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
                index={index}
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
        <div className="p-2 rounded-full bg-white shadow">{icon}</div>
      </div>
      {children}
    </div>
  );
}

// CategoryItem component with dynamic color generation
function CategoryItem({ name, amount, percentage, index }) {
  // Dynamic color generation function
  const getColorClass = (categoryName, index) => {
    // Predefined colors for common categories (fallback)
    const commonCategories = {
      Food: "bg-blue-500",
      Entertainment: "bg-green-500",
      Transportation: "bg-yellow-500",
      Bills: "bg-red-500",
      Shopping: "bg-purple-500",
      Healthcare: "bg-indigo-500",
      Education: "bg-pink-500",
      Housing: "bg-orange-500"
    };
    
    // If the category is a common one, use its predefined color
    if (commonCategories[categoryName]) {
      return commonCategories[categoryName];
    }
    
    // Otherwise, generate a color based on the category name or index
    const colorOptions = [
      "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-red-500", 
      "bg-purple-500", "bg-indigo-500", "bg-pink-500", "bg-orange-500",
      "bg-teal-500", "bg-cyan-500", "bg-lime-500", "bg-amber-500"
    ];
    
    // Use the string's characters to generate a consistent index for the same category name
    if (categoryName) {
      // Simple hash function to convert string to number
      const hashCode = categoryName.split('').reduce(
        (acc, char) => acc + char.charCodeAt(0), 0
      );
      
      // Use modulo to get an index within our color array range
      return colorOptions[hashCode % colorOptions.length];
    }
    
    // Fallback to using the index in the category list
    return colorOptions[index % colorOptions.length] || "bg-gray-500";
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center">
          <div
            className={`h-3 w-3 rounded-full ${getColorClass(name, index)} mr-2`}
          ></div>
          <span className="font-medium">{name}</span>
        </div>
        <div className="text-gray-700">${amount.toLocaleString()}</div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className={`${getColorClass(name, index)} h-1.5 rounded-full`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}