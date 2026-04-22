import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default async function ProductsPage() {
  const { data: products, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      sku,
      price,
      stock_quantity,
      low_stock_threshold,
      categories (
        name
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    return <div className="p-6">Error loading products</div>
  }

  const safeProducts = products ?? []

  const totalProducts = safeProducts.length
  const lowStockCount = safeProducts.filter(
    (product) => product.stock_quantity <= product.low_stock_threshold
  ).length
  const totalValuation = safeProducts.reduce((sum, product) => {
    return sum + Number(product.price) * product.stock_quantity
  }, 0)

  const activeCategories = new Set(
    safeProducts
      .map((product) => product.categories?.[0]?.name)
      .filter(Boolean)
  ).size

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              Inventory Overview
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
              Products
            </h1>
          </div>

          <Link
            href="/products/new"
            className="rounded-xl bg-zinc-800 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-700"
          >
            + New Product
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Total Catalog
            </p>
            <p className="mt-3 text-4xl font-bold text-gray-900">
              {totalProducts}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Low Stock Alert
            </p>
            <p className="mt-3 text-4xl font-bold text-gray-900">
              {lowStockCount}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Total Valuation
            </p>
            <p className="mt-3 text-4xl font-bold text-gray-900">
              ${totalValuation.toFixed(2)}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Active Categories
            </p>
            <p className="mt-3 text-4xl font-bold text-gray-900">
              {activeCategories}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {safeProducts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No products found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr className="text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-6 py-4 font-semibold">Product</th>
                    <th className="px-6 py-4 font-semibold">SKU</th>
                    <th className="px-6 py-4 font-semibold">Category</th>
                    <th className="px-6 py-4 font-semibold">Price</th>
                    <th className="px-6 py-4 font-semibold">Stock</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {safeProducts.map((product) => {
                    const isLowStock =
                      product.stock_quantity <= product.low_stock_threshold

                    return (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">
                            {product.name}
                          </p>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {product.sku}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {product.categories?.[0]?.name ?? "Uncategorized"}
                        </td>

                        <td className="px-6 py-4 text-sm font-medium text-gray-800">
                          ${Number(product.price).toFixed(2)}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {product.stock_quantity}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={
                              isLowStock
                                ? "inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700"
                                : "inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
                            }
                          >
                            {isLowStock ? "Low Stock" : "In Stock"}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}