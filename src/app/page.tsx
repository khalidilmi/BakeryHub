'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Cake, User, Lock, Mail, Utensils, Phone, MapPin, Eye, EyeOff } from 'lucide-react'

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
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('token', data.token);
      document.cookie = `token=${data.token}; path=/`;
      router.push('/dashboard');
    } else {
      const errorData = await res.json();
      alert(errorData.error);
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
                <Label htmlFor="business_type">Business Type</Label>
                <div className="relative">
                  <Cake className="absolute left-3 top-3 h-5 w-5 text-amber-600" />
                  <Input
                    id="business_type"
                    name="business_type"
                    value={registerForm.business_type}
                    onChange={(e) => setRegisterForm({ ...registerForm, business_type: e.target.value })}
                    placeholder="Bakery Type"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="baker_name">Baker Name</Label>
                <div className="relative">
                  <Utensils className="absolute left-3 top-3 h-5 w-5 text-amber-600" />
                  <Input
                    id="baker_name"
                    name="baker_name"
                    value={registerForm.baker_name}
                    onChange={(e) => setRegisterForm({ ...registerForm, baker_name: e.target.value })}
                    placeholder="Your Baker Name"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile_number">Mobile Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-amber-600" />
                  <Input
                    id="mobile_number"
                    name="mobile_number"
                    value={registerForm.mobile_number}
                    onChange={(e) => setRegisterForm({ ...registerForm, mobile_number: e.target.value })}
                    placeholder="Your Phone Number"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-amber-600" />
                  <Input
                    id="city"
                    name="city"
                    value={registerForm.city}
                    onChange={(e) => setRegisterForm({ ...registerForm, city: e.target.value })}
                    placeholder="Your City"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="zip_code">ZIP Code</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-amber-600" />
                  <Input
                    id="zip_code"
                    name="zip_code"
                    value={registerForm.zip_code}
                    onChange={(e) => setRegisterForm({ ...registerForm, zip_code: e.target.value })}
                    placeholder="ZIP Code"
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
                    placeholder="Street Address"
                    className="pl-10"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">Register</Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
