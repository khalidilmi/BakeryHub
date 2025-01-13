'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, UserPlus, Store, Users, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  role: string;
}

interface Baker {
  id: number;
  baker_name: string;
  business_type: string;
  email: string;
  city: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [bakers, setBakers] = useState<Baker[]>([]);
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [usersRes, bakersRes] = await Promise.all([
          fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/admin/bakers', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData);
        } else {
          console.error('Failed to fetch users:', await usersRes.text());
        }

        if (bakersRes.ok) {
          const bakersData = await bakersRes.json();
          setBakers(bakersData);
        } else {
          console.error('Failed to fetch bakers:', await bakersRes.text());
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    fetchData();
  }, []);
  const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include', 
      });

      if (res.ok) {
        localStorage.removeItem('token');
        router.push('/');
        router.refresh();
      } else {
        console.error('Logout failed:', await res.text());
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAddAdmin = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAdmin),
      });
  
      if (res.ok) {
        alert('Admin oprettet!');
        setNewAdmin({ email: '', password: '' });
      } else {
        const errorData = await res.json();
        console.error('Failed to add admin:', errorData);
        alert(errorData.error || 'Kunne ikke tilføje admin.');
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      alert('Noget gik galt ved oprettelse af admin.');
    }
  };
  

  const handleDeleteUser = async (id: number) => {
    const confirmDelete = confirm('Er du sikker på, at du vil slette denne bruger?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setUsers(users.filter(user => user.id !== id));
      } else {
        console.error('Failed to delete user:', await res.text());
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleDeleteBaker = async (id: number) => {
    const confirmDelete = confirm('Er du sikker på, at du vil slette denne bager?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/bakers/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setBakers(bakers.filter(baker => baker.id !== id));
      } else {
        console.error('Failed to delete baker:', await res.text());
      }
    } catch (error) {
      console.error('Error deleting baker:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">Administrer brugere, bagere og administratorer</p>
          </div>
          <Button 
            onClick={handleLogout} 
            className="bg-red-600 hover:bg-red-700 transition-colors"
          >
            Log ud
          </Button>
        </div>

        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-amber-50">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 bg-amber-100 rounded-full">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Brugere</p>
                <p className="text-2xl font-bold text-gray-800">{users.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-50">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 bg-amber-100 rounded-full">
                <Store className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Bagere</p>
                <p className="text-2xl font-bold text-gray-800">{bakers.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-50">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 bg-amber-100 rounded-full">
                <Shield className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Administratorer</p>
                <p className="text-2xl font-bold text-gray-800">
                  {users.filter(user => user.role === 'admin').length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {}
        <Card className="mb-8 shadow-md">
          <CardHeader className="bg-white border-b">
            <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
              <Users className="h-5 w-5 text-amber-600" />
              Brugere
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Rolle</TableHead>
                    <TableHead className="font-semibold">Handlinger</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.role === 'admin' 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleDeleteUser(user.id)}
                          variant="ghost"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {}
        <Card className="mb-8 shadow-md">
          <CardHeader className="bg-white border-b">
            <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
              <Store className="h-5 w-5 text-amber-600" />
              Bagere
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">Navn</TableHead>
                    <TableHead className="font-semibold">Forretningstype</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">By</TableHead>
                    <TableHead className="font-semibold">Handlinger</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bakers.map(baker => (
                    <TableRow key={baker.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{baker.id}</TableCell>
                      <TableCell>{baker.baker_name}</TableCell>
                      <TableCell>{baker.business_type}</TableCell>
                      <TableCell>{baker.email}</TableCell>
                      <TableCell>{baker.city}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleDeleteBaker(baker.id)}
                          variant="ghost"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {}
        <Card className="shadow-md">
          <CardHeader className="bg-white border-b">
            <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-amber-600" />
              Tilføj ny Admin
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  className="border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  className="border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                  required
                />
              </div>
              <Button 
                onClick={handleAddAdmin}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Tilføj Admin
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
