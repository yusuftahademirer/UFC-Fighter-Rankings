"use client";
import { useState, useEffect } from "react";
import AdminLogin from "@/components/AdminLogin";
import FighterPanel from "@/components/FighterPanel";
import HomeLinkButton from "@/components/HomeLinkButton";

export default function PanelPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Cookie kontrolü (client-side)
    if (document.cookie.includes("admin_auth=true")) {
      setIsLoggedIn(true);
    }
  }, []);

  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="p-8">
      <HomeLinkButton />
      <h1 className="text-2xl font-bold mb-6 text-center mb-16 border-b border-gray-800 pb-4 text-blue-400 tracking-wide">
        Manage Fighters
      </h1>
      <FighterPanel />
    </div>
  );
}