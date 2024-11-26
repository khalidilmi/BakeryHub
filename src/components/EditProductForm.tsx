import { Product } from '@/types/product';

interface EditProductFormProps {
  product: Product;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
  onChange: (product: Product) => void;
}

export default function EditProductForm({ 
  product, 
  onSubmit, 
  onCancel, 
  onChange 
}: EditProductFormProps) {
  return (
    <form onSubmit={onSubmit} className="mt-8">
      <h2 className="text-xl font-bold mb-4">Rediger Produkt</h2>
      <label className="block mb-2">
        Navn:
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={(e) => onChange({ ...product, name: e.target.value })}
          required
          className="w-full p-2 border"
        />
      </label>
      <label className="block mb-2">
        Beskrivelse:
        <textarea
          name="description"
          value={product.description}
          onChange={(e) => onChange({ ...product, description: e.target.value })}
          required
          className="w-full p-2 border"
        />
      </label>
      <label className="block mb-2">
        Pris (DKK):
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={(e) => onChange({ ...product, price: Number(e.target.value) })}
          required
          className="w-full p-2 border"
        />
      </label>
      <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">
        Opdater Produkt
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="mt-4 ml-2 bg-gray-500 text-white p-2 rounded"
      >
        Annuller
      </button>
    </form>
  );
} 