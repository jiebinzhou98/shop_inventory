import { supabase } from "@/lib/supabase"

export default async function TransactionPage() {
  const { data: transactions, error } = await supabase
    .from("inventory_transactions")
    .select(`
      id,
      type,
      quantity_change,
      note,
      created_at,
      products!inventory_transactions_product_id_fkey (
        name
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.log("transactions error:", error)
    return <div>Failed to load transactions</div>
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Inventory Transactions</h1>

      {!transactions || transactions.length === 0 ? (
        <p>No transactions found</p>
      ) : (
        <ul className="space-y-3">
          {transactions.map((transaction) => (
            <li
              key={transaction.id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <p className="font-semibold">
                Product: {transaction.products?.[0]?.name ?? "Unknown Product"}
              </p>
              <p>Type: {transaction.type}</p>
              <p>Quantity Change: {transaction.quantity_change}</p>
              <p>Note: {transaction.note || "No note"}</p>
              <p>Created At: {transaction.created_at}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}