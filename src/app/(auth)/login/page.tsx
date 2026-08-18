"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Store, ArrowRight, Globe } from "lucide-react";

export default function LoginPage() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill in all fields.");

    setLoading(true);
    try {
      await signIn("password", { email, password, flow: "signIn" });
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google");
    } catch (err: any) {
      toast.error("Google sign in failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#1A1A19] flex items-center justify-center text-white">
            <Store size={20} />
          </div>
          <span className="font-heading text-2xl font-bold text-[#1A1A19]">EazzyShop</span>
        </Link>
        <h2 className="font-heading text-3xl font-bold text-[#1A1A19]">Sign in to your merchant dashboard</h2>
        <p className="mt-2 text-sm text-[#6B6560]">
          Or{" "}
          <Link href="/register" className="font-medium text-[#C4653A] hover:underline">
            create a new store in minutes
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-[#E8E2DC] rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-[#1A1A19] mb-1">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-[#E8E2DC] rounded-lg bg-[#FAFAF7] text-[#1A1A19] focus:outline-none focus:ring-2 focus:ring-[#C4653A] text-sm"
                placeholder="merchant@boutique.co.ke"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A19] mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-[#E8E2DC] rounded-lg bg-[#FAFAF7] text-[#1A1A19] focus:outline-none focus:ring-2 focus:ring-[#C4653A] text-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#1A1A19] hover:bg-[#1A1A19]/90 text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? "Signing in..." : "Sign in to Dashboard"}
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E8E2DC]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-[#A89F97]">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleSignIn}
                className="w-full py-3 px-4 border border-[#E8E2DC] rounded-lg text-sm font-medium text-[#1A1A19] bg-white hover:bg-[#F5F0EB] transition-colors flex items-center justify-center gap-2"
              >
                <Globe size={18} /> Google Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
