"use client";

import { useAuth } from "@/context/AuthContext";

export default function UserGreeting() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <p className="animate-pulse">Loading profil...</p>;
  if (!user) return <p>Anda belum login.</p>;

  console.log(user);
  return (
    <p>
      Halo, <strong>{user.name || user.email}</strong>!
    </p>
  );
}
