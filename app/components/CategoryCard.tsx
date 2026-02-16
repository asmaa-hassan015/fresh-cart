import Link from 'next/link';
import Image from 'next/image';

interface Category {
  _id: string;
  name: string;
  image: string;
  slug?: string;
}

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/products?category=${category._id}`}
      className="group bg-white rounded-2xl border-2 border-gray-200 hover:border-green-500 transition-all duration-300 overflow-hidden hover:shadow-lg hover:scale-105"
    >
      <div className="aspect-square relative bg-gray-50">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover p-4 group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="p-4 text-center border-t-2 border-gray-100 group-hover:border-green-100 group-hover:bg-green-50 transition-colors">
        <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors">
          {category.name}
        </h3>
      </div>
    </Link>
  );
}