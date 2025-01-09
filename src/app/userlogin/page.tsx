'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Lock, Mail, Eye, EyeOff } from 'lucide-react'

export default function UserAuth() {
  const [activeTab, setActiveTab] = useState('login');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ email: '', password: '' });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const router = useRouter();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/user/login', { // Login endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
        credentials: 'include', // Include cookies
      });

      if (res.ok) {
        const data = await res.json();
        alert('Login successful!');
        router.push('/all-bakers'); // Redirect to bakers page
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An unexpected error occurred. Please try again later.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/user/register', { // Register endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm),
        credentials: 'include',
      });

      if (res.ok) {
        alert('Registration successful! Please log in.');
        setActiveTab('login'); // Switch to login tab after registration
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <h1 className="text-3xl font-bold text-center text-amber-800 mb-6">
        LOGIN/REGISTERING FOR BRUGER
      </h1>

      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login" onClick={() => setActiveTab('login')}>Login</TabsTrigger>
          <TabsTrigger value="register" onClick={() => setActiveTab('register')}>Register</TabsTrigger>
        </TabsList>

        {/* Login Tab */}
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Login med din bruger-konto</CardDescription>
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
                      placeholder="user@example.com"
                      className="pl-10"
                      required
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
                      required
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

        {/* Register Tab */}
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Register</CardTitle>
              <CardDescription>Opret en bruger-konto</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleRegisterSubmit}>
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
                      placeholder="user@example.com"
                      className="pl-10"
                      required
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
                      required
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

                <Button type="submit" className="w-full">Register</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
