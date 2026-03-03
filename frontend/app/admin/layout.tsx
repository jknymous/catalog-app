"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
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
        } catch {
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

    const menuClass = (path: string) =>
        `p-3 rounded-lg transition ${pathname === path
            ? "bg-blue-600 text-white"
            : "text-gray-700 hover:bg-blue-100"
        }`;

    return (
        <div className="flex h-screen bg-slate-100">

            {/* SIDEBAR */}
            <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">

                <h1 className="text-3xl font-mono font-bold text-blue-600 text-center mb-10">
                    JKNstore
                </h1>

                <nav className="flex flex-col gap-3">

                    <Link href="/admin" className={menuClass("/admin")}>
                        Dashboard
                    </Link>

                    <Link href="/admin/add-fish" className={menuClass("/admin/add-fish")}>
                        Add Fish
                    </Link>

                    <Link href="/admin/add-stok" className={menuClass("/admin/add-stok")}>
                        Add Stok
                    </Link>

                    <Link href="/admin/stok" className={menuClass("/admin/stok")}>
                        Stok
                    </Link>

                </nav>

                <button
                    onClick={logout}
                    className="mt-auto bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg"
                >
                    Logout
                </button>

            </aside>

            {/* CONTENT */}
            <main className="flex-1 p-10 overflow-y-auto">
                {children}
            </main>

        </div>
    );
}