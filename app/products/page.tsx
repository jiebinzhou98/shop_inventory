import { supabase } from "@/lib/supabase";

export default async function ProductsPage() {

  //schema to connect the backend products table
  const {data: products,  error} = await supabase
    .from('products')
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

  if(error){
    return<div>Error loading products</div>
  }

  return(
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      {!products || products.length === 0 ? (
        <p>No products found</p>
      ): (
        <ul className="space-y-3">
          {products.map((product) => {
            const isLowStock = product.stock_quantity <= product.low_stock_threshold

            return(
              <li key={product.id} className="border rounded p-4">
                <p>{product.name}</p>
                <p>SKU:{product.sku}</p>
                <p>Category: {product.categories?.[0]?.name ?? "Uncategorized"}</p>
                <p>Price: ${product.price}</p>
                <p>Stock: {product.stock_quantity}</p>
                <p>Status: {isLowStock ? "Low Stock" : "In Stock"}</p>
              </li>
            )
          })}
        </ul>
      )}
    </main>
  )
}