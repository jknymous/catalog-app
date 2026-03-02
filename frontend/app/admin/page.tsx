"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkLogin();
    }, []);

    async function checkLogin() {
        try {
            const res = await fetch("http://localhost:5000/me", {
                credentials: "include",
            });

            const text = await res.text();

            if (text === "Belum login") {
                window.location.href = "/login";
            } else {
                setLoading(false);
            }
        } catch (err) {
            window.location.href = "/login";
        }
    }

    async function logout() {
        await fetch("http://localhost:5000/logout", {
            method: "POST",
            credentials: "include",
        });

        window.location.href = "/login";
    }

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                Checking login...
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-100">

            {/* SIDEBAR */}
            <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">

                <h1 className="text-2xl font-bold mb-10 text-center">
                    JKNstore
                </h1>

                <nav className="flex flex-col gap-3">
                    <div className="p-3 rounded-lg hover:bg-blue-100 cursor-pointer">
                        Dashboard
                    </div>
                    <div className="p-3 rounded-lg hover:bg-blue-100 cursor-pointer">
                        Add Fish
                    </div>
                    <div className="p-3 rounded-lg hover:bg-blue-100 cursor-pointer">
                        Add Stok
                    </div>
                    <div className="p-3 rounded-lg hover:bg-blue-100 cursor-pointer">
                        Stok
                    </div>
                </nav>

                <button
                    onClick={logout}
                    className="mt-auto bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg"
                >
                    Logout
                </button>

            </aside>

            {/* CONTENT */}
            <main className="flex-1 p-10">
                <h2 className="text-3xl font-bold mb-6">
                    Dashboard Admin
                </h2>

                <div className="bg-white rounded-xl shadow p-6">
                    Selamat datang di panel admin bro 😎
                </div>
            </main>

        </div>
    );
}