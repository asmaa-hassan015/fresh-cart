import { getProduct, getProducts } from "@/app/lib/api";
import ProductDetailClient from "@/app/components/ProductDetailClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);
    return {
        title: `${product.title} — FreshCart`,
        description: product.description?.slice(0, 160),
    };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);
    const relatedProducts = await getProducts(5);

    return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}