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
    const [modal, setModal] = useState(false)
    const [selectedFish, setSelectedFish] = useState<Fish | null>(null)
    const [type, setType] = useState<"add" | "minus">("add")
    const [amount, setAmount] = useState(0)

    useEffect(() => {
        loadFish()
    }, [])

    function loadFish() {
        fetch("http://localhost:5000/fishes")
            .then(res => res.json())
            .then(data => setFishes(data))
    }

    function openModal(fish: Fish, action: "add" | "minus") {
        setSelectedFish(fish)
        setType(action)
        setModal(true)
    }

    async function submitStock() {

        await fetch("http://localhost:5000/update-stock", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: selectedFish?.id,
                amount,
                type
            })
        })

        setModal(false)
        setAmount(0)
        loadFish()
    }

    return (
        <div className="p-8">

            <h1 className="text-3xl font-bold text-center mb-10">
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

                            {fish.size === "Big" && (
                                <div className="absolute top-3 left-3 bg-purple-600 text-white text-xs px-3 py-1 rounded-full">
                                    BIG
                                </div>
                            )}

                            {fish.size === "Maxton" && (
                                <div className="absolute top-3 left-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full">
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

                            <button
                                onClick={() => openModal(fish, "minus")}
                                className="flex-1 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                                Kurang
                            </button>

                            <button
                                onClick={() => openModal(fish, "add")}
                                className="flex-1 py-2 text-sm text-green-600 hover:bg-green-50"
                            >
                                Tambah
                            </button>

                        </div>

                    </div>

                ))}

            </div>

            {/* MODAL */}
            {modal && (

                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

                    <div className="bg-white p-6 rounded-xl w-80">

                        <h2 className="text-xl font-semibold mb-4 text-center">
                            {type === "add" ? "Tambah Stok" : "Kurangi Stok"}
                        </h2>

                        <input
                            type="number"
                            placeholder="Jumlah"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full border p-3 rounded-lg mb-4"
                        />

                        <div className="flex gap-3">

                            <button
                                onClick={() => setModal(false)}
                                className="flex-1 bg-gray-200 p-2 rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={submitStock}
                                className="flex-1 bg-blue-600 text-white p-2 rounded-lg"
                            >
                                Submit
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    )
}