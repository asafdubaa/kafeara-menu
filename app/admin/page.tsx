"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Cookies from "js-cookie";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real application, you would validate against a secure backend
      // For now, we'll use a simple hardcoded check (you should change these credentials)
      if (username === "admin" && password === "admin123") {
        // Set a secure cookie
        Cookies.set("adminToken", "dummy-token", {
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          expires: 1, // 1 day
        });
        router.push("/admin/dashboard");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5e8c9] p-4">
      <Card className="w-[400px] border-4 border-double border-amber-950/40 bg-[#f5e8c9] shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-serif text-amber-950 text-center">Admin Login</CardTitle>
          <CardDescription className="text-amber-950/80 text-center">
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-amber-950">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                className="border-amber-950/40 bg-[#f5e8c9] text-amber-950"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-amber-950">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="border-amber-950/40 bg-[#f5e8c9] text-amber-950"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-amber-950 text-[#f5e8c9] hover:bg-amber-900"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 