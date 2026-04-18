import { supabase } from "@/lib/supabase";

export default async function CategoriesPage(){
  const {data: categories, error} = await supabase
    .from("categories")
    .select("*")
    .order("created_at", {ascending: false})
    
  if(error){
    return <div>Failed to load categories</div>
  }

  return(
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>

      {!categories || categories.length === 0 ? (
        <p>No categories found</p>
      ) : (
        <ul className="space-y-3">
          {categories.map((category) => (
            <li key={category.id} className="border rounded p-4">
              <p>{category.name}</p>
              <p>{category.description || "No description"}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}