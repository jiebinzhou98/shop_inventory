'use client'

import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useState } from "react"

export default function NewCategoryPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if(!name){
      alert("Please enter a category name")
      return 
    }

    const {error} = await supabase.from("categories").insert([
      {
        name,
        description: description || null,
      },
    ])

    if(error){
      alert(error.message ?? "Failed to create category")
      return
    }
    alert("Category created successfully")
    router.push("/categories")
  }

  return(
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Category</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block mb-1 font-medium">Category Name</label>
          <input
            className="w-full border rounded px-3 py-2"
            type="text"
            placeholder="e.g. Drinks"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            placeholder="Optional description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button type="submit" className="px-4 py-2 rounded bg-black text-white">
          Create Category
        </button>
      </form>
    </main>
  )
}