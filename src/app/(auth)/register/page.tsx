"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Store, ArrowRight } from "lucide-react";

export default function RegisterPage() {
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
      await signIn("password", { email, password, flow: "signUp" });
      toast.success("Account created successfully!");
      router.push("/setup");
    } catch (err: any) {
      toast.error(err.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#1A1A19] flex items-center justify-center text-white">
            <Store size={20} />
          </div>
          <span className="font-serif text-2xl font-bold text-[#1A1A19]">EazzyShop</span>
        </Link>
        <h2 className="font-serif text-3xl font-bold text-[#1A1A19]">Start your WhatsApp storefront</h2>
        <p className="mt-2 text-sm text-[#6B6560]">
          Already registered?{" "}
          <Link href="/login" className="font-medium text-[#C4653A] hover:underline">
            Sign in to dashboard
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-[#E8E2DC] rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-[#1A1A19] mb-1">Work Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-[#E8E2DC] rounded-lg bg-[#FAFAF7] text-[#1A1A19] focus:outline-none focus:ring-2 focus:ring-[#C4653A] text-sm"
                placeholder="you@boutique.co.ke"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A19] mb-1">Create Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-[#E8E2DC] rounded-lg bg-[#FAFAF7] text-[#1A1A19] focus:outline-none focus:ring-2 focus:ring-[#C4653A] text-sm"
                placeholder="At least 6 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#C4653A] hover:bg-[#A8522E] text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? "Creating store..." : "Continue to Store Setup"}
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
