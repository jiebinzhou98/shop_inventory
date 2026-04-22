"use client"

import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { useEffect, useState } from "react"

type Category = {
  id: string
  name: string
}

export default function CreateProductForm() {
  const [name, setName] = useState("")
  const [sku, setSku] = useState("")
  const [price, setPrice] = useState("")
  const [stock_quantity, setStockQuantity] = useState("")
  const [low_stock_threshold, setLowStockThreshold] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryId, setCategoryId] = useState("")

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Failed to fetch categories:", error)
        return
      }

      setCategories(data || [])
    }

    fetchCategories()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !sku || !price) {
      alert("Please fill in name, sku, and price")
      return
    }

    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name,
          sku,
          price: Number(price),
          stock_quantity: stock_quantity ? Number(stock_quantity) : 0,
          low_stock_threshold: low_stock_threshold
            ? Number(low_stock_threshold)
            : 5,
          category_id: categoryId || null,
        },
      ])
      .select()

    if (error) {
      console.log("insert error:", JSON.stringify(error, null, 2))
      console.log("raw error:", error)
      alert(error.message ?? "Failed to create product")
      return
    }

    console.log("created product:", data)
    alert("Product created successfully")
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="space-y-3">
          <span className="inline-flex rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-gray-600">
            Inventory Management
          </span>

          <div className="space-y-2">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900">
              New Product
            </h1>
            <p className="max-w-2xl text-lg text-gray-600">
              Create a new entry in your catalog. Fill in the details below to
              initialize stock levels and pricing.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                  Product Name
                </label>
                <input
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:bg-white"
                  placeholder="e.g. Minimalist Ceramic Vase"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                  SKU Identification
                </label>
                <input
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:bg-white"
                  placeholder="SKU-8829-XL"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                  Category Classification
                </label>
                <select
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:bg-white"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                  Listing Price (USD)
                </label>
                <input
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:bg-white"
                  type="number"
                  placeholder="$ 0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-600">
                Stock Configuration
              </h2>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                    Initial Stock Quantity
                  </label>
                  <input
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:bg-white"
                    type="number"
                    placeholder="0"
                    value={stock_quantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase tracking-wide text-gray-600">
                    Low Stock Threshold
                  </label>
                  <input
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:bg-white"
                    type="number"
                    placeholder="5"
                    value={low_stock_threshold}
                    onChange={(e) => setLowStockThreshold(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    System will trigger alert when stock falls below this number.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <Link
                href="/products"
                className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="rounded-xl bg-zinc-800 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-700"
              >
                Save Product
              </button>
            </div>
          </form>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-900">Smart SKU</p>
            <p className="mt-2 text-sm text-gray-600">
              Leave SKU empty later if you want to auto-generate based on
              category rules.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-900">Live Preview</p>
            <p className="mt-2 text-sm text-gray-600">
              Product will be available in your inventory list immediately after
              saving.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-900">Validation</p>
            <p className="mt-2 text-sm text-gray-600">
              Name, SKU, and price are required before the product can be saved.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}