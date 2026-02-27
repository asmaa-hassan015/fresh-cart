
const BASE_URL= process.env.NEXT_PUBLIC_API_URL;


/* ─── Types ─── */

export interface SubCategory {
    _id: string;
    name: string;
    slug: string;
    category: string;
}

export interface Category {
    _id: string;
    name: string;
    slug: string;
    image: string;
    createdAt: string;
    updatedAt: string;
}

export interface Brand {
    _id: string;
    name: string;
    slug: string;
    image: string;
    createdAt: string;
    updatedAt: string;
}

export interface Product {
    _id: string;
    id: string;
    title: string;
    slug: string;
    description: string;
    price: number;
    quantity: number;
    sold: number;
    imageCover: string;
    images: string[];
    category: Category;
    brand: Brand;
    subcategory: SubCategory[];
    ratingsAverage: number;
    ratingsQuantity: number;
    createdAt: string;
    updatedAt: string;
}

export interface ApiMetadata {
    currentPage: number;
    numberOfPages: number;
    limit: number;
    nextPage?: number;
}

export interface ApiResponse<T> {
    results: number;
    metadata: ApiMetadata;
    data: T[];
}

/* ─── Fetchers ─── */

export async function getProducts(limit?: number): Promise<Product[]> {
    const url = limit
        ? `${BASE_URL}/products?limit=${limit}`
        : `${BASE_URL}/products?limit=40`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("Failed to fetch products");
    const json: ApiResponse<Product> = await res.json();
    return json.data;
    
}

export async function getProduct(id: string): Promise<Product> {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
        next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Failed to fetch product");
    const json = await res.json();
    return json.data;
}

export async function getCategories(): Promise<Category[]> {
    const res = await fetch(`${BASE_URL}/categories`, {
        next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Failed to fetch categories");
    const json: ApiResponse<Category> = await res.json();
    return json.data;
}

export async function getBrands(limit?: number): Promise<Brand[]> {
    const url = limit
        ? `${BASE_URL}/brands?limit=${limit}`
        : `${BASE_URL}/brands?limit=40`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("Failed to fetch brands");
    const json: ApiResponse<Brand> = await res.json();
    return json.data;
}
