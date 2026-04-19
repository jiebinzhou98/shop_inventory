"use client"

import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"

type Product = {
  id: string
  name: string
  stock_quantity: number
}

export default function NewTransactionPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [productId, setProductId] = useState("")
  const [type, setType] = useState("")
  const [quantityChange, setQuantityChange] = useState("")
  const [note, setNote] = useState("")

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, stock_quantity")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Failed to fetch products:", error)
        return
      }

      setProducts(data || [])
    }

    fetchProducts()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!productId || !type || !quantityChange) {
      alert("Please fill in product, type, and quantity change")
      return
    }

    const selectedProduct = products.find((product) => product.id === productId)

    if (!selectedProduct) {
      alert("Selected product not found")
      return
    }

    const change = Number(quantityChange)
    const newStock = selectedProduct.stock_quantity + change

    if (newStock < 0) {
      alert("Stock cannot go below 0")
      return
    }

    const { error: transactionError } = await supabase
      .from("inventory_transactions")
      .insert([
        {
          product_id: productId,
          type,
          quantity_change: change,
          note: note || null,
        },
      ])

    if (transactionError) {
      alert(transactionError.message ?? "Failed to create transaction")
      return
    }

    const { error: productError } = await supabase
      .from("products")
      .update({ stock_quantity: newStock })
      .eq("id", productId)

    if (productError) {
      alert(productError.message ?? "Transaction saved, but failed to update product stock")
      return
    }

    alert("Transaction created successfully")
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">New Inventory Transaction</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select transaction type</option>
          <option value="restock">Restock</option>
          <option value="adjustment">Adjustment</option>
          <option value="damage">Damage</option>
          <option value="sale">Sale</option>
        </select>

        <input
          type="number"
          placeholder="Quantity change"
          value={quantityChange}
          onChange={(e) => setQuantityChange(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <textarea
          placeholder="Optional note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <button
          type="submit"
          className="px-4 py-2 rounded bg-black text-white"
        >
          Create Transaction
        </button>
      </form>
    </main>
  )
}