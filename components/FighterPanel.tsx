"use client";
import { useEffect, useState } from "react";

const weightClasses = [
  "Pound-for-pound",
  "Flyweight",
  "Bantamweight",
  "Featherweight",
  "Lightweight",
  "Welterweight",
  "Middleweight",
  "Light Heavyweight",
  "Heavyweight",
];

async function getApiFighters() {
  const res = await fetch("https://api.octagon-api.com/fighters");
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    // API'den gelen veri obje ise, Object.entries ile id ve name ata
    return Object.entries(data).map(([key, f]: [string, any]) => ({
      ...f,
      id: key,
      name: f.name,
      weightClass: f.category ? parseCategoryToWeightClass(f.category) : "",
      ranking: "",
    }));
  } catch (err) {
    console.error("API yanıtı JSON değil:", text);
    return [];
  }
}

function parseCategoryToWeightClass(category: string) {
  if (!category) return "";
  // "Lightweight Division" => "Lightweight"
  return category.replace(" Division", "");
}

async function getPoundForPoundRankings() {
  const res = await fetch("https://api.octagon-api.com/rankings");
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    // "Men's Pound-for-Pound Top Rank" kategorisini bul
    const p4p = data.find(
      (item: any) =>
        item.id === "mens-pound-for-pound-top-rank" ||
        item.categoryName.toLowerCase().includes("pound-for-pound")
    );
    if (!p4p) return [];
    // Sıralamayı dövüşçülere ata
    return p4p.fighters.map((f: any, idx: number) => ({
      ...f,
      pfpRanking: idx + 1,
      weightClass: "Pound-for-pound",
      ranking: "",
    }));
  } catch (err) {
    return [];
  }
}

