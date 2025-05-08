import { useState, useEffect } from "react";
import {
  CalendarDays,
  DollarSign,
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";

export default function BudgetForecastDashboard() {
  const [forecastData, setForecastData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: "2025-05-01",
    endDate: "2025-05-07",
  });

  useEffect(() => {
    fetchForecastData();
  }, [dateRange]);

  const fetchForecastData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const apiUrl = `http://127.0.0.1:8000/api/forecast?start_date=${dateRange.startDate}&end_date=${dateRange.endDate}`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `API request failed with status ${response.status}: ${
            errorData.message || "Unknown error"
          }`
        );
      }

      const data = await response.json();
      setForecastData(data);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching forecast data:", err);
      setError(`Failed to fetch forecast data: ${err.message}`);
      setIsLoading(false);
    }
  };

  const updateDateRange = () => {
    fetchForecastData();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getBalanceChange = () => {
    if (forecastData.length < 2) return { amount: 0, isPositive: true };
    const startBalance = forecastData[0].projected_balance;
    const endBalance = forecastData[forecastData.length - 1].projected_balance;
    const difference = endBalance - startBalance;
    return {
      amount: Math.abs(difference),
      isPositive: difference >= 0,
    };
  };

  const balanceChange = getBalanceChange();
  
  console.log('forecastData:', forecastData);


  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-800">
                Budget Forecast
              </h2>
              <button
                onClick={fetchForecastData}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>

          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={dateRange.startDate}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, startDate: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={dateRange.endDate}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, endDate: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <button
                  onClick={updateDateRange}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>

          {isLoading && (
            <div className="px-6 py-12 text-center">
              <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-blue-500">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading forecast data...
              </div>
            </div>
          )}

          {error && !isLoading && (
            <div className="px-6 py-6 bg-red-50 text-red-700 border-l-4 border-red-500">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {!isLoading && !error && forecastData.length > 0 && (
            <div className="px-6 py-5">
              {/* Display summary stats and forecast table here */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-100 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-800">
                    Projected Balance
                  </h3>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatCurrency(
                      forecastData[forecastData.length - 1].projected_balance
                    )}
                  </p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-green-800">
                    Balance Change
                  </h3>
                  <p
                    className={`text-2xl font-bold flex items-center ${
                      balanceChange.isPositive
                        ? "text-green-900"
                        : "text-red-900"
                    }`}
                  >
                    {balanceChange.isPositive ? (
                      <ArrowUpRight className="w-6 h-6 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-6 h-6 mr-1" />
                    )}
                    {formatCurrency(balanceChange.amount)}
                  </p>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-purple-800">
                    Total Transactions
                  </h3>
                  <p className="text-2xl font-bold text-purple-900">
                    {forecastData.reduce(
                      (sum, day) => sum + (day.transactions?.length || 0),
                      0
                    )}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Projected Balance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transactions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {forecastData.map((day, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {day.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(day.projected_balance)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {day.transactions?.length > 0 ? (
                            <ul className="list-disc list-inside">
                              {day.transactions.map((txn) => (
                                <li key={txn.id}>
                                  {txn.type === "expense"
                                    ? "Expense"
                                    : "Income"}
                                  : {formatCurrency(txn.amount)} (
                                  {txn.frequency})
                                </li>
                              ))}
                            </ul>
                          ) : (
                            "No transactions"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
