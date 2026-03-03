"use client";

import { useState } from "react";

export default function AddFishPage() {
    const [preview, setPreview] = useState<string | null>(null);
    const [notif, setNotif] = useState<{ type: string; message: string } | null>(null);

    async function handleSubmit(e: any) {
        e.preventDefault();

        const formData = new FormData(e.target);

        try {
            const res = await fetch("http://localhost:5000/add-fish", {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setNotif({ type: "success", message: data.message });
                e.target.reset();
                setPreview(null);
            } else {
                setNotif({ type: "error", message: "Gagal menambahkan fish" });
            }
        } catch {
            setNotif({ type: "error", message: "Server error bro" });
        }

        setTimeout(() => setNotif(null), 3000);
    }

    function handlePreview(e: any) {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    }

    return (
        <div className="flex justify-center items-center min-h-[80vh]">

            {/* NOTIF */}
            {notif && (
                <div
                    className={`fixed top-5 right-5 px-6 py-3 rounded-xl shadow-lg text-white
                            ${notif.type === "success" ? "bg-green-500" : "bg-red-500"}`}
                >
                    {notif.message}
                </div>
            )}

            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-3xl">

                {/* JUDUL TENGAH */}
                <h2 className="text-3xl font-bold mb-10 text-gray-800 text-center">
                    Add Fish
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* ROW 1 */}
                    <div className="grid grid-cols-2 gap-6">

                        {/* FOTO */}
                        <div>
                            <label className="block mb-2 font-semibold text-gray-800">
                                Foto
                            </label>

                            <div className="border-2 border-dashed border-blue-400 rounded-xl p-4 flex flex-col items-center justify-center h-[230px] relative">

                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="preview"
                                        className="h-full object-contain rounded-lg"
                                    />
                                ) : (
                                    <span className="text-gray-400">Preview Foto</span>
                                )}

                                {/* INPUT FILE DI DALAM BOX */}
                                <input
                                    type="file"
                                    name="photo"
                                    required
                                    onChange={handlePreview}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />

                                {/* <button
                                    type="button"
                                    className="absolute bottom-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                                >
                                    Choose Picture
                                </button> */}

                            </div>
                        </div>

                        {/* NAMA + SIZE */}
                        <div className="flex flex-col gap-5">

                            <div>
                                <label className="block mb-2 font-semibold text-gray-800">
                                    Nama
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    className="w-full border border-blue-400 text-gray-900 p-3 rounded-lg
                                            focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-semibold text-gray-800">
                                    Size
                                </label>
                                <select
                                    name="size"
                                    required
                                    className="w-full border border-blue-400 text-gray-900 p-3 rounded-lg
                                            focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Normal">Normal</option>
                                    <option value="Big">Big</option>
                                    <option value="Maxton">Maxton</option>
                                </select>
                            </div>

                        </div>

                    </div>

                    {/* STOCK FULL */}
                    <div>
                        <label className="block mb-2 font-semibold text-gray-800">
                            Stok
                        </label>
                        <input
                            type="number"
                            name="stock"
                            required
                            className="w-full border border-blue-400 text-gray-900 p-3 rounded-lg
                                    focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* SUBMIT */}
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition shadow-md">
                        Submit
                    </button>

                </form>
            </div>
        </div>
    );
}