export default function FighterPanel() {
  const [form, setForm] = useState({
    name: "",
    weightClass: "",
    ranking: "",
    pfpRanking: "",
  });
  const [loading, setLoading] = useState(false);
  const [fighters, setFighters] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/fighters")
      .then((res) => res.json())
      .then((data) => setFighters(data));
  }, []);

  // Harici API'den dövüşçüleri bir defa kaydetmek için buton
  const handleImportApiFighters = async () => {
    setLoading(true);

    // 1. Tüm mevcut dövüşçüleri sil
    await Promise.all(
      fighters.map((fighter) =>
        fetch("/api/fighters", {
          method: "DELETE",
          body: JSON.stringify({ id: fighter.id }),
          headers: { "Content-Type": "application/json" },
        })
      )
    );

    // 2. Harici API'den dövüşçüleri ve pound-for-pound sıralamasını çek
    const apiFighters = await getApiFighters();
    const pfpFighters = await getPoundForPoundRankings();

    // 3. Normal dövüşçüleri kaydet
    for (const fighter of apiFighters) {
      if (fighter.name && fighter.weightClass) {
        await fetch("/api/fighters", {
          method: "POST",
          body: JSON.stringify({
            name: fighter.name,
            weightClass: fighter.weightClass,
            ranking: "",
            pfpRanking: null,
          }),
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // 4. Pound-for-pound dövüşçüleri kaydet
    for (const fighter of pfpFighters) {
      if (fighter.name) {
        await fetch("/api/fighters", {
          method: "POST",
          body: JSON.stringify({
            name: fighter.name,
            weightClass: "Pound-for-pound",
            ranking: "",
            pfpRanking: fighter.pfpRanking,
          }),
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // 5. Son olarak dövüşçüleri tekrar çek
    fetch("/api/fighters")
      .then((res) => res.json())
      .then((data) => setFighters(data));
    setLoading(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // En az bir sıralama alanı dolu olmalı
    if (!form.ranking && !form.pfpRanking) {
      setError("Siklet veya pound-for-pound sıralamasından en az biri seçilmeli!");
      setLoading(false);
      return;
    }

    // Aynı isim, siklet ve sıralama kontrolü
    const exists = fighters.some(
      (f) =>
        f.name.trim().toLowerCase() === form.name.trim().toLowerCase() &&
        f.weightClass === form.weightClass &&
        f.ranking === form.ranking
    );
    if (exists) {
      setError("Bu isimde ve aynı sikletin aynı sıralamasında bir dövüşçü zaten var!");
      setLoading(false);
      return;
    }

    // Aynı siklette aynı sıralama kontrolü
    const sameRanking = fighters.some(
      (f) =>
        f.weightClass === form.weightClass &&
        f.ranking === form.ranking
    );
    if (sameRanking) {
      setError("Aynı siklette aynı sıralamada birden fazla dövüşçü olamaz!");
      setLoading(false);
      return;
    }

    // Pound-for-pound benzersizliği kontrolü
    const samePfp = fighters.some(
      (f) => String(f.pfpRanking) === String(form.pfpRanking)
    );
    if (samePfp) {
      setError("Aynı pound-for-pound sıralamasında birden fazla dövüşçü olamaz!");
      setLoading(false);
      return;
    }

    await fetch("/api/fighters", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        ranking:
          form.ranking === "champion"
            ? "champion"
            : form.ranking
            ? String(form.ranking)
            : "",
        pfpRanking: form.pfpRanking ? Number(form.pfpRanking) : null,
      }),
      headers: { "Content-Type": "application/json" },
    });
    setLoading(false);
    setForm({ name: "", weightClass: "", ranking: "", pfpRanking: "" });
    fetch("/api/fighters")
      .then((res) => res.json())
      .then((data) => setFighters(data));
  };

  const handleDelete = async (id: number) => {
    await fetch("/api/fighters", {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: { "Content-Type": "application/json" },
    });
    setFighters(fighters.filter((f) => f.id != id));
  };

  // Sikletlere göre gruplama
  const grouped = weightClasses.reduce(
    (acc, wc) => {
      acc[wc] = fighters
        .filter((f) => f.weightClass === wc)
        .sort((a, b) => {
          if (a.ranking === "champion") return -1;
          if (b.ranking === "champion") return 1;
          return Number(a.ranking) - Number(b.ranking);
        });
      return acc;
    },
    {} as Record<string, any[]>
  );


  const handleMove = async (wc: string, from: number, to: number) => {
    if (to < 0 || to >= grouped[wc].length) return;
    setLoading(true);
    const newGroup = [...grouped[wc]];
    const [moved] = newGroup.splice(from, 1);
    newGroup.splice(to, 0, moved);

    try {
      await Promise.all(
        newGroup.map((fighter, idx) =>
          fetch("/api/fighters", {
            method: "PUT",
            body: JSON.stringify({
              id: fighter.id,
              ranking: idx === 0 ? "champion" : String(idx),
            }),
            headers: { "Content-Type": "application/json" },
          })
        )
      );
      const res = await fetch("/api/fighters");
      const data = await res.json();
      setFighters(data);
    } catch (err) {
      setError("Failed to update rankings. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-blue-900 via-black to-gray-900 py-12 rounded">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 w-full max-w-lg mx-auto p-8 rounded-xl shadow-2xl bg-gray-950 border border-gray-800"
      >
        <h2 className="text-2xl font-bold text-center text-blue-400 mb-2 tracking-wide">
          Add New Fighter
        </h2>
        <input
          name="name"
          placeholder="Fighter Name"
          value={form.name}
          onChange={handleChange}
          className="border border-gray-700 bg-gray-900 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
        />
        <select
          name="weightClass"
          value={form.weightClass}
          onChange={handleChange}
          className="border border-gray-700 bg-gray-900 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
          required
        >
          <option value="">Select Weight Class</option>
          {weightClasses.map((wc) => (
            <option key={wc} value={wc}>{wc}</option>
          ))}
        </select>
        <select
          name="ranking"
          value={form.ranking}
          onChange={handleChange}
          className="border border-gray-700 bg-gray-900 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
        >
          <option value="">Select Ranking (optional)</option>
          {[...Array(16)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>
        <select
          name="pfpRanking"
          value={form.pfpRanking}
          onChange={handleChange}
          className="border border-gray-700 bg-gray-900 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
        >
          <option value="">Select Pound-for-pound (optional)</option>
          {[...Array(16)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>
        <button 
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-500 transition"
          disabled={loading}
        >
          {loading ? "Loading..." : "Add Fighter"}
        </button>
        {error && (
          <div className="text-red-500 font-bold text-center">{error}</div>
        )}
      </form>
      <h6 className="text-sm text-center text-gray-400 mt-4">
        If you change any champion, please upload the champion's image to "public/champions/" folder.
      </h6>
      <button
        type="button"
        className="bg-gradient-to-r from-red-600 to-red-400 text-white py-3 px-6 rounded-lg font-semibold hover:from-red-700 hover:to-red-500 transition mb-8 mt-8 shadow-lg"
        onClick={handleImportApiFighters}
      >
      {loading ? "Loading..." : "Reset Fighter Rankings"}
      </button>
      <h2 className="border-b text-4xl font-bold mt-8 mb-8 text-blue-500 text-center tracking-wide">
        Fighters
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 w-full w-full px-4">
        {weightClasses.map((wc) => (
          <div key={wc} className="mb-8 w-full">
            <h3 className="text-xl font-semibold mb-4 text-blue-300 text-center">{wc}</h3>
            <ul className="flex flex-col gap-3 bg-gray-900 rounded-xl shadow-lg p-4 w-full">
              {grouped[wc].map((fighter, idx) => (
                <li
                  key={fighter.id}
                  className="border-b border-gray-800 py-3 flex justify-between items-center bg-gray-900 w-full rounded-lg"
                >
                  <span>
                    {idx === 0 ? (
                      <>
                        <span className="text-yellow-400 font-bold text-lg">🏆 {fighter.name}</span>
                        <span className="ml-2 px-2 py-1 bg-yellow-200 text-yellow-700 rounded text-xs font-bold">Champion</span>
                      </>
                    ) : (
                      <>
                        <span className="font-bold text-blue-400">{idx}.</span> <span className="text-white">{fighter.name}</span>
                      </>
                    )}
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={idx === 0}
                    onClick={() => handleMove(wc, idx, idx - 1)}
                    className={`cursor-pointer px-3 py-2 rounded-lg text-lg font-bold transition ${
                      idx === 0
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    ↑
                  </button>
                  <button
                    disabled={idx === grouped[wc].length - 1}
                    onClick={() => handleMove(wc, idx, idx + 1)}
                    className={`cursor-pointer px-3 py-2 rounded-lg text-lg font-bold transition ${
                      idx === grouped[wc].length - 1
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => handleDelete(fighter.id)}
                    className="cursor-pointer bg-gradient-to-r from-red-600 to-red-400 text-white px-3 py-2 rounded-lg font-bold hover:from-red-700 hover:to-red-500 transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
            {grouped[wc].length === 0 && (
              <li className="text-gray-500 text-center py-4">No fighters in this class.</li>
            )}
          </ul>
        </div>
      ))}
    </div>
    </div>
  );
}