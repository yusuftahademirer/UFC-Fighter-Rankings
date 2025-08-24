"use client"
import { useRouter } from 'next/navigation';

export default function HomeLinkButton() {
  const router = useRouter();

  return (
    <div>
        <button onClick={() => router.push("/")} className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded">Anasayfaya Dön</button>
    </div>
  )
}
