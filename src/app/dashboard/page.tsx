// app/dashboard/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {Button} from "@/components/ui/button"; // Default eksport
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Named eksport
import {Input} from "@/components/ui/input"; // Default eksport
import { Label } from "@/components/ui/label"; // Named eksport
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Named eksport
import { Pencil, Trash2, Plus, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // Named eksport

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface User {
  baker_name: string;
  business_type: string;
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Log importerede komponenter for fejlfinding
  useEffect(() => {
    console.log({
      Button,
      Card,
      CardContent,
      CardHeader,
      CardTitle,
      Input,
      Label,
      Table,
      TableBody,
      TableCell,
      TableHead,
      TableHeader,
      TableRow,
      Pencil,
      Trash2,
      Plus,
      X,
      Tooltip,
      TooltipContent,
      TooltipProvider,
      TooltipTrigger
    });
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch('/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          const errorData = await res.json();
          alert(errorData.error || 'Kunne ikke hente brugerdata.');
          if (res.status === 401) {
            // Hvis token er ugyldigt, omdiriger til login
            router.push('/login');
          }
        }
      } catch (error) {
        console.error('Fetch user error:', error);
        alert('Der opstod en fejl under hentning af brugerdata.');
        router.push('/login');
      }
    };

    const fetchProducts = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch('/api/products', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        } else {
          const errorData = await res.json();
          alert(errorData.error || 'Kunne ikke hente produkter.');
          if (res.status === 401) {
            // Hvis token er ugyldigt, omdiriger til login
            router.push('/login');
          }
        }
      } catch (error) {
        console.error('Fetch products error:', error);
        alert('Der opstod en fejl under hentning af produkter.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
    fetchProducts();
  }, [router]);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm('Er du sikker på, at du vil slette dette produkt?');
    if (!confirmDelete) return;

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setProducts(products.filter(product => product.id !== id));
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Kunne ikke slette produkt.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Der opstod en fejl under sletning af produkt.');
    }
  };

  const handleSave = async () => {
    if (!editingProduct) return;

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingProduct),
      });

      if (res.ok) {
        const updatedProduct = await res.json();
        setProducts(products.map(product =>
          product.id === updatedProduct.id ? updatedProduct : product
        ));
        setEditingProduct(null);
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Kunne ikke opdatere produkt.');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Der opstod en fejl under opdatering af produkt.');
    }
  };

  const handleAdd = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/products/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProduct),
      });

      if (res.ok) {
        const product = await res.json();
        setProducts([...products, product]);
        setNewProduct({ name: '', description: '', price: 0 });
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Kunne ikke tilføje produkt.');
      }
    } catch (error) {
      console.error('Add error:', error);
      alert('Der opstod en fejl under tilføjelse af produkt.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Indlæser...</p>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold text-amber-800">
              Bageri Produkt Administration
            </CardTitle>
            {user && (
              <p className="text-gray-600 mt-2">
                Velkommen, {user.baker_name} | {user.business_type}
              </p>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="new-name">Produkt Navn</Label>
              <Input
                id="new-name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="f.eks. Croissant"
              />
            </div>
            <div>
              <Label htmlFor="new-price">Pris (DKK)</Label>
              <Input
                id="new-price"
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                placeholder="0.00"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="new-description">Beskrivelse</Label>
              <Input
                id="new-description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="Produkt beskrivelse"
              />
            </div>
          </div>
          <Button onClick={handleAdd} className="w-full bg-amber-600 hover:bg-amber-700">
            <Plus className="mr-2 h-4 w-4" /> Tilføj Nyt Produkt
          </Button>
        </div>
        <Table className="mt-6">
          <TableHeader>
            <TableRow>
              <TableHead>Navn</TableHead>
              <TableHead>Pris</TableHead>
              <TableHead>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>Beskrivelse</TooltipTrigger>
                    <TooltipContent>
                      <p>Produkt beskrivelse</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
              <TableHead>Handlinger</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map(product => (
              <TableRow key={product.id}>
                <TableCell>
                  {editingProduct?.id === product.id ? (
                    <Input
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    />
                  ) : (
                    product.name
                  )}
                </TableCell>
                <TableCell>
                  {editingProduct?.id === product.id ? (
                    <Input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                      step="0.01"
                    />
                  ) : (
                    `${product.price.toFixed(2)} DKK`
                  )}
                </TableCell>
                <TableCell>
                  {editingProduct?.id === product.id ? (
                    <Input
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    />
                  ) : (
                    product.description
                  )}
                </TableCell>
                <TableCell>
                  {editingProduct?.id === product.id ? (
                    <>
                      <Button onClick={handleSave} className="mr-2 bg-green-600 hover:bg-green-700">
                        Gem
                      </Button>
                      <Button onClick={() => setEditingProduct(null)} variant="destructive">
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={() => handleEdit(product)} className="mr-2 bg-amber-600 hover:bg-amber-700">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button onClick={() => handleDelete(product.id)} variant="destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
