import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";

export default function TransactionsSection({
  txs,
  wallets,
  categories,
  handleEdit,
  handleDelete,
}) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text">
        Your Transactions
      </h2>

      {txs.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No transactions found.</p>
          <p className="text-gray-400">Add a transaction to get started!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {txs.map((tx) => {
            const wallet = wallets.find((w) => w.id === tx.account_id);
            const category = categories.find((c) => c.id === tx.category_id);

            return (
              <div
                key={tx.id}
                className="p-6 bg-white rounded-xl shadow-lg border-l-4 border-indigo-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                role="article"
                aria-labelledby={`transaction-${tx.id}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3
                      id={`transaction-${tx.id}`}
                      className="text-lg font-semibold text-gray-800"
                    >
                      {tx.payee || "Unnamed Transaction"}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                          tx.type === "income"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                      </span>
                      <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {category?.name || "Unknown"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      Date:{" "}
                      {new Date(tx.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                      <br />
                      Wallet:{" "}
                      <span className="font-medium text-indigo-600">
                        {wallet?.name || "Unknown"}
                      </span>
                    </p>
                    {tx.notes && (
                      <p className="mt-2 text-sm text-gray-500 italic">
                        Notes: {tx.notes}
                      </p>
                    )}
                    {tx.frequency && (
                      <p className="mt-1 text-sm text-gray-500">
                        Recurring: {tx.frequency} until{" "}
                        {new Date(tx.end_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-6">
                    <span
                      className={`text-lg font-bold ${
                        tx.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {tx.type === "income" ? "+" : "-"}${tx.amount.toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleEdit(tx)}
                      className="group flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                      aria-label={`Edit transaction ${
                        tx.payee || "ID " + tx.id
                      }`}
                    >
                      <PencilSquareIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(tx.id)}
                      className="group flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors"
                      aria-label={`Delete transaction ${
                        tx.payee || "ID " + tx.id
                      }`}
                    >
                      <TrashIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      <span className="text-sm">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
