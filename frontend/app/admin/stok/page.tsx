"use client"

import { useEffect, useState } from "react"

interface Fish {
    id: number
    name: string
    size: string
    price: number
    stock: number
    photo: string
}

export default function StokPage() {
    const [fishes, setFishes] = useState<Fish[]>([])

    useEffect(() => {
        fetch("http://localhost:5000/fishes")
            .then(res => res.json())
            .then(data => setFishes(data))
    }, [])

    return (
        <div className="p-8">

            <h1 className="text-3xl font-bold text-center mb-10 text-slate-800">
                Stok Ikan
            </h1>

            {/* GRID CARD */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                {fishes.map((fish) => (

                    <div
                        key={fish.id}
                        className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
                    >

                        {/* FOTO */}
                        <div className="relative">

                            <img
                                src={`http://localhost:5000/uploads/${fish.photo}`}
                                className="w-full h-48 object-cover"
                            />

                            {/* SIZE BADGE */}
                            {fish.size === "Big" && (
                                <div className="absolute top-3 left-3 bg-purple-600 text-white font-bold text-xs px-3 py-1 rounded-full">
                                    BIG
                                </div>
                            )}

                            {fish.size === "Maxton" && (
                                <div className="absolute top-3 left-3 bg-red-600 text-white font-bold text-xs px-3 py-1 rounded-full">
                                    MAXTON
                                </div>
                            )}

                        </div>

                        {/* INFO */}
                        <div className="p-4 flex justify-between items-start">

                            <div>
                                <h2 className="font-semibold text-slate-800 text-lg">
                                    {fish.name}
                                </h2>

                                <p className="text-slate-500 text-sm">
                                    Stok: {fish.stock}
                                </p>
                            </div>

                            <div className="text-blue-600 font-bold">
                                Rp {fish.price?.toLocaleString()}
                            </div>

                        </div>

                        {/* ACTION */}
                        <div className="flex border-t">

                            <button className="flex-1 py-2 text-sm text-yellow-600 hover:bg-yellow-50 transition">
                                Edit
                            </button>

                            <button className="flex-1 py-2 text-sm text-red-600 hover:bg-red-50 transition">
                                Delete
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    )
}