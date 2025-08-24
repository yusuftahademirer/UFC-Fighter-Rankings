"use client";
import { useState } from "react";

export default function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/admin-login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      onLogin();
    } else {
      setError("Username or password incorrect!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-black to-gray-900">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 p-8 rounded-xl shadow-xl bg-gray-950 border border-gray-800 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center text-blue-400 mb-2 tracking-wide">
          Admin Login
        </h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="border border-gray-700 bg-gray-900 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border border-gray-700 bg-gray-900 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-500 transition"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
        {error && (
          <div className="text-red-500 font-bold text-center">{error}</div>
        )}
      </form>
    </div>
  );
}
