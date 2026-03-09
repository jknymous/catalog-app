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
    const [search, setSearch] = useState("")

    const [editModal, setEditModal] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [notif, setNotif] = useState<string | null>(null)

    const [editName, setEditName] = useState("")
    const [editPrice, setEditPrice] = useState(0)
    const [editSize, setEditSize] = useState("")

    const [generateModal, setGenerateModal] = useState(false)
    const [generatedText, setGeneratedText] = useState("")

    useEffect(() => {
        loadFish()
    }, [])

    function loadFish() {
        fetch("http://localhost:5000/fishes")
            .then(res => res.json())
            .then(data => {
                // SORT A-Z berdasarkan nama
                const sorted = data.sort((a: Fish, b: Fish) =>
                    a.name.localeCompare(b.name)
                )
                setFishes(sorted)
            })
    }

    function openModal(fish: Fish, action: "add" | "minus") {
        setSelectedFish(fish)
        setType(action)
        setModal(true)
    }

    function openEdit(fish: Fish) {
        setSelectedFish(fish)
        setEditName(fish.name)
        setEditPrice(fish.price)
        setEditSize(fish.size)
        setEditModal(true)
    }

    function openDelete(fish: Fish) {
        setSelectedFish(fish)
        setDeleteModal(true)
    }

    function generateStock() {

        const sizeOrder: any = {
            Maxton: 1,
            Big: 2,
            Normal: 3
        }

        const sorted = [...fishes].sort((a, b) => {

            const nameCompare = a.name.localeCompare(b.name)

            if (nameCompare !== 0) return nameCompare

            return sizeOrder[a.size] - sizeOrder[b.size]
        })

        const result = sorted.map((fish) => {

            let sizeText = ""

            if (fish.size === "Maxton") sizeText = "MAXTON"
            if (fish.size === "Big") sizeText = "BIG"

            const priceK = fish.price / 1000

            return `${fish.name} ${sizeText} ${priceK}k (${fish.stock})`
        })

        setGeneratedText(result.join("\n"))
        setGenerateModal(true)
    }

    function copyText() {

        navigator.clipboard.writeText(generatedText)

        setNotif("Stok berhasil dicopy")

        setTimeout(() => setNotif(null), 3000)
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

    async function submitEdit() {

        const res = await fetch("http://localhost:5000/edit-fish", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: selectedFish?.id,
                name: editName,
                price: editPrice,
                size: editSize
            })
        })

        const data = await res.json()

        setNotif(data.message)

        setEditModal(false)
        loadFish()

        setTimeout(() => setNotif(null), 3000)
    }

    async function submitDelete() {

        const res = await fetch("http://localhost:5000/delete-fish", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: selectedFish?.id
            })
        })

        const data = await res.json()

        setNotif(data.message)

        setDeleteModal(false)
        loadFish()

        setTimeout(() => setNotif(null), 3000)
    }

    return (
        <div className="p-2">

            {
                notif && (

                    <div className="fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
                        {notif}
                    </div>

                )
            }

            <div className="flex justify-between items-center mb-8">

                <h1 className="text-3xl font-bold text-black">
                    Stok Ikan
                </h1>

                <div className="flex gap-3">

                    <button
                        onClick={generateStock}
                        className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700"
                    >
                        Generate
                    </button>

                    <input
                        type="text"
                        placeholder="Cari nama ikan..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-64 px-4 py-2 border-2 border-slate-300 rounded-xl 
                                focus:outline-none focus:border-blue-500 text-slate-500"
                    />

                </div>

            </div>

            {/* GRID CARD */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">

                {fishes
                    .filter((fish) =>
                        fish.name.toLowerCase().includes(search.toLowerCase())
                    )
                    .sort((a, b) => {

                        const sizeOrder: any = {
                            Maxton: 1,
                            Big: 2,
                            Normal: 3
                        }

                        const nameCompare = a.name.localeCompare(b.name)

                        if (nameCompare !== 0) return nameCompare

                        return sizeOrder[a.size] - sizeOrder[b.size]
                    })
                    .map((fish) => (

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
                            <div className="p-2 text-center">

                                {/* NAMA TENGAH */}
                                <h2 className="font-semibold text-slate-800 text-md mb-2">
                                    {fish.name}
                                </h2>

                                {/* STOK + HARGA */}
                                <div className="flex justify-center gap-4 text-sm">

                                    <p className="text-slate-500">
                                        Stok: {fish.stock}
                                    </p>

                                    <p className="text-blue-600 font-semibold">
                                        Rp {fish.price?.toLocaleString()}
                                    </p>

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

                            <div className="flex border-t">

                                <button
                                    onClick={() => openEdit(fish)}
                                    className="flex-1 py-2 text-sm text-blue-600 hover:bg-blue-50"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => openDelete(fish)}
                                    className="flex-1 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))}

            </div>

            {/* MODAL */}
            {modal && (

                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

                    <div className="bg-white p-6 rounded-xl w-80">

                        <h2 className="text-xl font-semibold mb-4 text-center text-black">
                            {type === "add" ? "Tambah Stok" : "Kurangi Stok"}
                        </h2>

                        <input
                            type="number"
                            placeholder="Jumlah"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full border p-3 rounded-lg mb-4 text-black"
                        />

                        <div className="flex gap-3">

                            <button
                                onClick={() => setModal(false)}
                                className="flex-1 bg-gray-400 p-2 rounded-lg"
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

            {editModal && (

                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

                    <div className="bg-white p-6 rounded-xl w-80">

                        <h2 className="text-xl font-semibold mb-4 text-center text-black">
                            Edit Ikan
                        </h2>

                        <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full border p-3 rounded-lg mb-3 text-black"
                        />

                        <select
                            value={editSize}
                            onChange={(e) => setEditSize(e.target.value)}
                            className="w-full border p-3 rounded-lg mb-3 text-black"
                        >
                            <option>Normal</option>
                            <option>Big</option>
                            <option>Maxton</option>
                        </select>

                        <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(Number(e.target.value))}
                            className="w-full border p-3 rounded-lg mb-4 text-black"
                        />

                        <div className="flex gap-3">

                            <button
                                onClick={() => setEditModal(false)}
                                className="flex-1 bg-gray-400 p-2 rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={submitEdit}
                                className="flex-1 bg-blue-600 text-white p-2 rounded-lg"
                            >
                                Save
                            </button>

                        </div>

                    </div>
                </div>

            )}

            {deleteModal && (

                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

                    <div className="bg-white p-6 rounded-xl w-80 text-center">

                        <h2 className="text-lg font-semibold mb-4 text-black">
                            Yakin hapus ikan ini?
                        </h2>

                        <div className="flex gap-3">

                            <button
                                onClick={() => setDeleteModal(false)}
                                className="flex-1 bg-gray-400 p-2 rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={submitDelete}
                                className="flex-1 bg-red-600 text-white p-2 rounded-lg"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                </div>

            )}

            {generateModal && (

                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

                    <div className="bg-white p-6 rounded-xl w-96">

                        <h2 className="text-xl font-semibold mb-4 text-center text-black">
                            Generate Stok
                        </h2>

                        <textarea
                            value={generatedText}
                            readOnly
                            className="w-full h-64 border p-3 rounded-lg text-black mb-4"
                        />

                        <div className="flex gap-3">

                            <button
                                onClick={() => setGenerateModal(false)}
                                className="flex-1 bg-gray-400 p-2 rounded-lg"
                            >
                                Close
                            </button>

                            <button
                                onClick={copyText}
                                className="flex-1 bg-blue-600 text-white p-2 rounded-lg"
                            >
                                Copy
                            </button>

                        </div>

                    </div>
                </div>

            )}

        </div>
    )
}