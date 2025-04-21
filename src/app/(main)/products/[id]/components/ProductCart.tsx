import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  available: boolean;
  description: string;
  imageUrl: string[];
  category: {
    id: string;
    name: string;
    label: string;
  };
  label: string;
  createdAt: string;
}

interface ProductCardProps {
  product: Product;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
        <div className="relative h-48 w-full">
          {product.imageUrl && product.imageUrl.length > 0 ? (
            <Image
              src={product.imageUrl[0]}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="bg-gray-100 h-full w-full flex items-center justify-center">
              <span className="text-gray-400">Không có hình ảnh</span>
            </div>
          )}
          {product.label && (
            <span className="absolute top-2 left-2 px-2 py-1 text-xs font-semibold bg-amber-100 text-amber-800 rounded-full">
              {product.label}
            </span>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-amber-900 text-lg mb-2 line-clamp-2">
            {product.name}
          </h3>
          <div className="flex justify-between items-center">
            <span className="text-amber-700 font-bold">
              {formatCurrency(product.price)}
            </span>
            {product.available ? (
              <span className="text-xs text-green-600">Còn hàng</span>
            ) : (
              <span className="text-xs text-red-600">Hết hàng</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
