import Link from "next/link"
import { supabase } from "@/lib/supabase"

function formatDate(dateString: string) {
  const date = new Date(dateString)

  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

function formatTime(dateString: string) {
  const date = new Date(dateString)

  return new Intl.DateTimeFormat("en-CA", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
}

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

    return (
      <main className="min-h-screen bg-[#f6f7fb] px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[28px] border border-gray-200 bg-white p-8 shadow-sm">
            <h1 className="text-lg font-semibold text-gray-900">
              Failed to load transactions
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Please try again later.
            </p>
          </div>
        </div>
      </main>
    )
  }

  const safeTransactions = transactions ?? []

  const totalTransactions = safeTransactions.length

  const stockInCount = safeTransactions.filter(
    (transaction) => transaction.quantity_change > 0
  ).length

  const stockOutCount = safeTransactions.filter(
    (transaction) => transaction.quantity_change < 0
  ).length

  const totalUnitsMoved = safeTransactions.reduce((sum, transaction) => {
    return sum + Math.abs(transaction.quantity_change)
  }, 0)

  return (
    <main className="min-h-screen bg-[#f6f7fb] px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">
              Inventory Activity
            </p>
            <h1 className="mt-3 text-5xl font-bold tracking-tight text-[#111827]">
              Transactions
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-500">
              Track stock movement across your catalog, including restocks,
              sales, and manual quantity adjustments.
            </p>
          </div>

          <Link
            href="/transactions/new"
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#2f2d39] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#26242f]"
          >
            + New Transaction
          </Link>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[24px] border border-gray-200 bg-white px-6 py-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
              Total Transactions
            </p>
            <p className="mt-5 text-5xl font-bold tracking-tight text-[#111827]">
              {totalTransactions}
            </p>
          </div>

          <div className="rounded-[24px] border border-gray-200 bg-white px-6 py-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
              Stock In
            </p>
            <p className="mt-5 text-5xl font-bold tracking-tight text-emerald-600">
              {stockInCount}
            </p>
          </div>

          <div className="rounded-[24px] border border-gray-200 bg-white px-6 py-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
              Stock Out
            </p>
            <p className="mt-5 text-5xl font-bold tracking-tight text-rose-600">
              {stockOutCount}
            </p>
          </div>

          <div className="rounded-[24px] border border-gray-200 bg-white px-6 py-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
              Units Moved
            </p>
            <p className="mt-5 text-5xl font-bold tracking-tight text-[#111827]">
              {totalUnitsMoved}
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-5">
            <h2 className="text-[15px] font-semibold text-[#111827]">
              All Transactions
            </h2>

            <Link
              href="/transactions/new"
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              Add Transaction
            </Link>
          </div>

          {safeTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <h3 className="text-lg font-semibold text-[#111827]">
                No transactions yet
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Start recording stock movement to build your inventory history.
              </p>
              <Link
                href="/transactions/new"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-2xl bg-[#2f2d39] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#26242f]"
              >
                Add Transaction
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-t border-b border-gray-200 bg-[#fafafa]">
                  <tr className="text-left text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Change</th>
                    <th className="px-6 py-4">Note</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {safeTransactions.map((transaction) => {
                    const productName =
                      transaction.products?.[0]?.name ?? "Unknown Product"

                    const quantity = transaction.quantity_change
                    const isPositive = quantity > 0
                    const isNegative = quantity < 0

                    const normalizedType =
                      transaction.type.charAt(0).toUpperCase() +
                      transaction.type.slice(1)

                    return (
                      <tr
                        key={transaction.id}
                        className="border-b border-gray-100 transition hover:bg-[#fcfcfd]"
                      >
                        <td className="px-6 py-5">
                          <div>
                            <p className="text-base font-semibold text-[#111827]">
                              {productName}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={
                              transaction.type === "restock"
                                ? "inline-flex rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700"
                                : transaction.type === "sale"
                                ? "inline-flex rounded-full bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-700"
                                : "inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700"
                            }
                          >
                            {normalizedType}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <p
                            className={
                              isPositive
                                ? "text-base font-semibold text-emerald-600"
                                : isNegative
                                ? "text-base font-semibold text-rose-600"
                                : "text-base font-semibold text-slate-600"
                            }
                          >
                            {isPositive ? "+" : ""}
                            {quantity}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <p className="max-w-[320px] text-sm leading-6 text-gray-500">
                            {transaction.note?.trim() || "—"}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <div>
                            <p className="text-sm font-medium text-[#111827]">
                              {formatDate(transaction.created_at)}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                              {formatTime(transaction.created_at)}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}