import { getCategories } from "@/app/lib/api";
import CategoryCard from "@/app/components/CategoryCard";
import Link from "next/link";

export const metadata = {
  title: "All Categories — FreshCart",
  description: "Browse our wide range of product categories",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  

  return (
    <main className="min-h-screen bg-gray-50/50">
      {/* Header */}
<section className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 text-white">
  <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
    
    {/* Breadcrumb */}
    <nav className="flex items-center gap-2 text-sm text-white/70 mb-6">
      <Link href="/" className="hover:text-white transition-colors">
        Home
      </Link>
      <span>/</span>
      <span className="text-white">Categories</span>
    </nav>

    {/* Header */}
    <div className="flex items-center gap-5">
      
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-xl ring-1 ring-white/30">
        <svg
          className="w-8 h-8 text-white"
          viewBox="0 0 512 512"
          fill="currentColor"
        >
          <path d="M232.5 5.2c14.9-6.9 32.1-6.9 47 0l218.6 101c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L13.9 149.8C5.4 145.8 0 137.3 0 128s5.4-17.9 13.9-21.8L232.5 5.2zM48.1 218.4l164.3 75.9c27.7 12.8 59.6 12.8 87.3 0l164.3-75.9 34.1 15.8c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L13.9 277.8C5.4 273.8 0 265.3 0 256s5.4-17.9 13.9-21.8l34.1-15.8zM13.9 362.2l34.1-15.8 164.3 75.9c27.7 12.8 59.6 12.8 87.3 0l164.3-75.9 34.1 15.8c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L13.9 405.8C5.4 401.8 0 393.3 0 384s5.4-17.9 13.9-21.8z" />
        </svg>
      </div>

      {/* Text */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          All Categories
        </h1>
        <p className="text-white/80 mt-1">
          Browse our wide range of product categories
        </p>
      </div>

    </div>
  </div>
</section>


      {/* Categories Grid */}
      
      <section className=" container mx-auto px-4 py-10">
        <div className="
         grid
          grid-cols-2
           sm:grid-cols-3
            md:grid-cols-4
             lg:grid-cols-5
              gap-4
               sm:gap-6
        ">
          {categories.map((cat) => (
            <CategoryCard key={cat._id} category={cat} />
          ))}
        </div>
      </section>

      
    </main>
  );
}
