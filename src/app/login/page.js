"use client";

import { useState } from "react";
import Image from "next/image";
import user from "../../../public/images/user.png";
import googleIcon from "../../../public/images/googleIcon.png";
import SEO from "../../components/SEO";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./login.css"
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
    };

    return (
        <>
            <SEO
                title="Login"
                description="Login to your account on Glow Card."
                canonical="https://vercel.com/zeyad-mashaals-projects/glow-card/login"
            />
            <main className="flex justify-center items-center min-h-screen p-8 loginMain">
                <div className="max-w-md w-full login">
                    <Image src={user} width={150} height={150} alt="user login" />
                    <h1 className="text-4xl font-bold mb-6">اهلا بك, تسجيل الدخول</h1>
                    <form onSubmit={handleSubmit} className="space-y-4 w-full">
                        <div className="login-form">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                رقم الهاتف
                            </label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                                placeholder="5XX XXX XXX"
                            />
                            <span className="text-sm mt-1">+966</span>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md"
                        >
                            تسجيل الدخول
                        </button>
                        <div>
                            <button className="w-full bg-red-600 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 google-btn">
                                <Image src={googleIcon} width={50} height={50} alt="google" />
                                تسجيل بواسطة جوجل
                            </button>
                        </div>

                    </form>
                </div >
            </main >
        </>
    );
}
