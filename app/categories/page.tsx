import Link from "next/link"
import { supabase } from "@/lib/supabase"

type CategoryRow = {
  id: string
  name: string
  description: string | null
  created_at: string
  products: { count: number }[] | null
}

const accentStyles = [
  "bg-indigo-100 text-indigo-700",
  "bg-violet-100 text-violet-700",
  "bg-rose-100 text-rose-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-sky-100 text-sky-700",
]

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase()
}

export default async function CategoriesPage() {
  const { data: categories, error } = await supabase
    .from("categories")
    .select(`
      id,
      name,
      description,
      created_at,
      products(count)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    return (
      <main className="min-h-screen bg-[#f6f7fb] px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[28px] border border-gray-200 bg-white p-8 shadow-sm">
            <h1 className="text-lg font-semibold text-gray-900">
              Failed to load categories
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Please try again later.
            </p>
          </div>
        </div>
      </main>
    )
  }

  const safeCategories = (categories ?? []) as CategoryRow[]

  const totalCategories = safeCategories.length
  const categoriesWithProducts = safeCategories.filter(
    (category) => (category.products?.[0]?.count ?? 0) > 0
  ).length
  const totalProductsAcrossCategories = safeCategories.reduce((sum, category) => {
    return sum + (category.products?.[0]?.count ?? 0)
  }, 0)

  return (
    <main className="min-h-screen bg-[#f6f7fb] px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">
              Inventory Taxonomy
            </p>
            <h1 className="mt-3 text-5xl font-bold tracking-tight text-[#111827]">
              Product Categories
            </h1>
            <p className="mt-4 text-lg leading-8 text-gray-500">
              Organize your shop&apos;s offerings by functional groups and keep
              inventory easier to browse, manage, and report.
            </p>
          </div>

          <Link
            href="/categories/new"
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#2f2d39] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#26242f]"
          >
            + New Category
          </Link>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-gray-200 bg-white px-6 py-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
              Total Categories
            </p>
            <p className="mt-5 text-5xl font-bold tracking-tight text-[#111827]">
              {totalCategories}
            </p>
          </div>

          <div className="rounded-[24px] border border-gray-200 bg-white px-6 py-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
              Categories In Use
            </p>
            <p className="mt-5 text-5xl font-bold tracking-tight text-[#111827]">
              {categoriesWithProducts}
            </p>
          </div>

          <div className="rounded-[24px] border border-gray-200 bg-white px-6 py-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
              Total SKUs Tagged
            </p>
            <p className="mt-5 text-5xl font-bold tracking-tight text-[#111827]">
              {totalProductsAcrossCategories}
            </p>
          </div>
        </section>

        {safeCategories.length === 0 ? (
          <section className="rounded-[28px] border border-dashed border-gray-300 bg-white px-6 py-20 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-[#111827]">
              No categories yet
            </h2>
            <p className="mt-3 text-sm text-gray-500">
              Create your first category to start organizing products in your
              inventory dashboard.
            </p>
            <Link
              href="/categories/new"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-2xl bg-[#2f2d39] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#26242f]"
            >
              Add Category
            </Link>
          </section>
        ) : (
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {safeCategories.map((category, index) => {
              const productCount = category.products?.[0]?.count ?? 0
              const accent = accentStyles[index % accentStyles.length]

              return (
                <div
                  key={category.id}
                  className="group rounded-[28px] border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-bold ${accent}`}
                    >
                      {getInitial(category.name)}
                    </div>

                    <span className="text-4xl font-semibold tracking-tight text-gray-100">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="mt-10">
                    <h2 className="text-3xl font-semibold leading-tight text-[#111827]">
                      {category.name}
                    </h2>

                    <p className="mt-4 min-h-[84px] text-sm leading-7 text-gray-500">
                      {category.description || "No description added yet."}
                    </p>
                  </div>

                  <div className="mt-8 border-t border-gray-100 pt-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                          Total SKUs
                        </p>
                        <p className="mt-2 text-4xl font-bold tracking-tight text-[#111827]">
                          {productCount}
                        </p>
                      </div>

                      <Link
                        href={`/categories/${category.id}`}
                        className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-xl text-gray-600 transition hover:bg-gray-100"
                      >
                        →
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}

            <Link
              href="/categories/new"
              className="flex min-h-[380px] flex-col items-center justify-center rounded-[28px] border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm transition hover:border-gray-400 hover:bg-gray-50"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-3xl font-semibold text-[#111827]">
                +
              </div>

              <h2 className="mt-8 text-2xl font-semibold text-[#111827]">
                Expansion
              </h2>

              <p className="mt-3 max-w-[220px] text-sm leading-6 text-gray-500">
                New market segment? Create a container for your next product
                group.
              </p>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                Define Category
              </p>
            </Link>
          </section>
        )}
      </div>
    </main>
  )
}