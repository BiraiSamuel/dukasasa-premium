import Link from "next/link";
import Image from "next/image";
import { Trash2 } from "lucide-react";

export interface WishItemProps {
  id: string;
  title: string;
  price: number;
  image: string;
  slug: string;
  stockAvailability: number;
  onRemove: () => void;
}

const WishItem = ({
  title,
  price,
  image,
  slug,
  stockAvailability,
  onRemove,
}: WishItemProps) => {
  return (
    <tr className="text-black">
      <td></td>
      <td>
        <Link href={`/products/${slug}`}>
          <Image
            src={image}
            alt={title}
            width={80}
            height={80}
            className="mx-auto object-contain rounded"
          />
        </Link>
      </td>
      <td>
        <Link
          href={`/products/${slug}`}
          className="font-semibold text-sm hover:underline hover:text-[#ff5b00]"
        >
          {title}
        </Link>
        <p className="text-sm text-gray-600">${price.toFixed(2)}</p>
      </td>
      <td>
        {stockAvailability ? (
          <span className="text-green-600 font-medium">In Stock</span>
        ) : (
          <span className="text-red-500 font-medium">Out of Stock</span>
        )}
      </td>
      <td>
        <button
          onClick={onRemove}
          className="text-red-600 hover:text-red-800"
          title="Remove from Wishlist"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </td>
    </tr>
  );
};

export default WishItem;
