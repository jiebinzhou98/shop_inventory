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
    return (
      <main className="min-h-screen bg-[#f6f7fb] px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[24px] border border-gray-200 bg-white p-8 shadow-sm">
            <h1 className="text-lg font-semibold text-gray-900">
              Error loading products
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Please try again later.
            </p>
          </div>
        </div>
      </main>
    )
  }

  const safeProducts = products ?? []

  const totalProducts = safeProducts.length

  const lowStockCount = safeProducts.filter(
    (product) =>
      product.stock_quantity > 0 &&
      product.stock_quantity <= product.low_stock_threshold
  ).length

  const outOfStockCount = safeProducts.filter(
    (product) => product.stock_quantity === 0
  ).length

  const activeCategories = new Set(
    safeProducts
      .map((product) => product.categories?.[0]?.name)
      .filter(Boolean)
  ).size

  return (
    <main className="min-h-screen bg-[#f6f7fb] px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">
              Inventory Overview
            </p>
            <h1 className="mt-3 text-5xl font-bold tracking-tight text-[#111827]">
              Products
            </h1>
          </div>

          <Link
            href="/products/new"
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#2f2d39] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#26242f]"
          >
            + New Product
          </Link>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[24px] border border-gray-200 bg-white px-6 py-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
              Total Catalog
            </p>
            <p className="mt-5 text-5xl font-bold tracking-tight text-[#111827]">
              {totalProducts}
            </p>
          </div>

          <div className="rounded-[24px] border border-gray-200 bg-white px-6 py-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
              Low Stock Alert
            </p>
            <p className="mt-5 text-5xl font-bold tracking-tight text-[#111827]">
              {lowStockCount}
            </p>
          </div>

          <div className="rounded-[24px] border border-gray-200 bg-white px-6 py-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
              Out of Stock
            </p>
            <p className="mt-5 text-5xl font-bold tracking-tight text-[#111827]">
              {outOfStockCount}
            </p>
          </div>

          <div className="rounded-[24px] border border-gray-200 bg-white px-6 py-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
              Active Categories
            </p>
            <p className="mt-5 text-5xl font-bold tracking-tight text-[#111827]">
              {activeCategories}
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-5">
            <h2 className="text-[15px] font-semibold text-[#111827]">
              All Products
            </h2>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Export
              </button>
            </div>
          </div>

          {safeProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <h3 className="text-lg font-semibold text-[#111827]">
                No products yet
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Start by adding your first inventory item.
              </p>
              <Link
                href="/products/new"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-2xl bg-[#2f2d39] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#26242f]"
              >
                Add Product
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-t border-gray-200 border-b border-gray-200 bg-[#fafafa]">
                  <tr className="text-left text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
                    <th className="px-6 py-4">Product Details</th>
                    <th className="px-6 py-4">SKU</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {safeProducts.map((product) => {
                    const categoryName =
                      product.categories?.[0]?.name ?? "Uncategorized"

                    const isOutOfStock = product.stock_quantity === 0
                    const isLowStock =
                      product.stock_quantity > 0 &&
                      product.stock_quantity <= product.low_stock_threshold

                    return (
                      <tr
                        key={product.id}
                        className="border-b border-gray-100 transition hover:bg-[#fcfcfd]"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-gray-200" />
                            <div>
                              <p className="text-base font-semibold text-[#111827]">
                                {product.name}
                              </p>
                              <p className="mt-1 text-sm text-gray-500">
                                {categoryName}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-sm font-medium text-gray-600">
                          {product.sku}
                        </td>

                        <td className="px-6 py-5">
                          <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                            {categoryName}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-base font-semibold text-[#111827]">
                          ${Number(product.price).toFixed(2)}
                        </td>

                        <td className="px-6 py-5">
                          <div>
                            <p
                              className={
                                isOutOfStock
                                  ? "text-base font-semibold text-red-600"
                                  : isLowStock
                                  ? "text-base font-semibold text-amber-600"
                                  : "text-base font-semibold text-[#111827]"
                              }
                            >
                              {product.stock_quantity}
                            </p>
                            <p className="mt-1 text-xs font-medium text-gray-400">
                              L: {product.low_stock_threshold}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={
                              isOutOfStock
                                ? "inline-flex rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700"
                                : isLowStock
                                ? "inline-flex rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700"
                                : "inline-flex rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700"
                            }
                          >
                            {isOutOfStock
                              ? "Out of Stock"
                              : isLowStock
                              ? "Low Stock"
                              : "In Stock"}
                          </span>
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