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
                className="bg-white w-[360px] p-10 rounded-2xl shadow-xl"
            >

                {/* LOGO */}
                <h1 className="text-center text-4xl font-mono font-bold mb-10 text-blue-600 tracking-wide">
                    JKNstore
                </h1>

                {/* USERNAME */}
                <input
                    name="username"
                    placeholder="Username"
                    className="w-full p-3 mb-4 border border-blue-400 rounded-lg
                            focus:outline-none focus:ring-2 focus:ring-blue-500
                            placeholder:text-gray-400"
                />

                {/* PASSWORD */}
                <div className="relative mb-4">
                    <input
                        name="password"
                        type={show ? "text" : "password"}
                        placeholder="Password"
                        className="w-full p-3 border border-blue-400 rounded-lg
                                focus:outline-none focus:ring-2 focus:ring-blue-500
                                placeholder:text-gray-400"
                    />

                    {/* ICON EYE */}
                    <button
                        type="button"
                        onClick={() => setShow(!show)}
                        className="absolute right-3 top-3 text-gray-500 hover:text-blue-600"
                    >
                        {show ? (

                            /* EYE OFF */
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-10-7 1-3 5-7 10-7 1.125 0 2.2.2 3.2.575M6.5 6.5l11 11" />
                            </svg>

                        ) : (

                            /* EYE */
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>

                        )}
                    </button>
                </div>

                {/* BUTTON */}
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition shadow-md">
                    Login
                </button>

                {/* ERROR */}
                <p className="text-red-500 text-center mt-4">{msg}</p>

            </form>

        </div>
    );
}