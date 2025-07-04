import Image from "next/image";
import Link from "next/link";
import { FaStar, FaRegStar } from "react-icons/fa";

type Product = {
  id: number;
  name: string;
  urlKey: string;
  image: string;
  formattedPrice: string;
  shortDescription: string;
  description: string;
  averageRating: number;
  totalReviews: number;
};

const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      i <= Math.floor(rating) ? (
        <FaStar key={i} className="text-yellow-400" />
      ) : (
        <FaRegStar key={i} className="text-yellow-400" />
      )
    );
  }
  return stars;
};

const ProductItem = ({
  product,
  color = "black",
}: {
  product: Product;
  color?: string;
}) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-md h-full flex flex-col justify-between">
      {/* Product Image */}
      <Image
        src={product.image}
        alt={product.name}
        width={500}
        height={300}
        className="w-full h-52 object-contain rounded-lg"
      />

      {/* Product Info */}
      <div className="mt-4 space-y-2">
        <h3 className={`text-md font-semibold text-${color}`}>
          {product.name}
        </h3>

        {/* Price */}
        <p className={`text-sm font-bold text-${color}`}>
          {product.formattedPrice}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 text-sm text-gray-500">
          {renderStars(product.averageRating)}
          <span className="ml-1">({product.totalReviews})</span>
        </div>

        {/* Description */}
        <p className={`text-sm text-${color}/80`}>
          {product.shortDescription}
        </p>

        {/* View Product Link */}
        <Link
          href={`/products/${product.urlKey}`}
          className="inline-block mt-3 text-sm text-blue-600 font-medium hover:underline"
        >
          View Product
        </Link>
      </div>
    </div>
  );
};

export default ProductItem;