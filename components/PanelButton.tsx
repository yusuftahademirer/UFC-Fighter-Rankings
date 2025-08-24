"use client"
import { useRouter } from "next/navigation";
 
export default function PanelButton() {
    const router = useRouter();

    return (
        <button 
            onClick={() => router.push("/panel")}
            className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded mt-8 ml-20">
            Panel   
        </button>
    )
}


   
