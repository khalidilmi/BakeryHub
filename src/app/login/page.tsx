'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Cake, 
  User, 
  Lock, 
  Mail, 
  Store, 
  Phone, 
  MapPin, 
  Eye, 
  EyeOff, 
  Utensils 
} from 'lucide-react'

export default function BakeryAuth() {
  const [activeTab, setActiveTab] = useState('login')
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    business_type: '',
    name: '',
    baker_name: '',
    mobile_number: '',
    city: '',
    zip_code: '',
    street: '',
  });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const router = useRouter();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        document.cookie = `token=${data.token}; path=/`;

        if (data.role === 'admin') {
          router.push('/admin-dashboard');
        } else if (data.role === 'baker') {
          router.push('/dashboard');
        } else {
          alert('Ugyldig rolle.');
        }
      } else {
        const errorData = await res.json();
        alert( 'Fejl under login.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Noget gik galt under login.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerForm),
    });

    if (res.ok) {
      router.push('/');
    } else {
      const errorData = await res.json();
      alert(errorData.error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <h1 className="text-3x1 font-bold text-center text-amber-800 mb-6">
        LOGIN/REGISTERING FOR BAGER
      </h1>
      <Tabs defaultValue="login" className="w-full max-w-md mx-auto mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Login to your bakery account</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleLoginSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-amber-600" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      placeholder="baker@example.com"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-amber-600" />
                    <Input
                      id="password"
                      name="password"
                      type={showLoginPassword ? "text" : "password"}
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-3 text-amber-600 hover:text-amber-700"
                    >
                      {showLoginPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full">Login</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Register</CardTitle>
              <CardDescription>Create your bakery account</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleRegisterSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-amber-600" />
                    <Input
                      id="name"
                      name="name"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                      placeholder="John Dough"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="baker_name">Bakery Name</Label>
                  <div className="relative">
                    <Cake className="absolute left-3 top-3 h-5 w-5 text-amber-600" />
                    <Input
                      id="baker_name"
                      name="baker_name"
                      value={registerForm.baker_name}
                      onChange={(e) => setRegisterForm({ ...registerForm, baker_name: e.target.value })}
                      placeholder="Sweet Delights Bakery"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business_type">Business Type</Label>
                  <div className="relative">
                    <Store className="absolute left-3 top-3 h-5 w-5 text-amber-600" />
                    <Input
                      id="business_type"
                      name="business_type"
                      value={registerForm.business_type}
                      onChange={(e) => setRegisterForm({ ...registerForm, business_type: e.target.value })}
                      placeholder="Bakery, Café, etc."
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-amber-600" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      placeholder="baker@example.com"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-amber-600" />
                    <Input
                      id="password"
                      name="password"
                      type={showRegisterPassword ? "text" : "password"}
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      className="absolute right-3 top-3 text-amber-600 hover:text-amber-700"
                    >
                      {showRegisterPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile_number">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-amber-600" />
                    <Input
                      id="mobile_number"
                      name="mobile_number"
                      value={registerForm.mobile_number}
                      onChange={(e) => setRegisterForm({ ...registerForm, mobile_number: e.target.value })}
                      placeholder="(123) 456-7890"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-amber-600" />
                    <Input
                      id="street"
                      name="street"
                      value={registerForm.street}
                      onChange={(e) => setRegisterForm({ ...registerForm, street: e.target.value })}
                      placeholder="123 Main St"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={registerForm.city}
                      onChange={(e) => setRegisterForm({ ...registerForm, city: e.target.value })}
                      placeholder="Bakeryville"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip_code">Zip Code</Label>
                    <Input
                      id="zip_code"
                      name="zip_code"
                      value={registerForm.zip_code}
                      onChange={(e) => setRegisterForm({ ...registerForm, zip_code: e.target.value })}
                      placeholder="12345"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
                  Register
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
