"use client"

import { supabase } from "@/lib/supabase"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

type Product = {
  id: string
  name: string
  stock_quantity: number
}

export default function NewTransactionPage() {
  const router = useRouter()

  const [products, setProducts] = useState<Product[]>([])
  const [productId, setProductId] = useState("")
  const [type, setType] = useState("")
  const [quantityChange, setQuantityChange] = useState("")
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingProducts, setLoadingProducts] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true)

      const { data, error } = await supabase
        .from("products")
        .select("id, name, stock_quantity")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Failed to fetch products:", error)
        setLoadingProducts(false)
        return
      }

      setProducts(data || [])
      setLoadingProducts(false)
    }

    fetchProducts()
  }, [])

  const selectedProduct = useMemo(() => {
    return products.find((product) => product.id === productId) ?? null
  }, [products, productId])

  const numericQuantity = Number(quantityChange || 0)

  const signedPreviewQuantity = useMemo(() => {
    if (!type || !quantityChange) return 0

    if (type === "sale" || type === "damage") {
      return -Math.abs(numericQuantity)
    }

    return Math.abs(numericQuantity)
  }, [type, quantityChange, numericQuantity])

  const updatedStockPreview = useMemo(() => {
    if (!selectedProduct) return null
    return selectedProduct.stock_quantity + signedPreviewQuantity
  }, [selectedProduct, signedPreviewQuantity])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!productId || !type || !quantityChange) {
      alert("Please fill in product, type, and quantity change")
      return
    }

    if (!selectedProduct) {
      alert("Selected product not found")
      return
    }

    const quantity = Number(quantityChange)

    if (!Number.isFinite(quantity) || quantity <= 0) {
      alert("Quantity must be greater than 0")
      return
    }

    const finalChange =
      type === "sale" || type === "damage"
        ? -Math.abs(quantity)
        : Math.abs(quantity)

    const newStock = selectedProduct.stock_quantity + finalChange

    if (newStock < 0) {
      alert("Stock cannot go below 0")
      return
    }

    setLoading(true)

    const { error: transactionError } = await supabase
      .from("inventory_transactions")
      .insert([
        {
          product_id: productId,
          type,
          quantity_change: finalChange,
          note: note.trim() || null,
        },
      ])

    if (transactionError) {
      setLoading(false)
      alert(transactionError.message ?? "Failed to create transaction")
      return
    }

    const { error: productError } = await supabase
      .from("products")
      .update({ stock_quantity: newStock })
      .eq("id", productId)

    if (productError) {
      setLoading(false)
      alert(
        productError.message ??
          "Transaction saved, but failed to update product stock"
      )
      return
    }

    setLoading(false)
    alert("Transaction created successfully")
    router.push("/transactions")
  }

  const previewProductName = selectedProduct?.name || "Select a product"
  const previewCurrentStock = selectedProduct?.stock_quantity ?? 0
  const previewType = type || "Transaction Type"
  const previewNote =
    note.trim() || "An optional note will appear here for transaction history."

  return (
    <main className="min-h-screen bg-[#f6f7fb] px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">
            Inventory Activity
          </p>

          <h1 className="mt-3 text-5xl font-bold tracking-tight text-[#111827]">
            Transactions
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-500">
            Record product movement and keep stock levels accurate across your
            inventory dashboard.
          </p>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.02fr_1.18fr]">
          <div className="rounded-[28px] border border-gray-200 bg-white p-8 shadow-sm">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-[#111827]">
                Create Transaction
              </h2>
              <p className="mt-3 max-w-md text-base leading-7 text-gray-500">
                Record a stock movement for one of your existing products.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-10 space-y-7">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Product
                </label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="mt-3 h-14 w-full rounded-2xl border border-gray-200 bg-[#f7f8fb] px-5 text-base text-gray-900 outline-none transition focus:border-gray-300"
                >
                  <option value="">
                    {loadingProducts ? "Loading products..." : "Select product"}
                  </option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Transaction Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="mt-3 h-14 w-full rounded-2xl border border-gray-200 bg-[#f7f8fb] px-5 text-base text-gray-900 outline-none transition focus:border-gray-300"
                >
                  <option value="">Select transaction type</option>
                  <option value="restock">Restock</option>
                  <option value="adjustment">Adjustment</option>
                  <option value="damage">Damage</option>
                  <option value="sale">Sale</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="Enter quantity"
                  value={quantityChange}
                  onChange={(e) => setQuantityChange(e.target.value)}
                  className="mt-3 h-14 w-full rounded-2xl border border-gray-200 bg-[#f7f8fb] px-5 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-300"
                />
                <p className="mt-2 text-sm text-gray-400">
                  Sale and damage will reduce stock automatically. Restock and
                  adjustment will increase stock.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Note
                </label>
                <textarea
                  placeholder="Optional note for this transaction..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={5}
                  className="mt-3 w-full resize-none rounded-2xl border border-gray-200 bg-[#f7f8fb] px-5 py-4 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-300"
                />
              </div>

              <button
                type="submit"
                disabled={loading || loadingProducts}
                className="inline-flex h-14 w-full items-center justify-center rounded-2xl bg-[#2f2d39] px-6 text-base font-semibold text-white shadow-sm transition hover:bg-[#26242f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Transaction →"}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between">
                <div
                  className={
                    type === "restock"
                      ? "flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-2xl text-emerald-700"
                      : type === "sale"
                      ? "flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-2xl text-rose-700"
                      : type === "damage"
                      ? "flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-2xl text-amber-700"
                      : "flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-600"
                  }
                >
                  {type === "restock"
                    ? "+"
                    : type === "sale"
                    ? "−"
                    : type === "damage"
                    ? "!"
                    : "↺"}
                </div>

                <span className="rounded-full bg-violet-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">
                  Preview
                </span>
              </div>

              <div className="mt-8">
                <h2 className="text-4xl font-semibold tracking-tight text-[#111827]">
                  {previewProductName}
                </h2>

                <p className="mt-4 text-base leading-8 text-gray-500">
                  {previewNote}
                </p>
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-[#f7f8fb] px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                    Type
                  </p>
                  <p className="mt-3 text-lg font-semibold text-[#111827] capitalize">
                    {previewType}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#f7f8fb] px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                    Current Stock
                  </p>
                  <p className="mt-3 text-lg font-semibold text-[#111827]">
                    {previewCurrentStock}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#f7f8fb] px-5 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                    Change
                  </p>
                  <p
                    className={
                      signedPreviewQuantity > 0
                        ? "mt-3 text-lg font-semibold text-emerald-600"
                        : signedPreviewQuantity < 0
                        ? "mt-3 text-lg font-semibold text-rose-600"
                        : "mt-3 text-lg font-semibold text-slate-600"
                    }
                  >
                    {signedPreviewQuantity > 0 ? "+" : ""}
                    {signedPreviewQuantity}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-gray-200 bg-white px-5 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                  Updated Stock Preview
                </p>
                <p
                  className={
                    updatedStockPreview !== null && updatedStockPreview < 0
                      ? "mt-3 text-3xl font-bold tracking-tight text-rose-600"
                      : "mt-3 text-3xl font-bold tracking-tight text-[#111827]"
                  }
                >
                  {updatedStockPreview ?? "—"}
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-[28px] border border-gray-200 bg-white p-7 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl text-slate-600">
                  i
                </div>

                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-[#111827]">
                    Stock Rule
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-gray-500">
                    Transactions that reduce inventory cannot make stock go below
                    zero.
                  </p>
                </div>
              </div>

              <div className="rounded-[28px] border border-gray-200 bg-white p-7 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl text-slate-600">
                  ✓
                </div>

                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-[#111827]">
                    History Log
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-gray-500">
                    Every transaction creates an activity record and updates the
                    related product stock.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-3xl font-semibold text-gray-500">
                ↗
              </div>

              <h3 className="mt-8 text-3xl font-semibold tracking-tight text-[#111827]">
                Inventory stays accurate
              </h3>

              <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-gray-500">
                Use transactions to maintain a clean movement history and keep
                your product stock aligned with real activity.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}