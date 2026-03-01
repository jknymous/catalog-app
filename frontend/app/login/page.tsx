"use client";

import { useState } from "react";

export default function LoginPage() {
    const [show, setShow] = useState(false);
    const [msg, setMsg] = useState("");

    async function login(e: any) {
        e.preventDefault();

        const form = e.target;
        const username = form.username.value;
        const password = form.password.value;

        const res = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (data.message === "Login berhasil") {
            window.location.href = "/admin";
        } else {
            setMsg(data.message);
        }
    }

    return (
        <div className="bg-slate-100 h-screen flex items-center justify-center">
            <form
                onSubmit={login}
                className="bg-white w-[350px] p-8 rounded-2xl shadow-lg"
            >

                <h1 className="text-center text-3xl font-bold mb-8 text-slate-800">
                    JKNstore
                </h1>

                <input
                    name="username"
                    placeholder="Username"
                    className="w-full p-3 mb-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />

                <div className="relative mb-4">
                    <input
                        name="password"
                        type={show ? "text" : "password"}
                        placeholder="Password"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        onClick={() => setShow(!show)}
                        className="absolute right-3 top-3 text-sm text-gray-500"
                    >
                        {show ? "Hide" : "Show"}
                    </button>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition">
                    Login
                </button>

                <p className="text-red-500 text-center mt-4">{msg}</p>

            </form>
        </div>
    );
}