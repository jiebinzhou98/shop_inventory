"use client"

import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"

export default function CreateProductForm() {

  type Category = {
    id: string
    name: string
  }

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
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Create Product</h1>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="SKU"
        value={sku}
        onChange={(e) => setSku(e.target.value)}
      />

      <input
        placeholder="Price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <input
        placeholder="Stock Quantity"
        type="number"
        value={stock_quantity}
        onChange={(e) => setStockQuantity(e.target.value)}
      />

      <input
        placeholder="Low Stock Threshold"
        type="number"
        value={low_stock_threshold}
        onChange={(e) => setLowStockThreshold(e.target.value)}
      />

      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
      >
        <option value="">Select category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <button type="submit">Create Product</button>
    </form>
  )
}