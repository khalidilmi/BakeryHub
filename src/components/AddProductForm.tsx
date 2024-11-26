interface AddProductFormProps {
  newProduct: {
    name: string;
    description: string;
    price: string;
  };
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function AddProductForm({ 
  newProduct, 
  onSubmit, 
  onChange 
}: AddProductFormProps) {
  return (
    <form onSubmit={onSubmit} className="mt-8">
      <h2 className="text-xl font-bold mb-4">Tilføj Nyt Produkt</h2>
      <label className="block mb-2">
        Navn:
        <input
          type="text"
          name="name"
          value={newProduct.name}
          onChange={onChange}
          required
          className="w-full p-2 border"
        />
      </label>
      <label className="block mb-2">
        Beskrivelse:
        <textarea
          name="description"
          value={newProduct.description}
          onChange={onChange}
          required
          className="w-full p-2 border"
        />
      </label>
      <label className="block mb-2">
        Pris (DKK):
        <input
          type="number"
          name="price"
          value={newProduct.price}
          onChange={onChange}
          required
          className="w-full p-2 border"
        />
      </label>
      <button type="submit" className="mt-4 bg-green-500 text-white p-2 rounded">
        Tilføj Produkt
      </button>
    </form>
  );
} 