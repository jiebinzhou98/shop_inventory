"use client"

import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useState } from "react"

export default function NewCategoryPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!name.trim()) {
      alert("Please enter a category name")
      return
    }

    setLoading(true)

    const { error } = await supabase.from("categories").insert([
      {
        name: name.trim(),
        description: description.trim() || null,
      },
    ])

    setLoading(false)

    if (error) {
      alert(error.message ?? "Failed to create category")
      return
    }

    alert("Category created successfully")
    router.push("/categories")
  }

  const previewName = name.trim() || "New Category"
  const previewDescription =
    description.trim() ||
    "Your category description will appear here to help organize products in your inventory."

  return (
    <main className="min-h-screen bg-[#f6f7fb] px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">
            Inventory Taxonomy
          </p>

          <h1 className="mt-3 text-5xl font-bold tracking-tight text-[#111827]">
            Categories
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-500">
            Create a category to organize products more clearly across your
            inventory dashboard.
          </p>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.02fr_1.18fr]">
          <div className="rounded-[28px] border border-gray-200 bg-white p-8 shadow-sm">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight text-[#111827]">
                Define New Category
              </h2>
              <p className="mt-3 max-w-md text-base leading-7 text-gray-500">
                Set the foundation for your inventory classification.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-10 space-y-7">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Modern Ceramics"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-3 h-14 w-full rounded-2xl border border-gray-200 bg-[#f7f8fb] px-5 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Category Description
                </label>
                <textarea
                  placeholder="Describe the purpose or theme of this category..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="mt-3 w-full resize-none rounded-2xl border border-gray-200 bg-[#f7f8fb] px-5 py-4 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-300"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-14 w-full items-center justify-center rounded-2xl bg-[#2f2d39] px-6 text-base font-semibold text-white shadow-sm transition hover:bg-[#26242f] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Category →"}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-2xl text-indigo-700">
                  {previewName.charAt(0).toUpperCase()}
                </div>

                <span className="rounded-full bg-violet-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">
                  Preview
                </span>
              </div>

              <div className="mt-8">
                <h2 className="text-4xl font-semibold tracking-tight text-[#111827]">
                  {previewName}
                </h2>

                <p className="mt-4 max-w-2xl text-base leading-8 text-gray-500">
                  {previewDescription}
                </p>
              </div>

              <div className="mt-10 flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-500">
                  0 Products
                </p>
                <button
                  type="button"
                  className="text-2xl leading-none text-gray-400"
                >
                  •••
                </button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-[28px] border border-gray-200 bg-white p-7 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl text-slate-600">
                  i
                </div>

                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-[#111827]">
                    Naming Tip
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-gray-500">
                    Keep category names short, clear, and easy to scan in tables
                    and dropdowns.
                  </p>
                </div>
              </div>

              <div className="rounded-[28px] border border-gray-200 bg-white p-7 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-xl text-slate-600">
                  ✓
                </div>

                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-[#111827]">
                    Why It Matters
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-gray-500">
                    Categories help product creation, filtering, reporting, and
                    future inventory organization.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-3xl font-semibold text-gray-500">
                +
              </div>

              <h3 className="mt-8 text-3xl font-semibold tracking-tight text-[#111827]">
                Ready to organize
              </h3>

              <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-gray-500">
                Once created, this category can be assigned to products and used
                throughout your dashboard.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}