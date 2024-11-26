import { Product } from '@/types/product';

interface ProductItemProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => void;
}

export default function ProductItem({ product, onEdit, onDelete }: ProductItemProps) {
  return (
    <li className="border p-2 mb-2">
      <h2 className="font-bold">{product.name}</h2>
      <p>{product.description}</p>
      <p>Pris: {product.price} DKK</p>
      <div className="mt-2">
        <button
          onClick={() => onEdit(product)}
          className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
        >
          Rediger
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="bg-red-500 text-white px-2 py-1 rounded"
        >
          Slet
        </button>
      </div>
    </li>
  );
} 